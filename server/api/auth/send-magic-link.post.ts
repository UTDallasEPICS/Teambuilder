import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const email = body?.email?.trim().toLowerCase();

  if (!email) {
    throw createError({ statusCode: 400, message: 'Email is required.' });
  }

  if (!email.endsWith('@utdallas.edu')) {
    throw createError({ statusCode: 400, message: 'Only @utdallas.edu email addresses are allowed.' });
  }

  // Check if email is on the approved list
  const user = await prisma.user.findUnique({ where: { email } });

  // Intentionally vague response — don't reveal whether the email is approved or not
  if (!user) {
    return { success: true };
  }

  // Generate a secure one-time token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  // Invalidate any existing unused tokens for this user
  await prisma.magicToken.updateMany({
    where: { email, used: false },
    data: { used: true },
  });

  // Store the new token
  await prisma.magicToken.create({
    data: { token, email, expiresAt, userId: user.id },
  });

  // Build the magic link
  const baseUrl = process.env.BASE_URL || `http://localhost:3000`;
  const magicLink = `${baseUrl}/api/auth/verify?token=${token}`;

  // --- Email sending ---
  // The app does not currently have an email service configured.
  // In production, send `magicLink` via Resend, Nodemailer, or UTD SMTP.
  // For local development the link is logged to the server console so you
  // can click it directly without needing real email credentials.
  console.log(`\n[Auth] Magic link for ${email}:\n  ${magicLink}\n`);

  // TODO (production): replace the console.log above with your email call, e.g.:
  // await sendEmail({
  //   to: email,
  //   subject: 'Your Teambuilder login link',
  //   html: `<a href="${magicLink}">Click here to sign in</a> (expires in 15 minutes)`,
  // });

  return { success: true };
});
