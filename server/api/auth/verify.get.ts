import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { setCookie } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const token = query.token as string;

  if (!token) {
    return sendRedirect(event, '/login?error=missing-token');
  }

  // Find the token in the database
  const magicToken = await prisma.magicToken.findUnique({ where: { token } });

  if (!magicToken) {
    return sendRedirect(event, '/login?error=invalid-token');
  }

  if (magicToken.used) {
    return sendRedirect(event, '/login?error=token-used');
  }

  if (new Date() > magicToken.expiresAt) {
    return sendRedirect(event, '/login?error=token-expired');
  }

  // Mark the token as used
  await prisma.magicToken.update({
    where: { token },
    data: { used: true },
  });

  // Create a session (7-day expiry)
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const sessionExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      token: sessionToken,
      email: magicToken.email,
      expiresAt: sessionExpiry,
    },
  });

  // Set the session cookie (httpOnly, secure in production)
  setCookie(event, 'session', sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    expires: sessionExpiry,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });

  return sendRedirect(event, '/projects');
});
