/* 667 DB baseline — VX-6000 platform product parameter definitions + values */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const CAP_ID = '933ed0db-08e7-4ede-a2c2-ebb1e8521cd1';

(async () => {
  const p = await prisma.product.findUnique({
    where: { id: CAP_ID },
    include: {
      parameterValues: {
        include: { parameterDefinition: { include: { group: true } } },
        orderBy: { parameterDefinition: { name: 'asc' } },
      },
      parameterAssociations: { include: { parameterDefinition: true } },
    },
  });
  console.log('[PLATFORM]', p?.name, p?.model);
  console.log('[PLATFORM PPV]', p?.parameterValues.length);
  for (const pv of p?.parameterValues ?? []) {
    console.log(`  ${pv.parameterDefinition.code} | ${pv.parameterDefinition.name} (${pv.parameterDefinition.dataType}${pv.parameterDefinition.unit ? '/' + pv.parameterDefinition.unit : ''}) | group=${pv.parameterDefinition.group?.name} | value=${pv.value}${pv.valueNumber != null ? ' / num=' + pv.valueNumber : ''}`);
  }
  console.log('[PLATFORM PPD total]', p?.parameterAssociations?.length ?? 0);
  for (const pd of p?.parameterAssociations ?? []) {
    console.log(`  PPD ${pd.parameterDefinition.code} | ${pd.parameterDefinition.name} | order=${pd.displayOrder}`);
  }

  // All parameter definitions (global) to know available codes
  const defs = await prisma.parameterDefinition.findMany({ include: { group: true }, orderBy: { code: 'asc' } });
  console.log('\n[ALL DEFINITIONS]', defs.length);
  for (const d of defs) {
    console.log(`  ${d.code} | ${d.name} | ${d.dataType}${d.unit ? '/' + d.unit : ''} | group=${d.group?.name}`);
  }
})()
  .finally(() => prisma.$disconnect());
