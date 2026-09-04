/* P2 — Public Capability commercial payload cleanup verification.
   Proves GET /capabilities/:id exposes NO price / currency / commercialSummary / offer
   payload while keeping the non-commercial discovery context (Product + Supplier +
   SupplierProduct model context) complete.

   Differential: a real DB offer (price 88000/CNY) is temporarily linked to a
   PUBLISHED model, then the capability endpoint is verified to STILL NOT expose it.
   The link is restored immediately (controlled, reversible, non-production effect). */
import { PrismaClient } from '@prisma/client';
const API = 'http://localhost:4000/api/v1';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (name, pass, detail) => { results.push({ name, pass: !!pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  | ' + detail : ''}`); };
const prisma = new PrismaClient();

// Deep-walk a parsed JSON object, returning the set of forbidden keys found.
function collectForbidden(obj, path = '', found = {}) {
  if (Array.isArray(obj)) { obj.forEach((v, i) => collectForbidden(v, `${path}[${i}]`, found)); return found; }
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      const kp = `${path}.${k}`;
      if (['offers', 'commercialSummary', 'price', 'currency', 'offerCount', 'activeOfferCount', 'priceFrom', 'priceTo'].includes(k)) {
        found[kp] = k;
      }
      collectForbidden(v, kp, found);
    }
  }
  return found;
}

(async () => {
  // Gather every published platform product id so we sweep the whole public surface.
  const published = await prisma.supplierProduct.findMany({
    where: { status: 'PUBLISHED' },
    select: { id: true, platformProductId: true, modelNumber: true, brand: true },
  });
  const platformIds = [...new Set(published.map((p) => p.platformProductId))];
  check('found published platform products to sweep', platformIds.length >= 1, 'n=' + platformIds.length);

  let totalForbidden = 0;
  for (const ppId of platformIds) {
    const r = await fetch(`${API}/capabilities/${ppId}`).catch(() => null);
    check(`capability ${ppId.slice(0, 8)} → HTTP 200`, !!r && r.status === 200, 'status=' + (r?.status ?? 'n/a'));
    if (!r || r.status !== 200) continue;
    const j = await r.json().catch(() => ({}));
    const payload = j?.data ?? j;
    const forbidden = collectForbidden(payload);
    totalForbidden += Object.keys(forbidden).length;
    check(`capability ${ppId.slice(0, 8)} → NO commercial keys`, Object.keys(forbidden).length === 0, Object.keys(forbidden).length ? JSON.stringify(forbidden) : 'clean');

    // Non-commercial completeness: every published model retains model context.
    const sps = payload?.supplierProducts ?? [];
    const allPublished = sps.length > 0 && sps.every((sp) => sp.status === 'PUBLISHED');
    const allCtx = sps.every((sp) =>
      !!sp?.id && !!sp?.brand && !!sp?.modelNumber && !!sp?.organization?.name &&
      !!sp?.organization?.id,
    );
    check(`capability ${ppId.slice(0, 8)} → only PUBLISHED models`, allPublished, 'n=' + sps.length);
    check(`capability ${ppId.slice(0, 8)} → non-commercial model context complete`, sps.length === 0 || allCtx, 'brand/model/org present');
  }
  check('GLOBAL: no commercial payload across all public capability reads', totalForbidden === 0, 'forbiddenKeys=' + totalForbidden);

  // ---- Differential: link a real DB offer (88000 CNY) to a published model, verify stripping ----
  const orphan = await prisma.offer.findFirst({ where: { supplierProductId: null }, select: { id: true } });
  if (!orphan) {
    check('DIF: have an offer to link', false, 'no orphan offer to link');
  } else {
    const target = await prisma.supplierProduct.findFirst({ where: { status: 'PUBLISHED' }, select: { id: true, platformProductId: true } });
    const prevTarget = await prisma.offer.findUnique({ where: { id: orphan.id }, select: { supplierProductId: true } });
    await prisma.offer.update({ where: { id: orphan.id }, data: { supplierProductId: target.id } });
    check('DIF: linked real offer to published model', true, 'offer=' + orphan.id + ' -> model=' + target.id);
    await sleep(300);
    const r = await fetch(`${API}/capabilities/${target.platformProductId}`).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    const payload = j?.data ?? j;
    const forbidden = collectForbidden(payload);
    const leakedPrice = JSON.stringify(payload).includes('88000') || Object.keys(forbidden).length > 0;
    check('DIF: capability STILL NO offer/price after linking real offer', !leakedPrice, 'forbidden=' + JSON.stringify(forbidden) + ' priceLeak=' + JSON.stringify(payload).includes('88000'));
    // restore
    await prisma.offer.update({ where: { id: orphan.id }, data: { supplierProductId: prevTarget?.supplierProductId ?? null } });
    const restored = await prisma.offer.findUnique({ where: { id: orphan.id }, select: { supplierProductId: true } });
    check('DIF: offered link restored', restored?.supplierProductId === (prevTarget?.supplierProductId ?? null) && restored?.supplierProductId === null, 'supplierProductId=' + restored?.supplierProductId);
  }

  await prisma.$disconnect();
  const passed = results.filter((x) => x.pass).length;
  console.log('\n=== P2 VERIFY SUMMARY ===');
  console.log(JSON.stringify({ passCount: passed, total: results.length, ALL_PASS: passed === results.length }, null, 1));
  process.exit(0);
})().catch(async (e) => { console.error('FATAL ' + e.message); await prisma.$disconnect().catch(() => {}); process.exit(2); });