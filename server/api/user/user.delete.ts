export default defineEventHandler(async event => {
  const { id } = getQuery(event);
  await event.context.client.user.update({
    where: {
      id
    },
    data: {
      removed:true,
    },
  });
});
