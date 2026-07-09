/**
 * POST /api/bids
 * Imports a parsed UTDesign/EPICS bid-response CSV.
 *
 * Expected row shape (after PapaParse with header:true):
 *   row["Student Name"]  – either full name ("Last, First") OR first name only
 *   row[""]              – optional last-name column in older CSV layouts
 *   row["Student Email"] – email
 *   row["SSO ID"]        – netID (skip row if blank)
 *   row["Classification"]– Freshman | Sophomore | Junior | Senior
 *   row["Enrollment"]    – "EPCS 2200" | "EPCS 3200"
 *   row["School and Major"] – "Erik Jonsson … :::: Computer Science"
 *   row["Gender"]        – Male | Female | Non-binary | Prefer not to say
 *   row["Choice 1"] … row["Choice 6"] – "S26 - OrgName: ProjectTitle" (blank if none)
 */

import {Year, Class, Gender, ProjectMeetingDay} from '~/prisma/generated';
import {prisma} from '~/server/utils/db';
import projectService from "~/server/services/projectService";

// ── helpers ──────────────────────────────────────────────────────────────────

const YEAR_MAP: Record<string, Year> = {
  freshman: 'FRESHMAN',
  sophomore: 'SOPHOMORE',
  junior: 'JUNIOR',
  senior: 'SENIOR',
};

const MAJOR_MAP: Record<string, string> = {
  'computer science': 'CS',
  'software engineering': 'SE',
  'electrical engineering': 'EE',
  'mechanical engineering': 'ME',
  'biomedical engineering': 'BME',
  'data science': 'DS',
  'computer engineering': 'CE',
  'systems engineering': 'Systems',
};

function extractMajor(schoolAndMajor: string): string {
  const parts = schoolAndMajor.split('::::');
  const raw = (parts[1] ?? parts[0] ?? '').trim().toLowerCase();
  return MAJOR_MAP[raw] ?? (parts[1]?.trim() ?? 'Other');
}

function extractClass(enrollment: string): 'EPCS_2200' | 'EPCS_3200' {
  const match = enrollment.match(/\d{4}/);
  const n = match?.[0];
  return n === '3200' ? 'EPCS_3200' : 'EPCS_2200';
}

function extractGender(gender: string): Gender {
  switch (gender.trim().toLowerCase()) {
    case 'male':
      return 'MALE'
    case 'female':
      return 'FEMALE'
    default:
      return 'OTHER'
  }
}

function parseStudentName(row: Record<string, any>): { firstName: string; lastName: string } {
  const rawName = String(
      row['Student Name'] ??
      row['Name'] ??
      row['Full Name'] ??
      row['Student'] ??
      row['student name'] ??
      row['name'] ??
      ''
  ).trim();
  const rawLastNameColumn = String(row[''] ?? '').trim();

  // New layout: full name is in a single column as "Last, First".
  if (rawName.includes(',')) {
    const [lastName = '', firstName = ''] = rawName.split(',').map((part) => part.trim());
    return {
      firstName,
      lastName,
    };
  }

  // Legacy layout: first name in the main name column and last name in empty-header column.
  if (rawLastNameColumn) {
    return {
      firstName: rawName,
      lastName: rawLastNameColumn,
    };
  }

  // Fallback: if no comma, treat final token as last name.
  const parts = rawName.split(/\s+/).filter(Boolean);
  if (parts.length <= 1) {
    return {
      firstName: rawName,
      lastName: '',
    };
  }

  return {
    firstName: parts.slice(0, -1).join(' '),
    lastName: parts[parts.length - 1],
  };
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

function normalizeProjectKey(input: string): string {
  return normalizeProjectText(input).replace(/\s+/g, '');
}

function readFirstValue(row: Record<string, any>, keys: string[]): string {
  for (const key of keys) {
    const value = row[key];
    if (value == null) continue;

    const text = String(value).trim();
    if (text) return text;
  }

  return '';
}

interface BidRecord {
  firstName: string,
  lastName: string,
  email?: string,
  netID: string,
  year: Year,
  class: Class,
  gender: Gender,
  major: string,
  choices: string[]
}

async function processBidRecord(semesterId: string, meetingDay: ProjectMeetingDay, record: BidRecord): Promise<void> {
  // create student record
  const studentInfo = {
    firstName: record.firstName,
    lastName: record.lastName,
    email: record.email,
  }
  const student = await prisma.student.upsert({
    where: {netID: record.netID},
    update: studentInfo,
    create: {...studentInfo, netID: record.netID},
  })
  // create enrollment record
  const enrollmentInfo = {
    meetingDay,
    gender: record.gender,
    major: record.major,
    year: record.year,
    class: record.class,
  }
  await prisma.enrollment.upsert({
    where: {studentId_semesterId: {studentId: student.id, semesterId}},
    update: enrollmentInfo,
    create: {...enrollmentInfo, studentId: student.id, semesterId},
  });
  // replace choices for student for that semester
  await prisma.choice.deleteMany({
    where: {
      studentId: student.id,
      semesterId,
    }
  });
  await prisma.choice.createMany({
    data: record.choices.map((choice, i) => ({
      studentId: student.id,
      semesterId,
      projectId: choice,
      rank: i + 1,
    }))
  })
}


export default defineEventHandler(async (event) => {
  const rows: any[] = await readBody(event);
  const semesterId = getQuery(event).semesterId as string;
  const rawMeetingDay = getQuery(event).meetingDay;
  const meetingDay =
      typeof rawMeetingDay === 'string' && rawMeetingDay.toUpperCase() === 'WEDNESDAY'
          ? 'WEDNESDAY'
          : typeof rawMeetingDay === 'string' && rawMeetingDay.toUpperCase() === 'THURSDAY'
              ? 'THURSDAY'
              : null;
  if (!meetingDay) {
    throw createError({statusCode: 400, message: 'Expected a meeting day (Wednesday/Thursday)'});
  }

  if (!Array.isArray(rows) || rows.length === 0) {
    throw createError({statusCode: 400, message: 'Expected a non-empty array of bid rows.'});
  }

  // Fetch all projects once so we can match by name
  let allProjects = await projectService.getAllProjects();

  // Build a normalized name → id lookup for fast matching
  let projectLookup = new Map<string, string>(
      allProjects.map((p: { id: string; name: string }) => [normalizeProjectKey(p.name), p.id])
  );

  // Helper to get or create project
  const getOrCreateProject = async (projectName: string): Promise<string | null> => {
    if (!projectName) return null;
    const normalized = normalizeProjectKey(projectName);

    // Check in existing lookup
    if (projectLookup.has(normalized)) {
      return projectLookup.get(normalized)!;
    }
    // Do NOT auto-create projects here. Return null so caller can
    // record the unmatched choice and avoid creating spurious entries.
    return null;
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

  // Fuzzy fallback: find or create the first project whose name matches
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
        .map(c => normalizeProjectKey(c))
        .filter(Boolean);

    // Check existing projects first
    for (const candidate of candidates) {
      if (projectLookup.has(candidate)) return projectLookup.get(candidate)!;
    }

    for (const [name, id] of projectLookup) {
      for (const candidate of candidates) {
        if (name.includes(candidate) || candidate.includes(name)) return id;
      }
    }

    // Not found—create it using the full stripped name
    return await getOrCreateProject(stripped);
  };

  let studentsImported = 0;
  let choicesCreated = 0;
  const skippedStudents: string[] = [];
  const unmatchedProjects: string[] = [];

  for (const row of rows) {
    const netID = readFirstValue(row, ['SSO ID', 'ssoid', 'netID', 'netid', 'id']);
    if (!netID) {
      skippedStudents.push(readFirstValue(row, ['Student Name', 'student name', 'name', 'fullName']) || '(no name)');
      continue;
    }

    // ── Build student record ─────────────────────────────────────────────────
    const {firstName, lastName} = parseStudentName(row);
    const email = readFirstValue(row, ['Student Email', 'student email', 'studentemail']) || null;
    const yearRaw = readFirstValue(row, ['Classification', 'classification']).toLowerCase();
    const year: Year = YEAR_MAP[yearRaw] ?? 'FRESHMAN';
    const cls = extractClass(readFirstValue(row, ['Enrollment', 'enrollment']));
    const major = extractMajor(readFirstValue(row, ['School and Major', 'school and major', 'major']));
    const gender = extractGender(readFirstValue(row, ['Gender', 'gender']));

    // ── Process choices ──────────────────────────────────────────────────────

    const chosenProjectIds = []

    const choiceKeys = ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4', 'Choice 5', 'Choice 6', 'choice1', 'choice2', 'choice3', 'choice4', 'choice5', 'choice6'];
    for (let i = 0; i < choiceKeys.length; i++) {
      const raw = readFirstValue(row, [choiceKeys[i]]);
      if (!raw) continue;

      const projectId = await findOrCreateProjectId(raw);
      if (!projectId) {
        const stripped = stripSemesterPrefix(raw);
        if (!unmatchedProjects.includes(stripped)) unmatchedProjects.push(stripped);
        continue;
      }

      chosenProjectIds.push(projectId);
    }

    const record = {
      firstName,
      lastName,
      netID,
      email: email ?? undefined,
      year,
      class: cls,
      gender,
      major,
      choices: chosenProjectIds,
    }
    await processBidRecord(semesterId, meetingDay, record);
    studentsImported++;
    choicesCreated += chosenProjectIds.length;
  }

  return {studentsImported, choicesCreated, skippedStudents, unmatchedProjects};
});
