// TODO: extract list of students and do the join
// TODO: also connect to project

export default defineEventHandler(async (event) => {
  const { name, partnerData, project, studentIds } = await readBody(event);
  const team = await event.context.client.team.create({
    data: {
      name, // Team name
      project: { // Connect to the project
        connect: { id: project, partnerData }
      },
      partner: {
        connect: {  id: partnerData }
      },
      Students: {
        connect: {  id: studentIds.map((studentId: string) => ({id: studentId}) )}
      }
    },
    include: {
      students: true, 
      project: true,  
    }
  });
  return team;
});