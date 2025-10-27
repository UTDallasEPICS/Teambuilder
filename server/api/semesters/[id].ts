import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) {
    return {
      statusCode: 400,
      body: {
        error: 'Semester ID is required'
      }
    }
  }

  const method = event.method;
  const client: PrismaClient = event.context.client;
  const semester = client.semester;
  
  switch (method) {
    case 'GET':
      return semester.findUnique({ where: { id } });
    case 'PUT':
      const updatedSemester = await readBody(event);
      return semester.create({
        data: updatedSemester,
      })
    case 'DELETE':
      return semester.delete({ where: { id } });
  }
});
