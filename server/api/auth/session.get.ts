import { PrismaClient } from '@prisma/client';
import { getCookie } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const sessionToken = getCookie(event, 'session');

  if (!sessionToken) {
    return { authenticated: false, email: null };
  }

  const session = await prisma.session.findUnique({ where: { token: sessionToken } });

  if (!session || new Date() > session.expiresAt) {
    return { authenticated: false, email: null };
  }

  return { authenticated: true, email: session.email };
});
