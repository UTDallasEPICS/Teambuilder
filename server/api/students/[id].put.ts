import type {StudentUpdate} from "~/server/services/studentService";
import studentService from "~/server/services/studentService";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({statusCode: 400, statusMessage: 'Missing id parameter'});
  }

  const data = await readBody<StudentUpdate>(event);
  return await studentService.updateStudent(id, data);
});
