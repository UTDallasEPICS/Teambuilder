import enrollmentService from "~/server/services/enrollmentService";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({statusCode: 400, statusMessage: 'Missing id parameter'});
  }

  const enrollment = await enrollmentService.getEnrollmentById(id);
  if (!enrollment) {
    throw createError({statusCode: 404, statusMessage: 'Enrollment not found'});
  }

  return enrollment;
});
