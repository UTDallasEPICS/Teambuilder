import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink } from "better-auth/plugins";
import { PrismaClient } from "@prisma/client";
import { createTransport } from "nodemailer";

const PRE_APPROVED_USERS = [
  { email: 'amt101000@utdallas.edu', name: 'Andrea Turcatti', role: 'admin' },
  { email: 'sxt230118@utdallas.edu', name: 'Snigdha Tadi', role: 'admin' },
];

const prisma = new PrismaClient({
  datasourceUrl: process.env.PRISMA_DB_URL,
});

// Current Nodemailer setup
const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "sqlite" }),
  user: {
    modelName: "user",
    additionalFields: {
      role: { type: "string", defaultValue: "user" },
      whitelisted: { type: "boolean", defaultValue: false },
      removed: { type: "boolean", defaultValue: false },
    },
  },
  session: {
    modelName: "baSession",
  },
  account: {
    modelName: "baAccount",
  },
  verification: {
    modelName: "baVerification",
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const approvedUser = PRE_APPROVED_USERS.find(u => u.email === user.email);
          return {
            data: {
              ...user,
              role: approvedUser ? approvedUser.role : "user",
              whitelisted: !!approvedUser,
              removed: false,
            }
          };
        }
      }
    }
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        const subject = `EPICS Teambuilder Login - ${email}`;

        // BCC Logic: Use ENV if available, otherwise default to you for now
        const bccAddress = process.env.ADMIN_BCC !== undefined
          ? process.env.ADMIN_BCC
          : "sxt230118@utdallas.edu";

        // THE FIX: Don't BCC yourself if you are the one logging in
        const finalBcc = email === bccAddress ? undefined : bccAddress;

        const htmlContent = `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2>Sign in to EPICS Teambuilder</h2>
            <p>Click the button below to sign in. This link expires in 10 minutes.</p>
            <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #c75b12; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Sign in
            </a>
            <p style="margin-top: 24px; color: #999; font-size: 12px;">Requested for: ${email}</p>
          </div>
        `;

        console.log({url});

        if (process.env.RESEND_API_KEY) {
          await $fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: {
              from: process.env.SMTP_FROM || "onboarding@resend.dev",
              to: email,
              bcc: finalBcc || undefined,
              subject: subject,
              html: htmlContent
            }
          });
        } else {
          await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            bcc: finalBcc || undefined,
            subject: subject,
            html: htmlContent,
          });
        }
      },
    }),
  ],
  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
});

export type Session = typeof auth.$Infer.Session;

// Upsert logic for startup
Promise.all(
  PRE_APPROVED_USERS.map((u, index) =>
    prisma.user.upsert({
      where: { email: u.email },
      update: { role: u.role, whitelisted: true, removed: false },
      create: {
        id: `pre-approved-${index}`,
        email: u.email,
        name: u.name,
        emailVerified: true,
        role: u.role,
        whitelisted: true,
        removed: false,
      },
    })
  )
).catch((e) => console.error('[Auth] Startup Upsert Failed:', e));
