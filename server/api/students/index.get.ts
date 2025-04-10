export default defineEventHandler(async (event) => {
  return event.context.client.student.findMany();
})