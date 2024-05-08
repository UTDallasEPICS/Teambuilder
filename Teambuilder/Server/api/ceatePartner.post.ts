
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createPartner = async (name: string, contact_name: string, contact_email: string) => {
  return await prisma.partner.create({
    data: {
      name,
      contact_name,
      contact_email,
    },
  });
};
