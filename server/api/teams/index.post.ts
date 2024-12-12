// TODO: Test the POST

export default defineEventHandler(async (event) => {
  const { id, name, project, studentIds, partnerData, thursdayTeam } = await readBody(event);
  const team = await event.context.client.team.create({
    data: {
      id, // unique team id
      name, // team name
      Project: { // connect to the project
        connect: { id: project}
      },
      Partner: {
        connect: {  id: partnerData }
      },
      Students: {
        connect: studentIds.map((studentId: string) => ({id: studentId}) ) // extract list of students
      },
      thursdayTeam: thursdayTeam
    },
    include: {
      Students: true, 
      Project: true,  
    }
  });
  return team;
});