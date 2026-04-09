import { auth } from "~/server/lib/auth"

export default defineEventHandler((event) => {
  return auth.handler(toWebRequest(event))
})