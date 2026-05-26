import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password } = body;

  if (!email?.trim() || !password?.trim()) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
    include: { accounts: { where: { provider: 'google' } } },
  });

  if (existing) {
    if (existing.accounts.length > 0) {
      return NextResponse.json({
        error: 'This email is linked to a Google account. Please sign in with Google.',
        provider: 'google',
      }, { status: 400 });
    }
    return NextResponse.json({ error: 'This email is already registered' }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name: name?.trim() || null,
      email: email.trim().toLowerCase(),
      password: hashed,
    },
  });

  return NextResponse.json({ ok: true });
}
