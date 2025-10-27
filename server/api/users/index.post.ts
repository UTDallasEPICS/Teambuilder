export default defineEventHandler(async event => {
  const { email } = await readBody(event);
  return await event.context.client.user.create({
    data: {
      email,
    },
  });
});
