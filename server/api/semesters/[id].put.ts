import type {SemesterUpdate} from "~/server/services/semesterService";
import semesterService from "~/server/services/semesterService";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({statusCode: 400, statusMessage: 'Missing id parameter'});
  }

  const data = await readBody<SemesterUpdate>(event);
  return await semesterService.updateSemester(id, data);
});
