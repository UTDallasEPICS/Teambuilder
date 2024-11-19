// TODO: extract list of students and do the join
// TODO: also connect to project

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
        connect: studentIds.map((studentId: string) => ({id: studentId}) )
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