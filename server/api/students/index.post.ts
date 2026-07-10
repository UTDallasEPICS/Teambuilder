import type {StudentCreate} from "~/server/services/studentService";
import studentService from "~/server/services/studentService";

export default defineEventHandler(async (event) => {
  const data = await readBody<StudentCreate>(event);
  setResponseStatus(event, 201);
  return await studentService.createStudent(data);
});
