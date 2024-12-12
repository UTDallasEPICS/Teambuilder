// TODO: will need to update team to student connections
// TODO: Finish implementation of team handlers and test them
export default defineEventHandler(async event => {
  const { id, name } = await readBody(event);
  await event.context.client.team.update({
    where: {
      id
    },
    data: {
      name, 
      
    },
  });
});

