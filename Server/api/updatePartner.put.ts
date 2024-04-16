import { PrismaClient, Partner } from '@prisma/client';

const prisma = new PrismaClient();

export const updatePartner = async (partnerId: string, newData: Partial<Partner>): Promise<Partner | null> => {
  const { name, contact_name, contact_email, projects, teams } = newData;
  return await prisma.partner.update({
    where: {
      id: partnerId,
    },
    data: {
      name,
      contact_name,
      contact_email,
      projects, 
      teams,   
    },
  });
};
