import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email?.trim()) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
    include: { accounts: { where: { provider: 'google' } } },
  });

  // Always return success to prevent email enumeration
  if (!user) return NextResponse.json({ ok: true });

  if (!user.password && user.accounts.length > 0) {
    // Google-only account — send a helpful email instead
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? 'prompts <noreply@resend.dev>',
      to: email,
      subject: 'Sign in to prompts.',
      html: `
        <p>We received a password reset request for your account, but your account uses Google sign-in.</p>
        <p>Please sign in using the "Continue with Google" button instead.</p>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    });
    return NextResponse.json({ ok: true });
  }

  // Delete any existing reset tokens for this email
  await prisma.verificationToken.deleteMany({ where: { identifier: email } });

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.verificationToken.create({
    data: { identifier: email.trim().toLowerCase(), token, expires },
  });

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'prompts <noreply@resend.dev>',
    to: email,
    subject: 'Reset your password',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#111">Reset your password</h2>
        <p>Click the button below to reset your password. This link expires in <strong>1 hour</strong>.</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#FF3B30;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;margin:16px 0">
          Reset password
        </a>
        <p style="color:#6b7280;font-size:13px">If you did not request a password reset, you can ignore this email.</p>
        <p style="color:#6b7280;font-size:13px">Or copy this link: ${resetUrl}</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
