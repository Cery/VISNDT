/**
 * ============================================================
 * VISNDT WP-5A Supplier Workspace — Runtime Verification
 * ============================================================
 * Verifies against the REAL running API (Docker visndt-api):
 *   R1 Media Write  : upload → persist → verify → reorder/primary → delete
 *   R2 Parameter Write : set overrides → persist → reload → same value
 *   Lifecycle       : DRAFT write-allowed → SUBMITTED write-blocked
 *   Ownership       : own org allowed / cross-org DENIED (404/403)
 *   Publication boundary : SUBMITTED model not public on capability context
 *
 * Run (database dir): npx tsx wp5a_runtime.ts
 * ============================================================
 */
import { readFileSync } from 'node:fs';

const BASE = 'http://localhost:4000/api/v1';

const results: { step: string; ok: boolean; detail: string }[] = [];
function record(step: string, ok: boolean, detail: string) {
  results.push({ step, ok, detail });
  console.log(`${ok ? '✅' : '❌'} ${step} — ${detail}`);
}
const is2xx = (s: number) => s >= 200 && s < 300;

let csrfToken = '';
let tokenA = ''; // supplier.01
let tokenB = ''; // supplier.02

async function request(method: string, path: string, opts: {
  json?: unknown; token?: string; csrf?: boolean; raw?: boolean; body?: BodyInit; headers?: Record<string, string>;
} = {}) {
  const headers: Record<string, string> = { ...(opts.headers ?? {}) };
  if (opts.json !== undefined && !opts.raw) headers['Content-Type'] = 'application/json';
  if (opts.token) headers['Authorization'] = `Bearer ${opts.token}`;
  if (opts.csrf) {
    headers['X-CSRF-Token'] = csrfToken;
    headers['Cookie'] = `csrf_token=${csrfToken}`;
  }
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: opts.raw ? opts.body : opts.json !== undefined ? JSON.stringify(opts.json) : undefined,
  });
  const text = await res.text();
  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch { json = { raw: text.slice(0, 200) }; }
  return { status: res.status, json };
}

async function login(email: string, password: string) {
  const csrfR = await request('GET', '/auth/csrf');
  csrfToken = csrfR.json?.data?.csrfToken ?? '';
  const lr = await request('POST', '/auth/login', { json: { email, password } });
  const token = lr.json?.data?.accessToken ?? lr.json?.accessToken ?? '';
  return token;
}

function multipart(fields: Record<string, string>, fileData: Buffer, filename: string) {
  const boundary = '----wp5a' + Date.now();
  let body = '';
  for (const [k, v] of Object.entries(fields)) {
    body += `--${boundary}\r\nContent-Disposition: form-data; name="${k}"\r\n\r\n${v}\r\n`;
  }
  body += `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: image/png\r\n\r\n`;
  const prefix = Buffer.from(body, 'utf-8');
  const suffix = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf-8');
  const full = Buffer.concat([prefix, fileData, suffix]);
  return { body: full, headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` } };
}

function makePng(size: number): Buffer {
  // minimal PNG (1x1) binary
  const b64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  const buf = Buffer.from(b64, 'base64');
  // pad deterministically for distinct files
  return size > 0 ? Buffer.concat([buf, Buffer.alloc(Math.max(0, size - buf.length), 0xff)]) : buf;
}

async function main() {
  console.log('=== VISNDT WP-5A Supplier Workspace Runtime Verification ===\n');

  tokenA = await login('demo.supplier.01@visndt.local', 'demo123456');
  record('login supplier.01', !!tokenA, tokenA ? 'token acquired' : 'login failed');

  // ---- list my products ----
  const listA = await request('GET', '/supplier-products/my?page=1&pageSize=20', { token: tokenA });
  const rows = listA.json?.data?.data ?? [];
  record('GET /supplier-products/my (list)', listA.status === 200, `total=${listA.json?.data?.total ?? 0} rows=${rows.length}`);
  record('list _count projection present', listA.status === 200 && Array.isArray(rows) && rows.every((x: any) => '_count' in x), 'media/param counts in list rows');

  // ---- platform product + parameter definitions ----
  const productsRes = await request('GET', '/products?page=1&pageSize=5', {});
  const platform = (productsRes.json?.data?.data ?? []).find((p: any) => !!p.id);
  const ppId = platform?.id ?? '';
  const defsRes = await request('GET', '/parameter-definitions?page=1&pageSize=100', { token: tokenA });
  const defs = defsRes.json?.data?.data ?? [];
  const defId0 = defs[0]?.id ?? '';
  const defId1 = defs[1]?.id ?? '';
  record('platform product + parameter definitions available', !!ppId && !!defId0, `pp=${ppId} defs=${defs.length}`);

  // ---- create an own test DRAFT ----
  const ts = Date.now();
  const createRes = await request('POST', '/supplier-products/my', {
    token: tokenA, csrf: true,
    json: { platformProductId: ppId, brand: `WP5A Test A ${ts}`, series: 'S', modelNumber: `W5A-${ts}`, description: 'WP-5A runtime controlled test model', technicalDescription: 't', applicationInfo: 'a' },
  });
  const ownId = createRes.json?.data?.id ?? '';
  record('POST /supplier-products/my create (DRAFT)', is2xx(createRes.status) && !!ownId, `id=${ownId || createRes.json?.message}`);
  if (!ownId) { finalize(); return; }

  // ---- R2 Parameter write ----
  const paramSet = await request('PUT', `/supplier-products/my/${ownId}/parameters`, {
    token: tokenA, csrf: true,
    json: { items: [{ parameterDefinitionId: defId0, value: '1200' }, { parameterDefinitionId: defId1, value: 'VIS-WP5A' }] },
  });
  record('PUT /my/:id/parameters (set)', is2xx(paramSet.status), `status=${paramSet.status} ${paramSet.json?.message ?? ''}`);

  const reload1 = await request('GET', `/supplier-products/my/${ownId}`, { token: tokenA });
  const paramsAfter = reload1.json?.data?.parameterValues ?? [];
  const hasDef0 = paramsAfter.some((p: any) => p.parameterDefinitionId === defId0 && p.value === '1200');
  const hasDef1 = paramsAfter.some((p: any) => p.parameterDefinitionId === defId1 && p.value === 'VIS-WP5A');
  record('R2 parameter persistence (reload == same value)', is2xx(reload1.status) && hasDef0 && hasDef1, `overrides=${paramsAfter.length} hasDef0=${hasDef0} hasDef1=${hasDef1}`);

  // ---- R1 Media upload ----
  const up1 = multipart({ title: 'primary' }, makePng(64), 'wp5a_primary.png');
  const upRes = await request('POST', `/supplier-products/my/${ownId}/media/upload`, {
    token: tokenA, csrf: true, raw: true, body: up1.body, headers: up1.headers,
  });
  const mediaA = upRes.json?.data;
  record('R1 media upload (create+persist)', is2xx(upRes.status) && mediaA?.id, `mediaId=${mediaA?.id ?? upRes.json?.message ?? upRes.json?.raw}`);

  let mediaAId = mediaA?.id ?? '';
  if (mediaAId) {
    const setPrimary = await request('PATCH', `/supplier-products/my/${ownId}/media/${mediaAId}`, {
      token: tokenA, csrf: true, json: { isPrimary: true },
    });
    record('R1 media set primary', is2xx(setPrimary.status) && setPrimary.json?.data?.isPrimary === true, `isPrimary=${setPrimary.json?.data?.isPrimary}`);

    const up2 = multipart({ title: 'secondary' }, makePng(80), 'wp5a_secondary.png');
    const up2Res = await request('POST', `/supplier-products/my/${ownId}/media/upload`, {
      token: tokenA, csrf: true, raw: true, body: up2.body, headers: up2.headers,
    });
    const mediaB = up2Res.json?.data;
    record('R1 media second upload', is2xx(up2Res.status) && mediaB?.id, `mediaId=${mediaB?.id ?? up2Res.json?.message ?? up2Res.json?.raw}`);
    const mediaBId = mediaB?.id ?? '';

    // reorder via displayOrder swap
    if (mediaBId) {
      const reorder = await request('PATCH', `/supplier-products/my/${ownId}/media/${mediaBId}`, {
        token: tokenA, csrf: true, json: { displayOrder: -1 },
      });
      record('R1 media reorder (displayOrder)', is2xx(reorder.status) && reorder.json?.data?.displayOrder === -1, `displayOrder=${reorder.json?.data?.displayOrder}`);
      // delete
      const del = await request('DELETE', `/supplier-products/my/${ownId}/media/${mediaBId}`, { token: tokenA, csrf: true });
      record('R1 media delete (persistence)', is2xx(del.status), `status=${del.status}`);
    }

    // cross-org media write: supplier.02 trying supplier.01's product
    tokenB = await login('demo.supplier.02@visndt.local', 'demo123456');
    const crossMedia = await request('PATCH', `/supplier-products/my/${ownId}/media/${mediaAId}`, {
      token: tokenB, csrf: true, json: { title: 'hacked' },
    });
    record('cross-org media write DENIED', (crossMedia.status === 403 || crossMedia.status === 404), `status=${crossMedia.status}`);

    const crossGet = await request('GET', `/supplier-products/my/${ownId}`, { token: tokenB });
    record('cross-org read DENIED (org-scoped 404/403)', crossGet.status === 404 || crossGet.status === 403, `status=${crossGet.status}`);

    const crossParams = await request('PUT', `/supplier-products/my/${ownId}/parameters`, {
      token: tokenB, csrf: true, json: { items: [{ parameterDefinitionId: defId0, value: 'owned-by-B' }] },
    });
    record('cross-org parameter write DENIED', (crossParams.status === 403 || crossParams.status === 404), `status=${crossParams.status}`);
  }

  // ---- Lifecycle: submit then write-blocked ----
  const submitRes = await request('POST', `/supplier-products/my/${ownId}/submit`, { token: tokenA, csrf: true });
  record('POST submit (DRAFT → SUBMITTED)', is2xx(submitRes.status) && submitRes.json?.data?.status === 'SUBMITTED', `status=${submitRes.json?.data?.status ?? submitRes.json?.message}`);

  // after SUBMITTED, media/param writes must be blocked
  const postSubmitMedia = mediaAId ? await request('PATCH', `/supplier-products/my/${ownId}/media/${mediaAId}`, {
    token: tokenA, csrf: true, json: { title: 'after-submit' },
  }) : null;
  const postSubmitParam = await request('PUT', `/supplier-products/my/${ownId}/parameters`, {
    token: tokenA, csrf: true, json: { items: [] },
  });
  record('SUBMITTED media write BLOCKED (lifecycle gate)', postSubmitMedia ? (postSubmitMedia.status === 400) : true, `status=${postSubmitMedia?.status}`);
  record('SUBMITTED parameter write BLOCKED (lifecycle gate)', postSubmitParam.status === 400, `status=${postSubmitParam.status}`);

  // ---- Publication boundary: SUBMITTED model NOT in public capability context ----
  const pubCat = await request('GET', `/products?page=1&pageSize=50`, {});
  const capRows = await request('GET', `/products/${platform?.slug ?? ''}/supplier-models?page=1&pageSize=50`, {});
  const leaked = JSON.stringify(capRows.json).includes(ownId) || JSON.stringify(pubCat.json).includes(ownId);
  record('SUBMITTED model NOT leaked into public context', !leaked, leaked ? 'LEAK DETECTED' : 'not present in public surfaces');

  finalize();
}

function finalize() {
  const passed = results.filter((r) => r.ok).length;
  const failed = results.length - passed;
  console.log('\n=== WP-5A Runtime Summary ===');
  console.log(`总步骤 ${results.length} / 通过 ${passed} / 失败 ${failed}`);
  if (failed > 0) {
    console.log('\n失败项：');
    results.filter((r) => !r.ok).forEach((r) => console.log(`  ❌ ${r.step} — ${r.detail}`));
  }
  process.exitCode = failed > 0 ? 1 : 0;
}

main().catch((e) => { console.error('脚本异常:', e); process.exit(1); });