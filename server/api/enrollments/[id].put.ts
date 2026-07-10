import type {EnrollmentUpdate} from "~/server/services/enrollmentService";
import enrollmentService from "~/server/services/enrollmentService";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({statusCode: 400, statusMessage: 'Missing id parameter'});
  }

  const data = await readBody<EnrollmentUpdate>(event);
  return await enrollmentService.updateEnrollment(id, data);
});
