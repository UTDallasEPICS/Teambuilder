export default defineEventHandler(async event => {
  const { id } = getQuery(event);
  await event.context.client.user.delete({
    where: { id },
  });
});