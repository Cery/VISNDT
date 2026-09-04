// 818 READ-ONLY API runtime audit. No writes. GET only.
const BASE = process.env.API_BASE || 'http://localhost:4000/api/v1';
class Jar {
  constructor() { this.cookies = {}; }
  set(lines) {
    for (const line of (lines || [])) {
      const [pair] = line.split(';');
      const eq = pair.indexOf('=');
      if (eq === -1) continue;
      this.cookies[pair.slice(0, eq).trim()] = pair.slice(eq + 1).trim();
    }
  }
  header() { return Object.entries(this.cookies).map(([k, v]) => `${k}=${v}`).join('; '); }
}
async function api(path, { jar, token, method = 'GET', csrf, body } = {}) {
  const headers = {};
  if (jar) headers['Cookie'] = jar.header();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (csrf) headers['X-CSRF-Token'] = csrf;
  if (body) headers['Content-Type'] = 'application/json';
  const res = await fetch(BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch {}
  const setCookie = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
  return { status: res.status, json, setCookie };
}
const out = {};

(async () => {
  async function loginAs(email, password) {
    const j = new Jar();
    const c = await api('/auth/csrf', { jar: j });
    j.set(c.setCookie);
    const r = await api('/auth/login', { jar: j, method: 'POST', csrf: c.json?.data?.csrfToken, body: { email, password } });
    j.set(r.setCookie || []);
    let t = r.json?.data?.accessToken || null;
    if (!t) {
      const vals = (r.setCookie || []).map((s) => s.split(';')[0].replace(/^[^=]+=/, '')).filter((v) => v && v !== 'undefined' && v.length > 20);
      if (vals[0]) t = vals[0];
    }
    return { jar: j, token: t, loginStatus: r.status };
  }

  // Admin pool
  const adm = await loginAs('admin@visndt.com', 'admin123456');
  out.adminLogin = adm.loginStatus;
  out.adminToken = !!adm.token;
  const adminList = await api('/admin/supplier-products?pageSize=50', { jar: adm.jar, token: adm.token });
  out.adminPoolStatus = adminList.status;
  const items = adminList.json?.data?.data || adminList.json?.data || [];
  out.adminPoolTotal = items.length;
  out.adminPool = items.map((i) => ({ id: i.id, org: i.organizationId, pp: i.platformProductId, brand: i.brand, modelNumber: i.modelNumber, status: i.status }));

  const draft = items.find((i) => i.status === 'DRAFT');
  const published = items.find((i) => i.status === 'PUBLISHED');
  out.attachDraftFromAdmin = draft ? { id: draft.id, org: draft.organizationId, pp: draft.platformProductId, brand: draft.brand, modelNumber: draft.modelNumber } : null;
  out.publishedSample = published ? { id: published.id, org: published.organizationId, pp: published.platformProductId, modelNumber: published.modelNumber } : null;
  const ppForDraft = draft?.platformProductId;

  // Owner supplier
  const owner = await loginAs('demo.supplier.01@visndt.local', 'demo123456');
  out.ownerLogin = owner.loginStatus;
  const ownerProducts = await api('/workspace/supplier/runtime/products?pageSize=50', { jar: owner.jar, token: owner.token });
  out.ownerProductsStatus = ownerProducts.status;
  const opItems = ownerProducts.json?.data?.data || ownerProducts.json?.data || [];
  out.ownerSees = opItems.map((i) => ({ id: i.id, modelNumber: i.modelNumber, status: i.status, platformProduct: i.platformProduct?.name }));

  // Cross-org supplier tries to read the DRAFT
  const other = await loginAs('demo.supplier.02@visndt.local', 'demo123456');
  let crossStatus = null;
  if (draft) {
    const cross = await api(`/workspace/supplier/runtime/products/${draft.id}/inquiry-context`, { jar: other.jar, token: other.token });
    crossStatus = cross.status;
  }
  out.crossOrgReadDraftStatus = crossStatus; // expect 403

  // Public capability detail
  if (ppForDraft) {
    const cap = await api(`/capabilities/${ppForDraft}`);
    out.publicCapStatus = cap.status;
    const sp = cap.json?.data?.supplierProducts || cap.json?.data?.supplierProduct || null;
    out.publicCapSupplierProducts = Array.isArray(sp) ? sp.map((s) => ({ id: s.id, modelNumber: s.modelNumber, status: s.status })) : (sp ? [Array.isArray(sp) ? sp.length : sp] : null);
    out.publicCapDraftPresent = Array.isArray(sp) ? sp.some((s) => s.status === 'DRAFT' || (draft && s.id === draft.id)) : null;
  }
  if (draft) {
    const search = await api(`/search?q=${encodeURIComponent(draft.modelNumber)}`);
    out.publicSearchStatus = search.status;
    out.publicSearchContainsDraftId = JSON.stringify(search.json || {}).toLowerCase().includes(draft.id.slice(0, 8));
  }

  // Buyer login status only (no write attempted)
  const buyer = await loginAs('demo.buyer.01@visndt.local', 'demo123456');
  out.buyerLogin = buyer.loginStatus;

  console.log(JSON.stringify(out, null, 2));
})().catch((e) => { console.error(e); process.exit(1); });