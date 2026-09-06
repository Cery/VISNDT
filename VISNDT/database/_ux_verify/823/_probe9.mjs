import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main() {
  const r = await p.rFQ.findUnique({ where: { id: 'a24806ee-a967-463d-928c-db929dd6de68' }, select: { id: true, sourceMatchId: true, demandId: true, demand: { select: { organizationId: true, title: true } } } });
  console.log(JSON.stringify(r, null, 2));
  await p.$disconnect();
}
main().catch(async e => { console.error(e); await p.$disconnect(); process.exit(1); });