// TODO: will need to update team to student connections
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

