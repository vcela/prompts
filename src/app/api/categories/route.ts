import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const categories = await prisma.category.findMany({
    where: { userId: session.user.id },
    include: { _count: { select: { prompts: true } } },
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(
    categories.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() }))
  );
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name, color } = body;
  if (!name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

  try {
    const category = await prisma.category.create({
      data: { name: name.trim(), color: color || '#FF3B30', userId: session.user.id },
      include: { _count: { select: { prompts: true } } },
    });
    return NextResponse.json({ ...category, createdAt: category.createdAt.toISOString() });
  } catch {
    return NextResponse.json({ error: 'A category with this name already exists' }, { status: 400 });
  }
}
