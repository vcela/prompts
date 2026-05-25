import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Dashboard } from '@/components/Dashboard';

export default async function Home() {
  const session = await getServerSession(authOptions);

  const [rawPrompts, rawCategories] = await Promise.all([
    prisma.prompt.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({
      include: { _count: { select: { prompts: true } } },
      orderBy: { name: 'asc' },
    }),
  ]);

  const prompts = rawPrompts.map((p) => ({
    ...p,
    tags: JSON.parse(p.tags) as string[],
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    category: p.category
      ? { ...p.category, createdAt: p.category.createdAt.toISOString() }
      : null,
  }));

  const categories = rawCategories.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <Dashboard
      initialPrompts={prompts}
      initialCategories={categories}
      isAuthenticated={!!session}
      userEmail={session?.user?.email ?? undefined}
    />
  );
}
