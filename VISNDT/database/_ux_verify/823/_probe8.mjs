import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main() {
  const rfqs = await p.rFQ.findMany({ where: { sourceMatchId: { not: null } }, select: { id: true, status: true }, orderBy: { createdAt: 'asc' } });
  for (const r of rfqs) console.log('RFQ=' + r.id + ' ' + r.status);
  const dems = await p.demand.findMany({ where: { title: { contains: '807' } }, select: { id: true, title: true }, orderBy: { createdAt: 'asc' } });
  for (const d of dems) console.log('DEMAND=' + d.id + ' ' + (d.title||'').slice(0,30));
  await p.$disconnect();
}
main().catch(async e => { console.error(e); await p.$disconnect(); process.exit(1); });