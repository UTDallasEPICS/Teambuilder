import { PrismaClient } from "@prisma/client"
const client = new PrismaClient()
export default defineEventHandler(async event => {
  event.context.client = client
});