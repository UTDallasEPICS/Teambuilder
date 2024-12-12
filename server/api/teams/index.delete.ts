export default defineEventHandler(async event => {
  const { id } = getQuery(event);
  await event.context.client.team.update({
    where: {
      id
    },
    data: {
      removed:true,
    },
  });
});
