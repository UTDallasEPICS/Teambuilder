// TODO: need to do partner connection
export default defineEventHandler(async event => {
  const { name } = await readBody(event);
  return await event.context.client.project.create({
      data: {
       name,
      },
    });
});
