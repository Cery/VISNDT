const { PrismaClient } = require('./node_modules/.prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Query ProductCategories
  const pcs = await prisma.productCategory.findMany({ select: { id: true, name: true, slug: true } });
  console.log('=== ProductCategories ===');
  pcs.forEach(pc => console.log(`  ${pc.id} | ${pc.name} | ${pc.slug}`));

  // 2. Query KnowledgeCategories
  const kcs = await prisma.knowledgeCategory.findMany({ 
    include: { domain: { select: { id: true, name: true } } }
  });
  console.log('\n=== KnowledgeCategories ===');
  kcs.forEach(kc => console.log(`  ${kc.id} | ${kc.name} | ${kc.slug} | Domain: ${kc.domain.name}`));

  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });