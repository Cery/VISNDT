const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const [categories, paramGroups, paramDefs, products, users, demands, offers, matches] = await Promise.all([
    prisma.productCategory.findMany({ include: { _count: { select: { products: true } } } }),
    prisma.parameterGroup.findMany({ include: { _count: { select: { definitions: true } } } }),
    prisma.parameterDefinition.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.demand.count(),
    prisma.offer.count(),
    prisma.demandMatch.count(),
  ]);

  console.log('=== CATEGORIES ===');
  categories.forEach(c => console.log(`  ${c.name} (${c.slug}) [${c._count.products} products]`));
  console.log('=== PARAMETER GROUPS ===');
  paramGroups.forEach(g => console.log(`  ${g.code}: ${g.name} [${g._count.definitions} defs]`));
  console.log('=== COUNTS ===');
  console.log(`  Products: ${products}`);
  console.log(`  Users: ${users}`);
  console.log(`  Demands: ${demands}`);
  console.log(`  Offers: ${offers}`);
  console.log(`  Matches: ${matches}`);
  console.log(`  ParamDefs: ${paramDefs}`);
}

main().then(() => prisma.$disconnect());