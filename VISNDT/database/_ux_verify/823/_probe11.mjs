import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main() {
  const sp = await p.supplierProduct.findMany({ take: 15, orderBy: { updatedAt: 'desc' }, select: { id: true, brand: true, modelNumber: true, status: true, publishedAt: true, reviewedAt: true, organizationId: true } });
  console.log('SUPPLIER PRODUCTS:');
  for (const s of sp) {
    console.log(`  ${s.id.slice(0,8)} status=${s.status} brand=${(s.brand||'').slice(0,12)} model=${(s.modelNumber||'').slice(0,16)} pub=${s.publishedAt?'y':'-'} rev=${s.reviewedAt?'y':'-'} org=${String(s.organizationId).slice(0,8)}`);
  }
  await p.$disconnect();
}
main().catch(async e => { console.error(e); await p.$disconnect(); process.exit(1); });