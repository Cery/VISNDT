import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  const orgs = await p.organization.findMany({ select: { id: true, name: true, type: true } });
  console.log('ORGS:', orgs.map(o => `${o.name}(${o.type})`).join(' | '));

  const accepted = await p.demandMatch.findMany({
    where: { matchStatus: 'ACCEPTED' },
    select: {
      id: true, matchStatus: true,
      demand: { select: { id: true, title: true, organizationId: true, status: true } },
      offer: { select: { id: true, organizationId: true, status: true } },
      product: { select: { id: true, name: true } },
    },
    take: 20,
  });
  console.log('ACCEPTED MATCHES:', accepted.length);
  for (const m of accepted) {
    const rfq = await p.rFQ.findFirst({ where: { sourceMatchId: m.id }, select: { id: true, status: true } });
    console.log(`- match=${m.id.slice(0,8)} demandTitle=${(m.demand.title||'').slice(0,30)} demandOrg=${m.demand.organizationId.slice(0,8)} matchStatus=${m.matchStatus} offerOrg=${m.offer?.organizationId?.slice(0,8)||'NONE'} offerStatus=${m.offer?.status||'NONE'} product=${(m.product?.name||'').slice(0,20)} RFQ=${rfq?rfq.id.slice(0,8)+'/'+rfq.status:'NONE'}`);
  }

  const rfqCount = await p.rFQ.count();
  let rfqResp = -1;
  try { rfqResp = await p.rFQResponse.count(); } catch { rfqResp = 0; }
  console.log('RFQ total:', rfqCount, 'RFQResponse total:', rfqResp);
  const openRfqs = await p.rFQ.findMany({ where: { status: { in: ['OPEN','RESPONDING'] } }, select: { id: true, status: true, sourceMatchId: true } });
  console.log('OPEN/RESPONDING RFQs:', openRfqs.length);
  await p.$disconnect();
}
main().catch(async e => { console.error(e); await p.$disconnect(); process.exit(1); });