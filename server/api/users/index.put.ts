export default defineEventHandler(async (event) => {
  const { id, whitelisted, removed, role } = await readBody(event);
  return await event.context.client.user.update({
    where: { id },
    data: {
      ...(whitelisted !== undefined && { whitelisted }),
      ...(removed !== undefined && { removed }),
      ...(role !== undefined && { role }),
    },
  });
});