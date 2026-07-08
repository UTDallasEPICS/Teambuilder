import studentService from "~/server/services/studentService";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({statusCode: 400, statusMessage: 'Missing id parameter'});
  }

  const student = await studentService.getStudentById(id);
  if (!student) {
    throw createError({statusCode: 404, statusMessage: 'Student not found'});
  }

  return student;
});
