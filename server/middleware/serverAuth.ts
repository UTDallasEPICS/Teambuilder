import { PrismaClient } from "@prisma/client"
import { auth } from "~/server/lib/auth"

const client = new PrismaClient({ datasourceUrl: process.env.PRISMA_DB_URL })

const PUBLIC_PATHS = ["/api/auth"]

export default defineEventHandler(async (event) => {
  event.context.client = client

  const path = event.path ?? ""
  
  // Only protect /api/* routes, let frontend routes through
  if (!path.startsWith("/api/")) return
  
  // Let better-auth's own endpoints through
  if (PUBLIC_PATHS.some((p) => path.startsWith(p))) return

  const session = await auth.api.getSession({ headers: event.headers })
  if (!session) {
    throw createError({ statusCode: 401, message: "Unauthorized" })
  }

  event.context.session = session
})