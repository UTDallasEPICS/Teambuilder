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

export default defineEventHandler(async (event) => {
  const { name, partnerData, project } = await readBody(event);
  const team = await event.context.client.team.create({
    data: {
      name, // Team name
      project: { // Connect to the project
        connect: { id: project, partnerData }
      }
    },
    include: {
      students: true, // Optionally include the connected students in the response
      project: true,  // Optionally include the connected project in the response
    }
  });
  return team;
});

//Updated event handler to return team compused of data composed of name and project