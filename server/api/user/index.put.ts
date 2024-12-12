// TODO: Finish implementation of user handlers and test them
export default defineEventHandler(async event => {
  const { id, email } = await readBody(event);
  await event.context.client.user.update({
    where: {
      id
    },
    data: {
      email  
    },
  });
});
