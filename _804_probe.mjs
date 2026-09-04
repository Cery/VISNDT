/** 804_M39 — READ-ONLY closure gate probe: real API data-state snapshot for business-loop resources. */
const API = 'http://localhost:4000/api/v1';
const out = [];
async function get(path, label) {
  try {
    const r = await fetch(API + path, { headers: { accept: 'application/json' } });
    let body = null, txt = '';
    try { body = await r.json(); } catch { txt = await r.text(); }
    const data = body && Array.isArray(body.data) ? body.data : (body?.data ?? body);
    const count = Array.isArray(data) ? data.length : (data ? 'object' : 0);
    const sample = Array.isArray(data) && data.length ? JSON.stringify(data[0]).slice(0, 200) : (data ? JSON.stringify(data).slice(0, 160) : (txt || ''));
    out.push({ label, path, status: r.status, count, sample });
  } catch (e) {
    out.push({ label, path, status: -1, count: 0, sample: 'ERR ' + String(e) });
  }
}
const publics = [
  ['/product-categories', 'product_categories'],
  ['/supplier-products', 'supplier_products'],
  ['/products', 'products'],
  ['/discovery/capabilities', 'capabilities'],
  ['/rfq-responses', 'rfq_responses'], // may be auth-gated
];
const gate = [
  ['/evaluations', 'evaluations'],
  ['/demands', 'demands'],
  ['/matches', 'matches'],
  ['/rfqs', 'rfqs'],
  ['/offers', 'offers'],
  ['/inquiries', 'inquiries'],
  ['/workflow-events', 'workflow_events'],
  ['/notifications', 'notifications'],
  ['/workspace', 'workspace'],
];
(async () => {
  for (const [p, l] of publics) await get(p, l);
  for (const [p, l] of gate) await get(p, l);
  console.log(JSON.stringify(out, null, 2));
  require('fs').writeFileSync('F:/Desktop/VISNDT/VISNDT/database/_804_visual/_804_apistate.json', JSON.stringify(out, null, 2));
})();