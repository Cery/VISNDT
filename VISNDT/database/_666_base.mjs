/* 666 baseline: capture current DB state for fixture tables (raw SQL) */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const q = (sql) => prisma.$queryRawUnsafe(sql);
(async()=>{
  const [sp, spm, spv, pub, offers, offersSp, inq, rfq, rfqr] = await Promise.all([
    q('select count(*)::int n from supplier_product'),
    q('select count(*)::int n from supplier_product_media'),
    q('select count(*)::int n from supplier_product_parameter_value'),
    q("select count(*)::int n from supplier_product where status='PUBLISHED'"),
    q('select count(*)::int n from offer'),
    q('select count(*)::int n from offer where supplier_product_id is not null'),
    q('select count(*)::int n from inquiry'),
    q('select count(*)::int n from rfq'),
    q('select count(*)::int n from rfq_response'),
  ]);
  const rows = await q('select organization_id, status, slug from supplier_product');
  const orgCount={}, statusCount={}; let slugId=0;
  for (const r of rows){
    orgCount[r.organization_id.slice(0,8)]=(orgCount[r.organization_id.slice(0,8)]||0)+1;
    statusCount[r.status]=(statusCount[r.status]||0)+1;
    if (/^(scale|mingshi|ruishi|zhongke)-/.test(r.slug)) slugId++;
  }
  console.log(JSON.stringify({
    sp:sp[0].n, spm:spm[0].n, spv:spv[0].n, pub:pub[0].n,
    offers:offers[0].n, offersSp:offersSp[0].n,
    inq:inq[0].n, rfq:rfq[0].n, rfqr:rfqr[0].n,
    spPerOrg:orgCount, statusCount, identifiableBySlugPrefix:slugId }, null, 2));
  await prisma.$disconnect();
})().catch(e=>{console.error(e);process.exit(1);});