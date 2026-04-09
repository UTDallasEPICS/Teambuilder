import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) {
    return {
      statusCode: 400,
      body: {
        error: 'Partner ID is required'
      }
    }
  }

  const method = event.method;
  const client: PrismaClient = event.context.client;
  const partner = client.partner;
  
  switch (method) {
    case 'GET':
      // Reuse the existing GET logic
      return partner.findUnique({
        where: { id },
        include: {
          projects: {
            select: { name: true },
          },
        },
      }).then((p: any) => ({
        ...p,
        projectName: p?.projects?.map((pr: any) => pr.name).join(', ') || 'None',
      }));
    case 'PUT':
      const updatedPartner = await readBody(event);
      return partner.update({
        where: { id },
        data: updatedPartner,
      })
    case 'DELETE':
      return partner.delete({ where: { id } });
  }
});
