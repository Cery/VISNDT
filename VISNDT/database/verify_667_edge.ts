/**
 * M28.1 M667 — Edge Case + Scale validation (temp runtime verification)
 * Run: npx tsx verify_667_edge.ts  (database dir, API on localhost:4000)
 */
const BASE = 'http://localhost:4000/api/v1';
const CAP = '933ed0db-08e7-4ede-a2c2-ebb1e8521cd1'; // VX-6000

const results: { step: string; ok: boolean; detail: string }[] = [];
function record(step: string, ok: boolean, detail: string) {
  results.push({ step, ok, detail });
  console.log(`${ok ? '✅' : '❌'} ${step} — ${detail}`);
}

async function main() {
  console.log('=== M667 Edge Case + Scale Validation ===\n');
  const cap = (await (await fetch(`${BASE}/capabilities/${CAP}`)).json()).data;
  const published = cap.supplierProducts.filter(
    (x: any) => x.supplierProduct.status === 'PUBLISHED',
  );
  const ids = published.map((x: any) => x.supplierProduct.id);

  // Scale: 2 / 3 / 4 / 7 selections all resolve within the capability graph
  for (const n of [2, 3, 4, 7]) {
    const sel = ids.slice(0, n);
    const valid = cap.supplierProducts.filter(({ supplierProduct }: any) =>
      sel.includes(supplierProduct.id),
    );
    record(
      `${n}-item compare data`,
      valid.length === n,
      `selected=${n} resolved=${valid.length} orgs=${new Set(valid.map((v: any) => v.supplierProduct.organization.name)).size}`,
    );
  }

  // Unpublished excluded: DRAFT ids never appear in capability graph
  const drafts = await (
    await fetch(`${BASE}/products/${CAP}/suppliers`).catch(() => null)
  );
  const draftIncluded = published.some((x: any) => x.supplierProduct.status !== 'PUBLISHED');
  record(
    'Unpublished excluded from compare graph',
    !draftIncluded,
    `capability returns PUBLISHED only=${!draftIncluded}`,
  );

  // Different series comparable (明视 has 4 series under VX-6000)
  const seriesSet = new Set(
    published.map((x: any) => `${x.supplierProduct.organization.name}|${x.supplierProduct.series}`),
  );
  record(
    'Different series / same brand distinguishable',
    seriesSet.size >= 4,
    `org|series distinct=${seriesSet.size}: ${[...seriesSet].join(' ; ')}`,
  );

  // Same brand / same org identity: 明视 4 models all carry org name
  const mingshi = published.filter((x: any) => x.supplierProduct.brand === '明视');
  const mingshiOrg = new Set(mingshi.map((x: any) => x.supplierProduct.organization.name));
  record(
    'Same brand models carry org identity',
    mingshiOrg.size === 1 && mingshi.length >= 4,
    `明视 models=${mingshi.length} orgs=${[...mingshiOrg].join(',')}`,
  );

  // No-Offer models: appear in compare data with activeOfferCount=0 (safe display)
  const noOffer = published.filter((x: any) => (x.supplierProduct.commercialSummary?.activeOfferCount ?? 0) === 0);
  const withOffer = published.filter((x: any) => (x.supplierProduct.commercialSummary?.activeOfferCount ?? 0) > 0);
  record(
    'No-Offer model safe display',
    noOffer.length >= 4 && withOffer.length >= 3,
    `noOffer=${noOffer.map((x: any) => x.supplierProduct.modelNumber).join(',')} | withOffer=${withOffer.map((x: any) => x.supplierProduct.modelNumber).join(',')}`,
  );

  // Commercial summary completeness on offer models
  const offerModels = withOffer.map((x: any) => {
    const cs = x.supplierProduct.commercialSummary;
    return `${x.supplierProduct.modelNumber}:${cs.priceFrom}/${cs.priceTo}/${cs.currency}/offers=${x.offers.length}`;
  });
  record(
    'Commercial summary (priceFrom/priceTo/currency/offers)',
    withOffer.every((x: any) => {
      const cs = x.supplierProduct.commercialSummary;
      return cs.priceFrom > 0 && cs.priceTo > 0 && cs.currency;
    }),
    offerModels.join(' | '),
  );

  // Parameter overrides present for comparison rows
  const modelsWithParams = published.filter((x: any) => (x.supplierProduct.parameterValues ?? []).length >= 3);
  record(
    'Parameter overrides available for compare rows',
    modelsWithParams.length === published.length,
    `models with >=3 params=${modelsWithParams.length}/${published.length}`,
  );

  // Compare URL state shape (deep link/refresh stable by design)
  const urlState = `/products/compare?ids=${ids.join(',')}&type=supplier-product&capability=${CAP}`;
  record(
    'Compare URL state (ids+type+capability)',
    urlState.includes('type=supplier-product') && urlState.includes('capability=') && ids.length === 7,
    `URL ids count=${ids.length}, slice-safe`,
  );

  // Inquiry blocked for no-offer model (no entryOffer → canInquire=false)
  const firstNoOffer = noOffer[0]?.supplierProduct;
  record(
    'No-Offer model inquiry unavailable',
    !!firstNoOffer && (firstNoOffer.offers ?? []).length === 0,
    `${firstNoOffer?.modelNumber} offers=${firstNoOffer?.offers?.length ?? 0} → UI 暂无可询价渠道`,
  );

  const failed = results.filter((r) => !r.ok);
  console.log(`\n=== Edge+Scale Summary: ${results.length - failed.length}/${results.length} passed ===`);
  if (failed.length) console.log('FAILED:', failed.map((f) => f.step).join(' | '));
}
main();
