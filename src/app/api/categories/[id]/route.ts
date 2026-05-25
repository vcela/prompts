import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.category.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const category = await prisma.category.update({
    where: { id: params.id },
    data: { name: body.name?.trim(), color: body.color },
    include: { _count: { select: { prompts: true } } },
  });
  return NextResponse.json({ ...category, createdAt: category.createdAt.toISOString() });
}
