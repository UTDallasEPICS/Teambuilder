import { auth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname;
  if (path.startsWith("/api/auth")) return;
  if (!path.startsWith("/api/")) return;

  console.log('[serverAuth] path:', path);

  let session = null;
  try {
    session = await auth.api.getSession({ headers: event.headers });
  } catch (e) {
    console.log('[serverAuth] session fetch failed:', e);
  }

  console.log('[serverAuth] user:', session?.user?.email ?? 'none');

  event.context.session = session;
  event.context.user = session?.user ?? null;

  if (!event.context.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  if (!event.context.user.whitelisted) {
    throw createError({ statusCode: 403, message: "Forbidden" });
  }

  if (event.context.user.removed) {
    throw createError({ statusCode: 403, message: "Account removed" });
  }
});