/** 805 — guest audit: detect passwordHash in public responses across user-relation endpoints. */
const API = 'http://localhost:4000/api/v1';
const SENS = ['passwordHash', 'password', 'refreshToken', 'accessToken', 'secret', 'privateKey', 'apiKey', 'session'];
function scan(obj, path, found) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) { obj.forEach((x, i) => scan(x, path + `[${i}]`, found)); return; }
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    const p = path ? `${path}.${k}` : k;
    const lk = k.toLowerCase();
    if (SENS.some((s) => lk.includes(s))) {
      found.push({ path: p, value: typeof v === 'string' ? String(v).slice(0, 24) : typeof v });
    }
    if (v && typeof v === 'object') scan(v, p, found);
  }
}
async function probe(name, url) {
  try {
    const r = await fetch(url, { headers: { accept: 'application/json' } });
    const j = await r.json();
    const found = [];
    scan(j, '', found);
    return { name, url, status: r.status, sensitive: found };
  } catch (e) { return { name, url, status: -1, sensitive: [{ path: 'ERR', value: String(e) }] }; }
}
(async () => {
  const results = [];
  // public demand detail (P0 repro)
  results.push(await probe('demand_detail', API + '/demands/6eb094ed-918c-4bf4-930c-028a68913bc6'));
  // public demand list
  results.push(await probe('demand_list', API + '/demands?pageSize=50'));
  // public products (createdBy relation)
  results.push(await probe('products', API + '/products?pageSize=20'));
  // rfqs (public? earlier 200)
  results.push(await probe('rfqs', API + '/rfqs?pageSize=20'));
  // workflow-events (earlier 200)
  results.push(await probe('workflow_events', API + '/workflow-events?pageSize=20'));
  // product detail via known id
  results.push(await probe('product_detail', API + '/products/ebb1c034-4280-480b-89ce-29753660e126'));
  // categories
  results.push(await probe('categories', API + '/product-categories?pageSize=20'));
  console.log(JSON.stringify(results, null, 2));
})();