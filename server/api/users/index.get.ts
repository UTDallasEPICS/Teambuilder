export default defineEventHandler(async (event) => {
  return await event.context.client.user.findMany({
    orderBy: { createdAt: "asc" },
  });
});