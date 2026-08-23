// 665 follow-up: CSRF-aware buyer inquiry + supplier2 multi-supplier + demand/match loop confirm
import { writeFileSync } from 'node:fs';
const BASE = 'http://localhost:4000/api/v1';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const out = [];
function h(extra={}) { return { 'Content-Type':'application/json', ...extra }; }
async function raw(path, opts={}) {
  const res = await fetch(BASE+path, { redirect:'manual', ...opts, headers:h(opts.headers) });
  let b=null; try{ b=await res.json(); }catch{}
  return { status:res.status, body:b, cookies: res.headers.getSetCookie ? res.headers.getSetCookie() : [] };
}
function cookieStr(a){ const s=new Set(); for(const c of a){ const n=c.split(';')[0].split('=')[0]; if(['access_token','refresh_token','csrf_token'].includes(n)) s.add(c.split(';')[0]); } return [...s].join('; '); }
async function login(email){ const r=await raw('/auth/login',{method:'POST',body:JSON.stringify({email,password:'demo123456'})}); return {status:r.status,cookie:cookieStr(r.cookies),body:r.body}; }

(async()=>{
  // supplier2 login after gap
  await sleep(2500);
  const s2 = await login('demo.supplier.02@visndt.local');
  out.push(`SUP2 login -> ${s2.status} cookie=${!!s2.cookie}`);
  if (s2.cookie) {
    const ov = await raw('/workspace/supplier/overview', { headers:{ Cookie:s2.cookie } });
    out.push(`SUP2 /workspace/supplier/overview -> ${ov.status}`);
  }

  // buyer: get CSRF then create inquiry
  await sleep(1500);
  const csrf = await raw('/auth/csrf');
  out.push(`BUYER /auth/csrf -> ${csrf.status}`);
  const csrfCookie = cookieStr(csrf.cookies);
  const csrfToken = csrf.body?.data?.csrfToken ?? csrf.body?.csrfToken ?? null;
  out.push(`BUYER csrfToken=${!!csrfToken}`);
  // login buyer
  const bu = await login('demo.buyer.01@visndt.local');
  const buyerCookie = bu.cookie + (csrfToken ? `; csrf_token=${csrfToken}` : '');
  out.push(`BUYER login -> ${bu.status}`);

  // find a PUBLISHED supplier product to inquire (reuse 3DSCAN search)
  const sp = await raw('/search?type=supplier-product&q='+encodeURIComponent('扫描'));
  const item = sp.body?.supplierProducts?.items?.find(i=>i.supplierProduct?.status==='PUBLISHED');
  const spId = item?.supplierProduct?.id;
  const prodId = item?.supplierProduct?.platformProductId;
  const orgId = item?.supplierProduct?.organization?.id;
  // offer id via /offers
  const offs = await raw('/offers');
  const offArr = offs.body?.data?.data ?? offs.body?.data?.offers ?? (Array.isArray(offs.body?.data) ? offs.body.data : []);
  const offer = (offArr||[]).find(o=>o.supplierProductId===spId) || offArr?.[0];
  out.push(`seek SP model=${item?.supplierProduct?.modelNumber} offersLen=${(offArr||[]).length} offer=${!!offer}`);
  out.push(`BAE ${sp.status}`);

  const inq = await raw('/inquiries', {
    method:'POST',
    headers:{ 'Cookie':buyerCookie, 'X-CSRF-Token':csrfToken },
    body: JSON.stringify({
      productId: prodId, offerId: offer?.id, organizationId: orgId,
      supplierProductId: spId, name:'Demo Buyer', email:'demo.buyer.01@visndt.local',
      message:'665 audit: request quotation for this model.'
    })
  });
  out.push(`BUYER POST /inquiries (CSRF) -> ${inq.status}`);
  const inqId = inq.body?.data?.id ?? null;
  out.push(`BUYER inquiry id=${inqId}`);
  if (inqId) {
    const rd = await raw('/inquiries/'+inqId, { headers:{ Cookie: buyerCookie } });
    const d = rd.body?.data?.data ?? rd.body?.data;
    out.push(`BUYER GET /inquiries/:id -> ${rd.status} model=${d?.supplierProduct?.modelNumber ?? d?.modelNumber ?? '-'} org=${d?.supplierOrganization?.name ?? d?.organization?.name ?? d?.organizationId ?? '-'} spIdMatch=${d?.supplierProductId===spId}`);
    // supplier sees buyer interest
    const si = await login('demo.supplier.01@visndt.local');
    var sic = si.cookie;
    const sc = await raw('/workspace/supplier/runtime/products/'+spId+'/inquiry-context', { headers:{ Cookie: si.cookie } });
    const scd = sc.body?.data?.data ?? sc.body?.data;
    const hasInq = Array.isArray(scd?.inquiries) ? scd.inquiries.some(i=>i.id===inqId) : false;
    out.push(`SUP inquiry-context -> ${sc.status} sp=${scd?.modelNumber ?? scd?.id ?? '-'} hasCreatedInquiry=${hasInq}`);

    // business loop read: my demands + match status + with supplier response/notification
    const dm = await raw('/demands/mine', { headers:{ Cookie: buyerCookie } });
    out.push(`BUYER /demands/mine -> ${dm.status}`);
  }
  writeFileSync('_665_inquiry.json', JSON.stringify(out,null,2));
  console.log(out.join('\n'));
})().catch(e=>{console.error('FATAL',e);process.exit(1);});