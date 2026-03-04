import { PrismaClient } from "@prisma/client"
const client = new PrismaClient({ datasourceUrl: process.env.PRISMA_DB_URL })
export default defineEventHandler(async event => {
  event.context.client = client
});