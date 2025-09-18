import { sortSemesters } from "~/server/services/semesterService";

export default defineEventHandler(async event => {
  const semestersQuery = await event.context.client.semester.findMany();

  return sortSemesters(semestersQuery);
})