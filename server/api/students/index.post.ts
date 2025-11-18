export default defineEventHandler(async (event) => {
  const students = await readBody(event);

  if (!Array.isArray(students)) {
    throw createError({
      statusCode: 400,
      message: 'Expected an array of students'
    });
  }

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
          status: student.status
        }
      })
    )
  );

  return createdStudents;
});
