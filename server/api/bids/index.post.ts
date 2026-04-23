/**
 * POST /api/bids
 * Imports a parsed UTDesign/EPICS bid-response CSV.
 *
 * Expected row shape (after PapaParse with header:true):
 *   row["Student Name"]  - first name
 *   row[""]              - last name (empty-string header from blank column)
 *   row["Student Email"] - email
 *   row["SSO ID"]        - netID (skip row if blank)
 *   row["Classification"]- Freshman | Sophomore | Junior | Senior
 *   row["Enrollment"]    - "EPCS 2200" | "EPCS 3200"
 *   row["School and Major"] - "Erik Jonsson ... :::: Computer Science"
 *   row["Gender"]        - Male | Female | Non-binary | Prefer not to say
 *   row["Choice 1"] ... row["Choice 6"] - "S26 - OrgName: ProjectTitle"
 */

import type { Year } from '@prisma/client';

const YEAR_MAP: Record<string, Year> = {
  freshman:  'FRESHMAN',
  sophomore: 'SOPHOMORE',
  junior:    'JUNIOR',
  senior:    'SENIOR',
};

const MAJOR_MAP: Record<string, string> = {
  'computer science':       'CS',
  'software engineering':   'SE',
  'electrical engineering': 'EE',
  'mechanical engineering': 'ME',
  'biomedical engineering': 'BME',
  'data science':           'DS',
  'computer engineering':   'CE',
  'systems engineering':    'Systems',
};

function extractMajor(schoolAndMajor: string): string {
  const parts = schoolAndMajor.split('::::');
  const raw = (parts[1] ?? parts[0] ?? '').trim().toLowerCase();
  return MAJOR_MAP[raw] ?? (parts[1]?.trim() ?? 'Other');
}

function extractClass(enrollment: string): '2200' | '3200' {
  const match = enrollment.match(/\d{4}/);
  const n = match?.[0];
  return n === '3200' ? '3200' : '2200';
}

// strip semester prefixes like "S26 - " or "F25 - " then trim
function stripSemesterPrefix(choice: string): string {
  return choice.replace(/^[SF]\d{2,4}(\s+\S+)?\s*-\s*/, '').trim();
}

function normalizeProjectText(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const forcedDay = query.meetingDay as 'Wednesday' | 'Thursday' | undefined;
  const rows: any[] = await readBody(event);
  const merge = getQuery(event).merge === 'true';

  if (!Array.isArray(rows) || rows.length === 0) {
    throw createError({ statusCode: 400, message: 'Expected a non-empty array of bid rows.' });
  }

  const client = event.context.client;

  // extract semester from choice format e.g. "S26" from "S26 - ProjectName"
  let semesterCode = '';
  for (const row of rows) {
    for (let i = 1; i <= 6; i++) {
      const choice = row[`Choice ${i}`]?.trim();
      if (choice) {
        const match = choice.match(/^([SF]\d{2,4})/);
        if (match) {
          semesterCode = match[1];
          break;
        }
      }
    }
    if (semesterCode) break;
  }

  // parse semester code into year and season
  let semesterId = '';
  if (semesterCode) {
    const season = semesterCode[0] === 'S' ? 'SPRING' : 'FALL';
    const year = 2000 + parseInt(semesterCode.slice(1), 10);
    const semester = await client.semester.upsert({
      where: { year_season: { year, season: season as any } },
      update: {},
      create: { year, season: season as any },
    });
    semesterId = semester.id;
  }

  // create a default partner if none exists
  let defaultPartner = await client.partner.findFirst();
  if (!defaultPartner) {
    defaultPartner = await client.partner.create({
      data: {
        name: 'UTDesign EPICS',
        contactName: 'EPICS',
        contactEmail: 'epics@utdallas.edu',
      },
    });
  }

  // fetch all projects once for name matching
  let allProjects = await client.project.findMany({ select: { id: true, name: true } });
  let projectLookup = new Map<string, string>(
    allProjects.map((p: { id: string; name: string }) => [normalizeProjectText(p.name), p.id])
  );

  const getOrCreateProject = async (projectName: string): Promise<string | null> => {
    if (!projectName) return null;
    const normalized = normalizeProjectText(projectName);
    if (projectLookup.has(normalized)) return projectLookup.get(normalized)!;
    try {
      const created = await client.project.create({
        data: {
          name: projectName,
          description: projectName,
          type: 'SOFTWARE',
          status: 'NEW',
          repoURL: '',
          partnerId: defaultPartner.id,
        },
      });
      projectLookup.set(normalized, created.id);
      return created.id;
    } catch (err) {
      console.error(`Failed to create project "${projectName}":`, err);
      return null;
    }
  };

  const aliasLookup = new Map<string, string>([
    ['mlk', 'friends of mlk'],
    ['team formation', 'utdesign'],
    ['sci tech', 'sci tech discovery center'],
    ['center for children and fam', 'center for children and families'],
    ['the lab ms desiccant reuse', 'thelab ms'],
    ['mckinney library', 'mckinney public library'],
    ['tejiendo alianzas xuchil', 'tejiendo alianzas'],
  ]);

  const findOrCreateProjectId = async (choiceRaw: string): Promise<string | null> => {
    if (!choiceRaw?.trim()) return null;
    const stripped = stripSemesterPrefix(choiceRaw);
    const [orgPartSource = stripped, projectPartSource = ''] = stripped.split(':').map(p => p.trim());
    const normalizedFull = normalizeProjectText(stripped);
    if (!normalizedFull) return null;

    const orgPartRaw = normalizeProjectText(orgPartSource);
    const projectPartRaw = normalizeProjectText(projectPartSource);
    const orgPart = aliasLookup.get(orgPartRaw) ?? orgPartRaw;
    const projectPart = aliasLookup.get(projectPartRaw) ?? projectPartRaw;

    const candidates = [normalizedFull, orgPart, projectPart]
      .map(c => normalizeProjectText(c))
      .filter(Boolean);

    for (const candidate of candidates) {
      if (projectLookup.has(candidate)) return projectLookup.get(candidate)!;
    }
    for (const [name, id] of projectLookup) {
      for (const candidate of candidates) {
        if (name.includes(candidate) || candidate.includes(name)) return id;
      }
    }
    return await getOrCreateProject(stripped);
  };

  let studentsImported = 0;
  let choicesCreated = 0;
  const skippedStudents: string[] = [];
  const unmatchedProjects: string[] = [];

  for (const row of rows) {
    // debug - remove after confirming field names
    console.log('ROW KEYS:', Object.keys(row));
    console.log('FIRST ROW SAMPLE:', JSON.stringify(row).slice(0, 300));

    const netID = row['SSO ID']?.trim();
    if (!netID) {
      skippedStudents.push(row['Student Name'] ?? '(no name)');
      continue;
    }

    const firstName = row['Student Name']?.trim() ?? '';
    const lastName  = row['']?.trim() ?? '';
    const email     = row['Student Email']?.trim() || null;
    const yearRaw   = (row['Classification'] ?? '').trim().toLowerCase();
    const year: Year = YEAR_MAP[yearRaw] ?? 'FRESHMAN';
    const cls       = extractClass(row['Enrollment'] ?? '');
    const major     = extractMajor(row['School and Major'] ?? '');
    const gender    = row['Gender']?.trim() || null;
    const status    = 'ACTIVE' as const;

    // upsert Person first using netID as the key
    const person = await client.person.upsert({
      where: { netID },
      update: { firstName, lastName, email: email ?? undefined },
      create: { netID, firstName, lastName, email },
    });

    // upsert Student linked to the Person
    await client.student.upsert({
      where: { personId: person.id },
      update: {
        major,
        year,
        class: cls,
        status,
        gender: gender ?? undefined,
        meetingDay: forcedDay ?? undefined,
      },
      create: {
        personId: person.id,
        major,
        year,
        class: cls,
        status,
        gender,
        meetingDay: forcedDay ?? null,
        enrollment: row['Enrollment']?.trim() ?? null,
      },
    });
    studentsImported++;

    // re-fetch student to get id for choice linking
    const student = await client.student.findUnique({
      where: { personId: person.id },
      select: { id: true },
    });
    if (!student) continue;

    if (!merge) {
      await client.choice.deleteMany({ where: { studentId: student.id } });
    }

    const choiceKeys = ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4', 'Choice 5', 'Choice 6'];
    const choicesToCreate: { rank: number; studentId: string; projectId: string }[] = [];

    for (let i = 0; i < choiceKeys.length; i++) {
      // Pllleeaaassseee stop throwing errors
      const key = choiceKeys[i];
      if (!key) continue;
      const raw = row[key]?.trim();

      if (!raw) continue;
      const projectId = await findOrCreateProjectId(raw);
      if (!projectId) {
        const stripped = stripSemesterPrefix(raw);
        if (!unmatchedProjects.includes(stripped)) unmatchedProjects.push(stripped);
        continue;
      }
      choicesToCreate.push({ rank: i + 1, studentId: student.id, projectId });
    }

    if (choicesToCreate.length > 0) {
      await client.choice.createMany({ data: choicesToCreate });
      choicesCreated += choicesToCreate.length;
    }
  }

  return { studentsImported, choicesCreated, skippedStudents, unmatchedProjects };
});