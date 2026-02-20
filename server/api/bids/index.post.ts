/**
 * POST /api/bids
 * Imports a parsed UTDesign/EPICS bid-response CSV.
 *
 * Expected row shape (after PapaParse with header:true):
 *   row["Student Name"]  – first name (may be multi-word, e.g. "Maryam Fatima")
 *   row[""]              – last name  (empty-string header from the blank column in the CSV)
 *   row["Student Email"] – email
 *   row["SSO ID"]        – netID (skip row if blank)
 *   row["Classification"]– Freshman | Sophomore | Junior | Senior
 *   row["Enrollment"]    – "EPCS 2200" | "EPCS 3200"
 *   row["School and Major"] – "Erik Jonsson … :::: Computer Science"
 *   row["Gender"]        – Male | Female | Non-binary | Prefer not to say
 *   row["Choice 1"] … row["Choice 6"] – "S26 - OrgName: ProjectTitle" (blank if none)
 */

import type { Year } from '@prisma/client';

// ── helpers ──────────────────────────────────────────────────────────────────

const YEAR_MAP: Record<string, Year> = {
  freshman:  'FRESHMAN',
  sophomore: 'SOPHOMORE',
  junior:    'JUNIOR',
  senior:    'SENIOR',
};

const MAJOR_MAP: Record<string, string> = {
  'computer science':    'CS',
  'software engineering': 'SE',
  'electrical engineering': 'EE',
  'mechanical engineering': 'ME',
  'biomedical engineering': 'BME',
  'data science':        'DS',
  'computer engineering': 'CE',
  'systems engineering': 'Systems',
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

/** Strip semester prefixes like "S26 - ", "F25 - ", "SP24 TH - " then trim */
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

// ─────────────────────────────────────────────────────────────────────────────

export default defineEventHandler(async (event) => {
  const rows: any[] = await readBody(event);

  if (!Array.isArray(rows) || rows.length === 0) {
    throw createError({ statusCode: 400, message: 'Expected a non-empty array of bid rows.' });
  }

  const client = event.context.client;

  // Fetch all projects once so we can match by name
  const allProjects = await client.project.findMany({ select: { id: true, name: true } });

  // Build a normalized name → id lookup for fast matching
  const projectLookup = new Map<string, string>(
    allProjects.map((p: { id: string; name: string }) => [normalizeProjectText(p.name), p.id])
  );

  const aliasLookup = new Map<string, string>([
    ['mlk', 'friends of mlk'],
    ['team formation', 'utdesign'],
    ['sci tech', 'sci tech discovery center'],
    ['center for children and fam', 'center for children and families'],
    ['the lab ms desiccant reuse', 'thelab ms'],
    ['mckinney library', 'mckinney public library'],
    ['tejiendo alianzas xuchil', 'tejiendo alianzas'],
  ]);

  // Fuzzy fallback: find the first project whose name contains the search string
  const findProjectId = (choiceRaw: string): string | null => {
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

    return null;
  };

  let studentsImported = 0;
  let choicesCreated  = 0;
  const skippedStudents: string[]   = [];
  const unmatchedProjects: string[] = [];

  for (const row of rows) {
    const netID = row['SSO ID']?.trim();
    if (!netID) {
      skippedStudents.push(row['Student Name'] ?? '(no name)');
      continue;
    }

    // ── Build student record ─────────────────────────────────────────────────
    const firstName = row['Student Name']?.trim() ?? '';
    const lastName  = row['']?.trim() ?? '';           // empty-header column
    const email     = row['Student Email']?.trim() || null;
    const yearRaw   = (row['Classification'] ?? '').trim().toLowerCase();
    const year: Year = YEAR_MAP[yearRaw] ?? 'FRESHMAN';
    const cls       = extractClass(row['Enrollment'] ?? '');
    const major     = extractMajor(row['School and Major'] ?? '');
    const status    = 'ACTIVE' as const;

    await client.student.upsert({
      where: { netID },
      update:  { firstName, lastName, email, year, class: cls, major, status },
      create:  { netID, firstName, lastName, email, year, class: cls, major, status,
                 github: null, discord: null, enrollment: row['Enrollment']?.trim() ?? null },
    });
    studentsImported++;

    // ── Process choices ──────────────────────────────────────────────────────
    const choiceKeys = ['Choice 1','Choice 2','Choice 3','Choice 4','Choice 5','Choice 6'];
    const choicesToCreate: { rank: number; studentId: string; projectId: string }[] = [];

    // Re-fetch the student to get their id
    const student = await client.student.findUnique({ where: { netID }, select: { id: true } });
    if (!student) continue;

    // Delete previous choices for this student so re-uploads are idempotent
    await client.choice.deleteMany({ where: { studentId: student.id } });

    for (let i = 0; i < choiceKeys.length; i++) {
      const raw = row[choiceKeys[i]]?.trim();
      if (!raw) continue;

      const projectId = findProjectId(raw);
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
