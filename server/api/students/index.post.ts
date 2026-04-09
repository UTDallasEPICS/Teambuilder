export default defineEventHandler(async (event) => {
  const students = await readBody(event);

  if (!Array.isArray(students)) {
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
          status: student.status
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
          status: student.status
        }
      })
    )
  );

  return createdStudents;
});
