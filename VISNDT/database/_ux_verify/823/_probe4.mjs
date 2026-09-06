import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  const rfqs = await p.rFQ.findMany({
    where: { status: { in: ['OPEN','RESPONDING'] } },
    select: {
      id: true, status: true, targetOrganizationId: true, publishedAt: true,
      demand: { select: { organizationId: true, title: true } },
      responses: { select: { id: true, organizationId: true, status: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  console.log('OPEN/RESPONDING RFQs with resp counts:');
  for (const r of rfqs) {
    console.log(`  ${r.id.slice(0,8)} status=${r.status} tgt=${String(r.targetOrganizationId).slice(0,8)} pub=${r.publishedAt?'yes':'NO'} respCount=${r.responses.length} ${(r.demand?.title||'').slice(0,25)}`);
    for (const resp of r.responses) console.log(`     resp=${resp.id.slice(0,8)} org=${String(resp.organizationId).slice(0,8)} st=${resp.status}`);
  }

  // supplier orgs with ACTIVE offers
  const sups = await p.organization.findMany({ where: { type: 'SUPPLIER' }, select: { id: true, name: true } });
  console.log('\nSUPPLIER ORGS:', sups.map(s=>`${s.id.slice(0,8)}:${s.name}`).join(' | '));

  // create a fresh DRAFT RFQ test for full decision flow? check for unused accepted match
  const acpt = await p.demandMatch.findMany({ where: { matchStatus: 'ACCEPTED' }, select: { id: true, _count: { select: { rfqs: true } } } });
  console.log('ACCEPTED matches rfq counts:', acpt.map(m=>`${m.id.slice(0,8)}:${m._count.rfqs}`).join(' | '));
  await p.$disconnect();
}
main().catch(async e => { console.error(e); await p.$disconnect(); process.exit(1); });