import { PrismaClient } from '@prisma/client';
import { getCookie, deleteCookie } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const sessionToken = getCookie(event, 'session');

  if (sessionToken) {
    // Delete session from DB
    await prisma.session.deleteMany({ where: { token: sessionToken } }).catch(() => {});
    // Clear cookie
    deleteCookie(event, 'session', { path: '/' });
  }

  return { success: true };
});
