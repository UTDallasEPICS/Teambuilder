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

  // Create all students in the database
  const createdStudents = await Promise.all(
    students.map((student: any) =>
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
          meetingDay: normalizeMeetingDay(student.meetingDay ?? student.day ?? student.meeting_day),
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
          meetingDay: normalizeMeetingDay(student.meetingDay ?? student.day ?? student.meeting_day),
          status: deriveStatus(student)
        }
      })
    )
  );

  return createdStudents;
});
