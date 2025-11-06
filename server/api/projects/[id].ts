import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) {
    return {
      statusCode: 400,
      body: {
        error: 'Project ID is required'
      }
    }
  }

  const method = event.method;
  const client: PrismaClient = event.context.client;
  const project = client.project;
  
  switch (method) {
    case 'GET':
      return project.findUnique({ where: { id } });
    case 'PUT':
      const updatedProject = await readBody(event);
      return project.update({
        where: { id },
        data: updatedProject,
      })
    case 'DELETE':
      return project.delete({ where: { id } });
  }
});