import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) {
    return {
      statusCode: 400,
      body: {
        error: 'Student ID is required'
      }
    }
  }

  const method = event.method;
  const client: PrismaClient = event.context.client;
  const student = client.student;
  
  switch (method) {
    case 'GET':
      return student.findUnique({ where: { id } });
    case 'PUT':
      const updatedStudent = await readBody(event);
      return student.update({
        where: { id },
        data: updatedStudent,
      })
    case 'DELETE':
      return student.delete({ where: { id } });
  }
});
