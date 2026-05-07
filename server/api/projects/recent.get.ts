export default defineEventHandler(async (event) => {
  const hours = Number(getQuery(event).hours ?? 24);
  const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
  const projects = await event.context.client.project.findMany({
    where: { createdAt: { gte: cutoff } },
    select: { id: true, name: true, partnerId: true, createdAt: true },
    orderBy: { createdAt: 'desc' }
  });
  return { projects };
});
