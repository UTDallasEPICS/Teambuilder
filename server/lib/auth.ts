import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { magicLink } from "better-auth/plugins"
import { PrismaClient } from "@prisma/client"
import nodemailer from "nodemailer"

const prisma = new PrismaClient()

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
  
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await transporter.sendMail({
          from: process.env.SMTP_FROM ?? "EPICS Teambuilder <no-reply@utdallas.edu>",
          to: email,
          subject: "Your EPICS Teambuilder login link",
          html: `<p>Click below to sign in. This link expires in 15 minutes.</p>
                 <a href="${url}">Sign in to Teambuilder</a>`,
        })
      },
      // Only allow UTD emails
      disableSignUp: false, // sign-up = first login creates account
    }),
  ],

  // Reject non-UTD emails before anything hits the DB
  hooks: {
    before: [
      {
        matcher: (ctx) => ctx.path === "/sign-in/magic-link",
        handler: async (ctx) => {
          const email: string = ctx.body?.email ?? ""
          if (!email.endsWith("@utdallas.edu")) {
            throw new Error("Only @utdallas.edu email addresses are allowed.")
          }
        },
      },
    ],
  },
})