export default defineEventHandler(async (event) => {
  // Delete related records first to avoid foreign key constraint violations
  
  // Delete all choices that reference projects
  await event.context.client.choice.deleteMany({});
  
  // Delete all teams that reference projects
  await event.context.client.team.deleteMany({});
  
  // Now delete all projects
  const result = await event.context.client.project.deleteMany({});
  
  return {
    success: true,
    count: result.count,
    message: `Deleted ${result.count} projects`
  };
});
