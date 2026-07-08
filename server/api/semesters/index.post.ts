import type {SemesterCreate} from "~/server/services/semesterService";
import semesterService from "~/server/services/semesterService";

export default defineEventHandler(async (event) => {
  const data = await readBody<SemesterCreate>(event);
  setResponseStatus(event, 201);
  return await semesterService.createSemester(data);
});
