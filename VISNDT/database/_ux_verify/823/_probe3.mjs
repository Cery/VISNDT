import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  const rfqs = await p.rFQ.findMany({
    where: { sourceMatchId: { not: null } },
    select: {
      id: true, status: true, sourceMatchId: true, createdAt: true,
      demand: { select: { id: true, title: true, organizationId: true } },
      targetOrganization: { select: { id: true, name: true } },
      responses: { select: { id: true, status: true, organizationId: true, offerId: true, createdAt: true, reviewedBy: true, reviewedAt: true, decisionNote: true } },
    },
    orderBy: { createdAt: 'asc' },
  });
  for (const r of rfqs) {
    console.log(`RFQ=${r.id.slice(0,8)} status=${r.status} match=${String(r.sourceMatchId).slice(0,8)} org=${String(r.demand?.organizationId).slice(0,8)} tgt=${r.targetOrganization?.name||'NONE'}`);
    for (const resp of r.responses) {
      console.log(`   resp=${resp.id.slice(0,8)} status=${resp.status} org=${String(resp.organizationId).slice(0,8)} offer=${String(resp.offerId).slice(0,8)} created=${resp.createdAt?.toISOString()||'NONE'} reviewed=${resp.reviewedAt?.toISOString().slice(0,19)||'-'} note=${(resp.decisionNote||'').slice(0,30)}`);
    }
  }

  // workflow events for RFQs
  const evs = await p.workflowEvent.findMany({
    where: { entityType: 'RFQ' },
    orderBy: { createdAt: 'desc' },
    take: 15,
    select: { entityId: true, action: true, createdAt: true, metadata: true },
  });
  console.log('\nRFQ WORKFLOW EVENTS:');
  for (const e of evs) {
    const pm = e.metadata;
    const prev = pm?.previousStatus || '-';
    const next = pm?.newStatus || '-';
    console.log(`  ${String(e.entityId).slice(0,8)} ${e.action} ${prev}->${next} @${e.createdAt.toISOString().slice(11,19)}`);
  }
  await p.$disconnect();
}
main().catch(async e => { console.error(e); await p.$disconnect(); process.exit(1); });