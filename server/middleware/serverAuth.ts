import { PrismaClient } from "@prisma/client";
import { auth } from "~/server/lib/auth";

const client = new PrismaClient({ datasourceUrl: process.env.PRISMA_DB_URL });

export default defineEventHandler(async (event) => {
  event.context.client = client;

  // Don't protect auth routes themselves
  const path = getRequestURL(event).pathname;
  if (path.startsWith("/api/auth")) return;

  // Get session from better-auth
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  event.context.session = session;
  event.context.user = session?.user ?? null;
});