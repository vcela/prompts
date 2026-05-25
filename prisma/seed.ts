import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const coding = await prisma.category.upsert({
    where: { name: 'Coding' },
    update: {},
    create: { name: 'Coding', color: '#007AFF' },
  });

  const writing = await prisma.category.upsert({
    where: { name: 'Writing' },
    update: {},
    create: { name: 'Writing', color: '#34C759' },
  });

  const analysis = await prisma.category.upsert({
    where: { name: 'Analýza' },
    update: {},
    create: { name: 'Analýza', color: '#FF9500' },
  });

  await prisma.prompt.createMany({
    data: [
      {
        title: 'Code review asistent',
        content: 'Prosím o code review následujícího kódu. Zaměř se na:\n1) Výkon a efektivitu\n2) Čitelnost a maintainability\n3) Bezpečnostní problémy\n4) Dodržení best practices\n\nKód:\n[VLOŽ KÓD]',
        tags: JSON.stringify(['coding', 'review', 'quality']),
        categoryId: coding.id,
      },
      {
        title: 'Refactoring helper',
        content: 'Refaktoruj následující kód tak, aby byl čistší, efektivnější a lépe udržovatelný. Vysvětli každou změnu a proč jsi ji provedl.\n\n[VLOŽ KÓD]',
        tags: JSON.stringify(['coding', 'refactoring']),
        categoryId: coding.id,
      },
      {
        title: 'Blog post outline',
        content: 'Vytvoř detailní osnovu pro blog post na téma: [TÉMA]. Zahrň úvod, 5–7 hlavních sekcí s podsekcemi a závěr. Každá sekce by měla mít jasný cíl a klíčové body.',
        tags: JSON.stringify(['writing', 'blog', 'content']),
        categoryId: writing.id,
      },
      {
        title: 'Analýza dat',
        content: 'Analyzuj následující data a poskytni:\n1) Klíčové metriky a trendy\n2) Anomálie nebo zajímavé vzory\n3) Doporučení na základě dat\n4) Možné příčiny identifikovaných trendů\n\nData:\n[VLOŽ DATA]',
        tags: JSON.stringify(['data', 'analysis', 'insights']),
        categoryId: analysis.id,
      },
      {
        title: 'Email profesionální tón',
        content: 'Přepiš následující email do profesionálního, zdvořilého tónu. Zachovej klíčové informace, ale zbav se neformálností a případných emocí.\n\n[VLOŽ EMAIL]',
        tags: JSON.stringify(['writing', 'email', 'komunikace']),
        categoryId: writing.id,
      },
    ],
  });

  console.log('Seed data created successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
