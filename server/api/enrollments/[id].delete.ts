import enrollmentService from "~/server/services/enrollmentService";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({statusCode: 400, statusMessage: 'Missing id parameter'});
  }

  await enrollmentService.deleteEnrollment(id);
  return null;
});
