import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { magicLink } from "better-auth/plugins"
import { PrismaClient } from "@prisma/client"
import nodemailer from "nodemailer"

const prisma = new PrismaClient({ datasourceUrl: process.env.PRISMA_DB_URL })

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, { provider: "sqlite" }),
  // add book object
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        if (!email.endsWith("@utdallas.edu")) {
          throw new Error("Only @utdallas.edu email addresses are allowed.")
        }
        await transporter.sendMail({
          from: process.env.SMTP_FROM ?? "EPICS Teambuilder <no-reply@utdallas.edu>",
          to: email,
          subject: "Your EPICS Teambuilder login link",
          html: `<p>Click below to sign in. This link expires in 15 minutes.</p>
                <a href="${url}">Sign in to Teambuilder</a>`,
        })
      },
      disableSignUp: false,
    }),
  ],
})