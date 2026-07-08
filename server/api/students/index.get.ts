import studentService from "~/server/services/studentService";

export default defineEventHandler(async () => {
  return await studentService.getAllStudents();
});
