/* eslint-disable */
// Temp helper: inspect parameter + knowledge seed for M31.3 QA
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const defs = await prisma.parameterDefinition.findMany({
    select: { id: true, name: true, dataType: true, unit: true, required: true, options: { select: { value: true, label: true }, take: 4 } },
    take: 40,
  });
  console.log('PARAM DEFS:');
  for (const d of defs) console.log(`  [${d.dataType}] ${d.name} | unit=${d.unit} | req=${d.required} | opts=${d.options.map((o: any) => `${o.value}=${o.label}`).join(',')}`);

  const rels = await prisma.knowledgeRelation.findMany({ take: 20, select: { id: true, relationType: true, sourceId: true, targetId: true } });
  console.log('\nKNOWLEDGE RELATIONS count:', rels.length, JSON.stringify(rels, null, 0));

  const entries = await prisma.knowledgeEntry.findMany({ select: { id: true, title: true, slug: true, authorId: true }, take: 8 });
  console.log('\nKNOWLEDGE ENTRIES:', JSON.stringify(entries, null, 1));

  const content = await prisma.content.findMany({ select: { id: true, type: true, title: true, status: true }, take: 25 });
  console.log('\nCONTENT count:', content.length, JSON.stringify(content, null, 0));

  const tags = await prisma.contentTag.findMany({ select: { id: true, name: true }, take: 10 });
  console.log('\nCONTENT TAGS:', JSON.stringify(tags, null, 0));

  const sps = await prisma.supplierProduct.findMany({ select: { id: true, platformProductId: true, organizationId: true, status: true, modelNumber: true }, take: 10 });
  console.log('\nSUPPLIER PRODUCTS:', JSON.stringify(sps, null, 0));

  const offers = await prisma.offer.findMany({ select: { id: true, productId: true, organizationId: true, supplierProductId: true, status: true }, take: 10 });
  console.log('\nOFFERS:', JSON.stringify(offers, null, 0));
}
main().finally(() => prisma.$disconnect());
