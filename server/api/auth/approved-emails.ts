import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const method = event.method;

  // GET - return all approved emails
  if (method === 'GET') {
    const users = await prisma.user.findMany({
      select: { email: true },
      orderBy: { createdAt: 'asc' }
    });
    return { emails: users };
  }

  // POST - add a new approved email
  if (method === 'POST') {
    const body = await readBody(event);
    const email = body?.email?.trim().toLowerCase();

    if (!email) {
      throw createError({ statusCode: 400, message: 'Email is required.' });
    }
    if (!email.endsWith('@utdallas.edu')) {
      throw createError({ statusCode: 400, message: 'Only @utdallas.edu addresses are allowed.' });
    }

    try {
      const user = await prisma.user.create({ data: { email } });
      return { success: true, email: user.email };
    } catch (err: any) {
      if (err.code === 'P2002') {
        throw createError({ statusCode: 409, message: 'That email is already approved.' });
      }
      throw createError({ statusCode: 500, message: 'Failed to add email.' });
    }
  }

  // DELETE - remove an approved email
  if (method === 'DELETE') {
    const body = await readBody(event);
    const email = body?.email?.trim().toLowerCase();

    if (!email) {
      throw createError({ statusCode: 400, message: 'Email is required.' });
    }

    try {
      await prisma.user.delete({ where: { email } });
      return { success: true };
    } catch (err: any) {
      if (err.code === 'P2025') {
        throw createError({ statusCode: 404, message: 'Email not found.' });
      }
      throw createError({ statusCode: 500, message: 'Failed to remove email.' });
    }
  }

  throw createError({ statusCode: 405, message: 'Method not allowed.' });
});