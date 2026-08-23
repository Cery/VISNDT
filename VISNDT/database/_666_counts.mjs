// 666 Data Count Verification — 7 required tables
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const q = (sql) => prisma.$queryRawUnsafe(sql);
(async () => {
  const label = process.argv[2] || 'UNKNOWN';
  const [sp, spm, sppv, of, inq, rfq, rfqr] = await Promise.all([
    q('select count(*)::int n from supplier_product'),
    q('select count(*)::int n from supplier_product_media'),
    q('select count(*)::int n from supplier_product_parameter_value'),
    q('select count(*)::int n from offer'),
    q('select count(*)::int n from inquiry'),
    q('select count(*)::int n from rfq'),
    q('select count(*)::int n from rfq_response'),
  ]);
  const pub = (await q("select count(*)::int n from supplier_product where status='PUBLISHED'"))[0].n;
  const offersSp = (await q('select count(*)::int n from offer where supplier_product_id is not null'))[0].n;
  console.log(JSON.stringify({
    stage: label,
    supplier_product: sp[0].n,
    supplier_product_media: spm[0].n,
    supplier_product_parameter_value: sppv[0].n,
    offer: of[0].n,
    inquiry: inq[0].n,
    rfq: rfq[0].n,
    rfq_response: rfqr[0].n,
    sp_published: pub,
    offer_bound_to_sp: offersSp,
  }));
  await prisma.$disconnect();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
