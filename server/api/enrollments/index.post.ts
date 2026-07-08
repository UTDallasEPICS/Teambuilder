import type {EnrollmentCreate} from "~/server/services/enrollmentService";
import enrollmentService from "~/server/services/enrollmentService";

export default defineEventHandler(async (event) => {
  const data = await readBody<EnrollmentCreate>(event);
  setResponseStatus(event, 201);
  return await enrollmentService.createEnrollment(data);
});
