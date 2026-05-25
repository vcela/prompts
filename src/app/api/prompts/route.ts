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

export async function GET() {
  const prompts = await prisma.prompt.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(prompts.map(serialize));
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { title, content, tags, categoryId } = body;

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
  }

  const prompt = await prisma.prompt.create({
    data: {
      title: title.trim(),
      content: content.trim(),
      tags: JSON.stringify(Array.isArray(tags) ? tags : []),
      categoryId: categoryId || null,
    },
    include: { category: true },
  });

  return NextResponse.json(serialize(prompt));
}
