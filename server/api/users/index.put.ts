export default defineEventHandler(async (event) => {
  // SECURITY CHECK: Ensure the person making this request is actually an admin
  const currentUser = event.context.user;
  
  if (!currentUser || currentUser.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden: Only admins can modify user permissions.",
    });
  }

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