export default defineEventHandler(async (event) => {
  // Delete all students
  const result = await event.context.client.student.deleteMany({});
  
  return {
    success: true,
    count: result.count,
    message: `Deleted ${result.count} students`
  };
});
