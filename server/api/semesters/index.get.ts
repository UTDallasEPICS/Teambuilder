import semesterService from "~/server/services/semesterService";

export default defineEventHandler(async () => {
  return await semesterService.getAllSemesters();
});
