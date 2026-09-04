// 806 M39 FINAL CLOSURE RE-VERIFICATION — Security Regression (read-only, raw JSON scan)
// Goal: prove PUBLIC CREDENTIAL EXPOSURE = 0 on known-vulnerable + same-class paths.
const BASE = 'http://localhost:4000/api/v1';
const SENS = ['passwordhash', 'password', 'refreshtoken', 'accesstoken', 'secret', 'apikey', 'privatekey', 'credential'];

function scan(obj, path, found) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) { obj.forEach((x, i) => scan(x, path + `[${i}]`, found)); return; }
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    const p = path ? `${path}.${k}` : k;
    const lk = k.toLowerCase();
    if (SENS.some((s) => s === lk || lk.includes(s))) {
      found.push({ path: p, type: typeof v });
    }
    if (v && typeof v === 'object') scan(v, p, found);
  }
}

async function jget(url, token) {
  const r = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  const txt = await r.text();
  let body; try { body = JSON.parse(txt); } catch { body = txt; }
  return { status: r.status, body };
}

const results = [];
async function probe(name, url, token, opts = {}) {
  const { status, body } = await jget(url, token);
  const found = [];
  if (typeof body === 'object') scan(body, '', found);
  else if (typeof body === 'string' && SENS.some((s) => body.toLowerCase().includes(s))) found.push({ path: '(raw string)', type: 'string' });
  const pass = found.length === 0;
  results.push({ id: name, url, status, sensitive: found.length, pass, found: found.slice(0, 5) });
  if (!opts.silent) console.log(`${pass ? 'PASS' : 'FAIL'} ${name} -> ${status} sensitive=${found.length}`);
}

// ---- Step A: known vulnerable public paths ----
await probe('PUBLIC GET /demands', `${BASE}/demands?page=1&pageSize=20`);
await probe('PUBLIC GET /demands/{id}', `${BASE}/demands`).then(async () => {
  const { body } = await jget(`${BASE}/demands?page=1&pageSize=1`);
  if (body.data && body.data[0]) {
    await probe('PUBLIC GET /demands/{detail-id}', `${BASE}/demands/${body.data[0].id}`);
  } else { console.log('SKIP detail (no demand data)'); }
});
await probe('PUBLIC GET /products', `${BASE}/products?page=1&pageSize=20`);
await probe('PUBLIC GET /products/{id}', `${BASE}/products`).then(async () => {
  const { body } = await jget(`${BASE}/products?page=1&pageSize=1`);
  if (body.data && body.data[0]) await probe('PUBLIC GET /products/{detail-id}', `${BASE}/products/${body.data[0].id}`);
  else console.log('SKIP product detail');
});
await probe('PUBLIC GET /rfqs', `${BASE}/rfqs?page=1&pageSize=20`);
await probe('PUBLIC GET /workflow-events', `${BASE}/workflow-events?page=1&pageSize=20`);
await probe('PUBLIC GET /workflow-events/{id}', `${BASE}/workflow-events?page=1&pageSize=1`).then(async () => {
  const { body } = await jget(`${BASE}/workflow-events?page=1&pageSize=1`);
  if (body.data && body.data[0]) await probe('PUBLIC GET /workflow-events/{detail-id}', `${BASE}/workflow-events/${body.data[0].id}`);
  else console.log('SKIP wf detail');
});

// ---- Step B: same-class public sweep ----
await probe('PUBLIC GET /content/public', `${BASE}/content/public?page=1&pageSize=20`);
await probe('PUBLIC GET /content/public/{slug}', `${BASE}/content/public?page=1&pageSize=1`).then(async () => {
  const { body } = await jget(`${BASE}/content/public`);
  if (body.data && body.data[0]) await probe('PUBLIC GET /content/public/{slug}', `${BASE}/content/public/${body.data[0].slug || body.data[0].id}`);
});
await probe('PUBLIC GET /knowledge/public/entries', `${BASE}/knowledge/public/entries?page=1&pageSize=20`);
await probe('PUBLIC GET /search?q=检测', `${BASE}/search?q=%E6%A3%80%E6%B5%8B`);
await probe('PUBLIC GET /product-categories', `${BASE}/product-categories?page=1&pageSize=20`);
await probe('PUBLIC GET /parameter-definitions', `${BASE}/parameter-definitions?page=1&pageSize=20`);

// ---- Step C: negative authorization (Guest must NOT reach private) ----
await probe('GUEST /demands/my (expect protected)', `${BASE}/demands/my`);
await probe('GUEST /evaluations (expect protected)', `${BASE}/evaluations`);
await probe('GUEST /notifications (expect protected)', `${BASE}/notifications`);

const fails = results.filter((r) => !r.pass);
const ok = results.filter((r) => r.pass);
console.log('\n==== 806 SECURITY REGRESSION SUMMARY ====');
console.log(`Total=${results.length} PASS=${ok.length} FAIL=${fails.length}`);
if (fails.length) console.log('FAILS:', JSON.stringify(fails, null, 2));
// Negative-auth endpoints: status is the interesting signal
console.log('\nProtected-endpoint guest statuses:');
results.filter((r) => r.url.includes('/my') || r.url.includes('/evaluations') || r.url.includes('/notifications'))
  .forEach((r) => console.log(`  ${r.url} -> ${r.status}`));
process.exit(fails.length ? 1 : 0);