
import { PrismaClient, Partner } from '@prisma/client';
const prisma = new PrismaClient();

export const getPartnerById = async (name: string): Promise<Partner | null> => {
  return await prisma.partner.findUnique({
    where: {
      id: name,
    },
  });
};