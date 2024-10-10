// TODO: extract list of students and do the join
// TODO: also connect to project
/*export default defineEventHandler(async event => {
  const { name } = await readBody(event);
  return event.context.client.team.create({
    data: {
      name,
    },
  });
});*/

export default defineEventHandler(async event => {
  const { name } = await readBody(event);
  const team = await event.context.client.team.create({
    data: {
      name,
      project: {
        connect: {
          id: projectId, // Assuming projectId is provided in the request body
        },
      },
      students: {
        connect: studentIds.map(id => ({ id })), // Connect students using the array of student IDs
      },
    },
  });

  return team; // Return the created team object
});
