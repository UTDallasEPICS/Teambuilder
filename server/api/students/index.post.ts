export default defineEventHandler(async (event) => {
  const students = await readBody(event);

  if (!Array.isArray(students)) {
    throw createError({
      statusCode: 400,
      message: 'Expected an array of students'
    });
  }

  const client = event.context.client;

  const created = await Promise.all(
    students.map(async (student: any) => {
      // upsert the Person record first using netID as the unique key
      const person = await client.person.upsert({
        where: { netID: student.netID },
        update: {
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email ?? undefined,
          github: student.github ?? undefined,
          discord: student.discord ?? undefined,
        },
        create: {
          netID: student.netID,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email ?? null,
          github: student.github ?? null,
          discord: student.discord ?? null,
        },
      });

      // upsert the Student record linked to the Person
      return client.student.upsert({
        where: { personId: person.id },
        update: {
          major: student.major,
          year: student.year,
          class: student.class,
          status: student.status,
        },
        create: {
          personId: person.id,
          major: student.major,
          year: student.year,
          class: student.class,
          status: student.status,
          enrollment: student.enrollment ?? null,
        },
      });
    })
  );

  return created;
});