import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function serialize(p: {
  id: string; title: string; content: string; tags: string;
  categoryId: string | null; createdAt: Date; updatedAt: Date;
  category: { id: string; name: string; color: string; createdAt: Date } | null;
}) {
  return {
    ...p,
    tags: JSON.parse(p.tags) as string[],
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    category: p.category
      ? { ...p.category, createdAt: p.category.createdAt.toISOString() }
      : null,
  };
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { title, content, tags, categoryId } = body;

  const prompt = await prisma.prompt.update({
    where: { id: params.id },
    data: {
      ...(title !== undefined && { title: title.trim() }),
      ...(content !== undefined && { content: content.trim() }),
      ...(tags !== undefined && { tags: JSON.stringify(tags) }),
      ...(categoryId !== undefined && { categoryId: categoryId || null }),
    },
    include: { category: true },
  });

  return NextResponse.json(serialize(prompt));
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.prompt.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
