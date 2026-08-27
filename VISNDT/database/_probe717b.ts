import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main() {
  const defs = await p.parameterDefinition.findMany({
    where: { dataType: { in: ['STRING', 'NUMBER', 'ENUM'] } },
    select: { id: true, name: true, code: true, dataType: true, unit: true, options: { select: { value: true, label: true }, take: 3 } },
    take: 15,
  });
  for (const d of defs) {
    const hay = JSON.stringify(d);
    const m = hay.match(/AI|knowledge.?based|LLM|语义相似|embedding/i);
    console.log(`${d.dataType} | name=${d.name} | code=${d.code} | unit=${d.unit ?? ''} | KEYWORD=${m?.[0] ?? 'none'}`);
    if (d.options?.length) console.log('   options:', d.options.map((o: any) => `${o.value}/${o.label}`).join(', '));
  }
  await p.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
