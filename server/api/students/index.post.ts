import { sortSemesters } from '~/server/services/semesterService';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const students = Array.isArray(body)
    ? body
    : Array.isArray(body?.students)
      ? body.students
      : null;
  const semesterId = Array.isArray(body) ? null : (body?.semesterId ?? null);

  if (!students) {
    throw createError({
      statusCode: 400,
      message: 'Expected an array of students'
    });
  }

  type MeetingDay = 'WEDNESDAY' | 'THURSDAY' | 'BOTH';
  type Year = 'FRESHMAN' | 'SOPHOMORE' | 'JUNIOR' | 'SENIOR';

  const normalizeMeetingDay = (value: unknown): MeetingDay | null => {
    if (value == null) return null;
    const cleaned = String(value).trim().toUpperCase();

    if (cleaned === 'WEDNESDAY' || cleaned === 'WED') return 'WEDNESDAY';
    if (cleaned === 'THURSDAY' || cleaned === 'THU' || cleaned === 'THURS') return 'THURSDAY';
    if (
      cleaned === 'BOTH' ||
      cleaned === 'WEDNESDAY,THURSDAY' ||
      cleaned === 'THURSDAY,WEDNESDAY' ||
      cleaned === 'WEDNESDAY/THURSDAY' ||
      cleaned === 'THURSDAY/WEDNESDAY' ||
      cleaned === 'WEDNESDAY&THURSDAY' ||
      cleaned === 'THURSDAY&WEDNESDAY'
    ) return 'BOTH';

    return null;
  };

  const normalizeYear = (value: unknown): Year => {
    const cleaned = String(value ?? '').trim().toUpperCase();
    if (cleaned === 'SOPHOMORE') return 'SOPHOMORE';
    if (cleaned === 'JUNIOR') return 'JUNIOR';
    if (cleaned === 'SENIOR') return 'SENIOR';
    return 'FRESHMAN';
  };

  const allSemesters = sortSemesters(await event.context.client.semester.findMany());
  const latestSemesterId = allSemesters[0]?.id ?? null;

  const uploadedNetIds = [...new Set(
    students
      .map((student: any) => String(student?.netID ?? '').trim())
      .filter((netID: string) => !!netID)
  )];

  const latestSemesterStudents = latestSemesterId && uploadedNetIds.length > 0
    ? await event.context.client.student.findMany({
        where: {
          netID: { in: uploadedNetIds },
          teams: {
            some: {
              semesterId: latestSemesterId,
            },
          },
        },
        select: {
          netID: true,
        },
      })
    : [];

  const latestSemesterNetIdSet = new Set(latestSemesterStudents.map((student: { netID: string }) => student.netID));

  const deriveStatus = (student: any): 'ACTIVE' | 'INACTIVE' => {
    if (!semesterId) {
      return student?.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';
    }

    if (!latestSemesterId || semesterId === latestSemesterId) {
      return 'ACTIVE';
    }

    const netID = String(student?.netID ?? '').trim();
    return latestSemesterNetIdSet.has(netID) ? 'ACTIVE' : 'INACTIVE';
  };

  const sanitizeStudent = (student: any) => {
    const netID = String(student?.netID ?? '').trim();
    if (!netID) return null;

    return {
      netID,
      firstName: String(student?.firstName ?? '').trim(),
      lastName: String(student?.lastName ?? '').trim(),
      email: student?.email ?? null,
      github: student?.github ?? null,
      discord: student?.discord ?? null,
      major: String(student?.major ?? 'Other').trim() || 'Other',
      year: normalizeYear(student?.year),
      class: String(student?.class ?? '2200').trim() || '2200',
      meetingDay: normalizeMeetingDay(student?.meetingDay ?? student?.day ?? student?.meeting_day),
      status: deriveStatus(student),
    };
  };

  type SanitizedStudent = NonNullable<ReturnType<typeof sanitizeStudent>>;

  const sanitizedStudents: SanitizedStudent[] = students
    .map((student: any) => sanitizeStudent(student))
    .filter((student: ReturnType<typeof sanitizeStudent>): student is SanitizedStudent => !!student);

  if (sanitizedStudents.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'No valid students found. Each row must include netID.'
    });
  }

  // Create all students in the database
  const createdStudents = await Promise.all(
    sanitizedStudents.map((student) =>
      event.context.client.student.upsert({
        where: { netID: student.netID },
        update: {
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          github: student.github,
          discord: student.discord,
          major: student.major,
          year: student.year,
          class: student.class,
          meetingDay: student.meetingDay,
          status: deriveStatus(student)
        },
        create: {
          netID: student.netID,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          github: student.github,
          discord: student.discord,
          major: student.major,
          year: student.year,
          class: student.class,
          meetingDay: student.meetingDay,
          status: deriveStatus(student)
        }
      })
    )
  );

  return createdStudents;
});
