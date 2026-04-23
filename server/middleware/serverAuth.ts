import { PrismaClient } from "@prisma/client";
import { auth } from "~/server/lib/auth";

const client = new PrismaClient({ datasourceUrl: process.env.PRISMA_DB_URL });

const PUBLIC_PATHS = ["/api/auth"];

export default defineEventHandler(async (event) => {
  event.context.client = client;

  const path = event.path ?? "";

  // only protect api routes
  if (!path.startsWith("/api/")) return;

  // let better-auth endpoints through
  if (PUBLIC_PATHS.some((p) => path.startsWith(p))) return;

  const session = await auth.api.getSession({ headers: event.headers });
  if (!session) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  event.context.session = session;

  // look up the Personnel record linked to this email so routes can check role
  // person is found by email then personnel is found via the person
  const person = await client.person.findUnique({
    where: { email: session.user.email },
    include: { personnel: true },
  });

  // attach role to context so any route can do event.context.role
  // null means they are not personnel - could be a student with no site access
  event.context.role = person?.personnel?.role ?? null;
});
