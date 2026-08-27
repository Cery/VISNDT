import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  const defs = await p.parameterDefinition.findMany({
    select: { id: true, code: true, dataType: true },
  });
  console.log('total', defs.length);
  console.log(defs.map((d) => d.code + ':' + d.dataType).join(', '));
  const enums = defs.filter((d) => d.dataType === 'ENUM');
  console.log('enumCount', enums.length);
  for (const e of enums) {
    const c = await p.parameterOption.count({ where: { parameterDefinitionId: e.id } });
    console.log('  ', e.code, 'options', c);
  }
  await p.$disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});