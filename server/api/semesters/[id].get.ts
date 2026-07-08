import semesterService from "~/server/services/semesterService";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({statusCode: 400, statusMessage: 'Missing id parameter'});
  }

  const semester = await semesterService.getSemesterById(id);
  if (!semester) {
    throw createError({statusCode: 404, statusMessage: 'Semester not found'});
  }

  return semester;
});
