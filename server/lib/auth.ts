import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink } from "better-auth/plugins";
import { PrismaClient } from "@prisma/client";
import { createTransport } from "nodemailer";

const prisma = new PrismaClient({
  datasourceUrl: process.env.PRISMA_DB_URL,
});

const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
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
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: email,
          subject: "Your EPICS Teambuilder login link",
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
              <h2>Sign in to EPICS Teambuilder</h2>
              <p>Click the button below to sign in. This link expires in 10 minutes.</p>
              <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #c75b12; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Sign in
              </a>
              <p style="margin-top: 16px; color: #666; font-size: 14px;">
                If you didn't request this, you can safely ignore this email.
              </p>
            </div>
          `,
        });
      },
    }),
  ],
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
  ],
});

export type Session = typeof auth.$Infer.Session;

// Ensure admin user exists on startup
prisma.user.upsert({
  where: { email: 'sxt230118@utdallas.edu' },
  update: {},
  create: {
    id: 'admin-001',
    email: 'sxt230118@utdallas.edu',
    name: 'Snigdha Tadi',
    emailVerified: true,
    role: 'admin',
    whitelisted: true,
    removed: false,
  }
}).then(() => {
  console.log('[Auth] Admin user ensured');
}).catch((e) => {
  console.error('[Auth] Failed to ensure admin user:', e);
});