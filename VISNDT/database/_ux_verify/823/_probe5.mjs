import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main() {
  const list = await p.rFQ.findMany({ where: { status: 'OPEN' }, select: { id: true, demand: { select: { organizationId: true, title: true } } } });
  for (const rr of list) {
    if (rr.id.startsWith('3f00bc92')) {
      console.log('RFQ', rr.id, 'demandOrg=', rr.demand?.organizationId, String(rr.demand?.organizationId).slice(0,8) === '8b0e7521' ? '== demo.buyer org' : '<> demo.buyer org');
      console.log('  title=', rr.demand?.title);
      const resp = await p.rFQResponse.findFirst({ where: { rfqId: rr.id }, select: { id: true, status: true, organizationId: true, message: true, offerId: true } });
      console.log('  resp=', JSON.stringify(resp));
    }
  }
  await p.$disconnect();
}
main().catch(async e => { console.error(e); await p.$disconnect(); process.exit(1); });