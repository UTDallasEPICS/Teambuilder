import enrollmentService from "~/server/services/enrollmentService";

export default defineEventHandler(async () => {
  return await enrollmentService.getAllEnrollments();
});
