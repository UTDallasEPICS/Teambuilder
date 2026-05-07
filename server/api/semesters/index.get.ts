import { createSemesters } from "~/server/factories/semester";
import { sortSemesters } from "~/server/services/semesterService";

export default defineEventHandler(async event => {
  const semestersQuery = await event.context.client.semester.findMany();

  if (semestersQuery.length === 0) {
    await event.context.client.semester.createMany({
      data: createSemesters(),
    });

    return sortSemesters(await event.context.client.semester.findMany());
  }

  return sortSemesters(semestersQuery);
})