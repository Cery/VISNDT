/* 666 runtime validation matrix (real API @ :4000) — corrected unified-search shape */
import { writeFileSync } from 'node:fs';
const BASE = 'http://localhost:4000/api/v1';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const out = [];
async function raw(p, o={}) {
  const r = await fetch(BASE+p, { redirect:'manual', ...o, headers:{ 'Content-Type':'application/json', 'Connection':'close', ...(o.headers||{}) } });
  let b=null; try{ b=await r.json(); }catch{}
  return { status:r.status, body:b, cookies: r.headers.getSetCookie ? r.headers.getSetCookie() : [] };
}
function cookieStr(a){ const s=new Set(); for(const c of a){ const n=c.split(';')[0].split('=')[0]; if(['access_token','refresh_token'].includes(n)) s.add(c.split(';')[0]); } return [...s].join('; '); }
async function login(email){ const r=await raw('/auth/login',{method:'POST',body:JSON.stringify({email,password:'demo123456'})}); return { status:r.status, cookie:cookieStr(r.cookies), body:r.body }; }
const items = (dim) => (Array.isArray(dim?.items)?dim.items:Array.isArray(dim)?dim:[]);

(async()=>{
  await sleep(2000);
  // ---- Public unified search (regression across dimensions) ----
  const uni = await raw('/search?q=内窥镜&pageSize=10');
  const tb = uni.body ?? {};
  const counts = { products: items(tb.products).length, sp: items(tb.supplierProducts).length,
    knowledge: items(tb.knowledge).length, content: items(tb.content).length, solution: items(tb.solutions).length };
  out.push(`[SEARCH] unified /search?q=内窥镜 -> ${uni.status} dims=${JSON.stringify(counts)}`);
  const spStats = {};
  for (const sp of items(tb.supplierProducts)) spStats[sp.status]=(spStats[sp.status]||0)+1;
  out.push(`[SEARCH-BOUNDARY] unified supplierProducts status=${JSON.stringify(spStats)} (应仅PUBLISHED)`);
  out.push(`[FACETS] supplierProductFacets keys=${JSON.stringify(Object.keys(tb.supplierProductFacets||{}))}`);

  // ---- supplier-models facet search (boundary + brand/series/hasOffer/page) ----
  const sm = await raw('/search/supplier-models?q=内窥镜&pageSize=50');
  const smArr = Array.isArray(sm.body?.data?.data) ? sm.body.data.data :
      (Array.isArray(sm.body?.data) ? sm.body.data : sm.body?.data?.items ?? []);
  const stSet = {};
  smArr.forEach(r=>stSet[r.status]=(stSet[r.status]||0)+1);
  out.push(`[SM-BOUNDARY] /search/supplier-models n=${smArr.length} status=${JSON.stringify(stSet)}`);
  const br = await raw('/search/supplier-models?q=内窥镜&brand=明视');
  const brArr = br.body?.data?.data ?? br.body?.data ?? [];
  const se = await raw('/search/supplier-models?q=内窥镜&series=精密扫描');
  const seArr = se.body?.data?.data ?? se.body?.data ?? [];
  const ho = await raw('/search/supplier-models?q=内窥镜&hasOffer=true');
  const hoArr = ho.body?.data?.data ?? ho.body?.data ?? [];
  const pg1 = await raw('/search/supplier-models?q=内窥镜&page=1&pageSize=2');
  const pg2 = await raw('/search/supplier-models?q=内窥镜&page=2&pageSize=2');
  const p1=pg1.body?.data?.data ?? pg1.body?.data ?? [], p2=pg2.body?.data?.data ?? pg2.body?.data ?? [];
  out.push(`[FACET] brand=明视 n=${Array.isArray(brArr)?brArr.length:'?'} series=精密扫描 n=${Array.isArray(seArr)?seArr.length:'?'} hasOffer=true n=${Array.isArray(hoArr)?hoArr.length:'?'} page1 n=${Array.isArray(p1)?p1.length:'?'} page2 n=${Array.isArray(p2)?p2.length:'?'}`);

  // ---- Supplier runtime isolation ----
  await sleep(2500);
  const s1 = await login('demo.supplier.01@visndt.local');
  await sleep(2500);
  const s2 = await login('demo.supplier.02@visndt.local');
  const r1 = s1.status===201 ? await raw('/workspace/supplier/runtime/products?pageSize=50', { headers:{ Cookie:s1.cookie } }) : null;
  const r2 = s2.status===201 ? await raw('/workspace/supplier/runtime/products?pageSize=50', { headers:{ Cookie:s2.cookie } }) : null;
  const a1 = r1?items(r1.body?.data):[], a2 = r2?items(r2.body?.data):[];
  const b1 = [...new Set(a1.map(x=>x.brand))], b2 = [...new Set(a2.map(x=>x.brand))];
  const cross = a1.filter(x=>a2.some(y=>y.id===x.id)).length;
  out.push(`[SUPPLIER] s1 login=${s1.status} n=${a1.length} brands=${JSON.stringify(b1)} | s2 login=${s2.status} n=${a2.length} brands=${JSON.stringify(b2)} | crossVisible=${cross}`);

  // ---- Admin governance ----
  await sleep(2500);
  const adm = await login('demo.admin@visndt.local');
  const apool = adm.status===201 ? await raw('/admin/supplier-products?pageSize=50', { headers:{ Cookie:adm.cookie } }) : null;
  const apoolArr = apool?items(apool.body?.data):[];
  const adetail = (apoolArr[0]&&adm.status===201) ? await raw('/admin/supplier-products/'+apoolArr[0].id, { headers:{ Cookie:adm.cookie } }) : null;
  const afilt = (adm.status===201) ? await raw('/admin/supplier-products?status=PUBLISHED', { headers:{ Cookie:adm.cookie } }) : null;
  out.push(`[ADMIN] login=${adm.status} pool n=${apoolArr.length} detail=${adetail?.status??'n/a'} filterPUBLISHED n=${afilt?items(afilt.body?.data).length:'n/a'}`);

  // ---- Inquiry context (s1 published model) ----
  if (s1.status===201 && a1.length){ const pubId=a1.find(x=>x.status==='PUBLISHED')?.id||a1[0].id;
    const ctx = await raw('/workspace/supplier/runtime/products/'+pubId+'/inquiry-context', { headers:{ Cookie:s1.cookie } });
    out.push(`[INQUIRY-CONTEXT] s1 model=${a1.find(x=>x.id===pubId)?.modelNumber} -> ${ctx.status}`); }

  write();
  function write(){ writeFileSync('_666_runtime.json', JSON.stringify(out,null,2)); console.log(out.join('\n')); }
  await sleep(200);
  console.log('DONE');
})().catch(e=>{ console.error('ERR',e.message); try{ writeFileSync('_666_runtime.json', JSON.stringify(out,null,2));}catch{}; });