/* 667 runtime scan — locate VX-6000 capability + inspect current capability API shape */
const BASE = 'http://localhost:4000/api/v1';
async function raw(p, o = {}) {
  const r = await fetch(BASE + p, {
    redirect: 'manual',
    ...o,
    headers: { 'Content-Type': 'application/json', 'Connection': 'close', ...(o.headers || {}) },
  });
  let b = null; try { b = await r.json(); } catch {}
  return { status: r.status, body: b };
}
const items = (dim) => (Array.isArray(dim?.items) ? dim.items : Array.isArray(dim) ? dim : []);

(async () => {
  // 1. Unified search for VX-6000
  const s = await raw('/search?q=VX-6000&pageSize=50');
  const pp = items(s.body?.data?.products);
  const sp = items(s.body?.data?.supplierProducts);
  console.log('[SEARCH] status=', s.status);
  console.log('[PLATFORM] ', JSON.stringify(pp.map((p) => ({ id: p.id, slug: p.slug, name: p.name, status: p.status }))));
  console.log('[SP count] ', sp.length);
  console.log('[SP sample] ', JSON.stringify(sp[0] ?? null));

  // 2. Capability API shape for the first matching platform product
  const capId = pp[0]?.id;
  if (capId) {
    const c = await raw(`/capabilities/${capId}`);
    const cb = c.body?.data;
    console.log('[CAPABILITY] status=', c.status, 'platform=', JSON.stringify(cb?.platformProduct));
    const sps = cb?.supplierProducts ?? [];
    console.log('[CAP SP count] ', sps.length);
    console.log('[CAP SP keys] ', sps[0] ? JSON.stringify(Object.keys(sps[0].supplierProduct ?? {})) : 'none');
    console.log('[CAP SP first] ', JSON.stringify(sps[0]?.supplierProduct));
  }
})();
