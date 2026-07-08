import semesterService from "~/server/services/semesterService";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({statusCode: 400, statusMessage: 'Missing id parameter'});
  }

  await semesterService.deleteSemester(id);
  return null;
});
