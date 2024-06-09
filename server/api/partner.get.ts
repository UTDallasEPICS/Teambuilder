export default defineEventHandler(async event => {
  const { id } = getQuery(event);
  return await event.context.client.partner.findFirst({
    where: {
      id
    }
  });
});
