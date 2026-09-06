import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main() {
  const dr = await p.rFQ.findMany({ where: { status: 'DRAFT' }, select: { id: true, status: true, createdBy: true, demand: { select: { id: true, organizationId: true, title: true } }, targetOrganizationId: true, _count: { select: { responses: true } } } });
  console.log('DRAFT RFQs:');
  for (const d of dr) {
    console.log(`  ${d.id.slice(0,8)} created=${d.createdBy} tgt=${String(d.targetOrganizationId).slice(0,8)||'null'} demandOrg=${String(d.demand?.organizationId).slice(0,8)} title=${(d.demand?.title||'').slice(0,25)} resp=${d._count.responses}`);
  }

  // all RFQs not yet matched
  const all = await p.rFQ.findMany({ select: { id: true, status: true, createdBy: true, demand: { select: { organizationId: true, title: true } } } });
  console.log('\nALL RFQs:');
  for (const a of all) console.log(`  ${a.id.slice(0,8)} st=${a.status} created=${a.createdBy} org=${String(a.demand?.organizationId).slice(0,8)} ${(a.demand?.title||'').slice(0,22)}`);

  // who is creator of 3f00bc92 & d5cae768
  for (const prefix of ['3f00bc92','d5cae768','fe8b8bea']) {
    const f = all.find(x=>x.id.startsWith(prefix));
    if (f) {
      const u = await p.user.findUnique({ where: { id: f.createdBy }, select: { email: true } });
      console.log(`creator of ${prefix}= email=${u?.email}`);
    }
  }
  await p.$disconnect();
}
main().catch(async e => { console.error(e); await p.$disconnect(); process.exit(1); });