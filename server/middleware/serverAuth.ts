import { PrismaClient } from "@prisma/client";
import { getCookie } from "h3";

const client = new PrismaClient();

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  '/api/auth/send-magic-link',
  '/api/auth/verify',
  '/api/auth/session',
  '/api/auth/logout',
  '/api/auth/admin-verify',
];

export default defineEventHandler(async (event) => {
  event.context.client = client;

  const path = event.path;

  // Only guard API routes
  if (!path.startsWith('/api/')) return;

  // Allow public auth routes through
  if (PUBLIC_ROUTES.some(r => path.startsWith(r))) return;

  // Check session cookie
  const sessionToken = getCookie(event, 'session');
  if (!sessionToken) {
    throw createError({ statusCode: 401, message: 'Unauthorized: please log in.' });
  }

  const session = await client.session.findUnique({ where: { token: sessionToken } });
  if (!session || new Date() > session.expiresAt) {
    throw createError({ statusCode: 401, message: 'Session expired: please log in again.' });
  }

  // Attach user email to context for downstream handlers
  event.context.userEmail = session.email;
});
