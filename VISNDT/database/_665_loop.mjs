/* 665 final: business closed loop — Demand→Match→RFQ→Supplier targeted RFQ→Response
 * plus fix inquiry id extraction (ApiResponse wraps as { data: { inquiry: {...} } }) */
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
  // ---- buyer session + csrf ----
  await sleep(1200);
  const csrf = await raw('/auth/csrf');
  const csrfCookie = cookieStr(csrf.cookies);
  const csrfToken = csrf.body?.data?.csrfToken ?? csrf.body?.csrfToken ?? null;
  const bu = await login('demo.buyer.01@visndt.local');
  const buyerCookie = bu.cookie + (csrfToken ? `; csrf_token=${csrfToken}` : '');
  const authed = (extra={}) => ({ 'Cookie': buyerCookie, 'X-CSRF-Token': csrfToken, 'Content-Type':'application/json', ...extra });
  out.push(`[DEMAND] buyer login=${bu.status} csrf=${!!csrfToken}`);

  // 1. create demand
  const createDemand = await raw('/demands', {
    method:'POST', headers: authed(),
    body: JSON.stringify({
      title:'665 Audit: Need 3D structural light scanner',
      description:'Productization baseline closed-loop validation demand.',
      budgetRange:'100000-500000', quantity:2, quantityUnit:'台',
      expectedDeliveryDate:'2026-12-31',
      contactName:'Demo Buyer', contactEmail:'demo.buyer.01@visndt.local', contactVisible:false
    })
  });
  const demandId = createDemand.body?.data?.id ?? null;
  const demandStatus = createDemand.body?.data?.status ?? null;
  out.push(`[DEMAND] create -> ${createDemand.status} id=${!!demandId} status=${demandStatus}`);
  if (!demandId) { end(); return; }

  // add demand parameters matching 3DSCAN-Pro (definition ids from runtime query)
  const params = [
    { parameterDefinitionId:'f464ee4f-6c73-4a7b-a126-54bb1966d630', value:'0.02mm', required:true, priority:10 }, // resolution
    { parameterDefinitionId:'b22343be-5d44-405f-b8b6-b6a7bca84b55', value:'USB3.0', required:true, priority:8 },  // data_interface
    { parameterDefinitionId:'78508feb-813e-4da2-9633-29b2a416c08d', value:'2.5', required:false, priority:5 },    // weight
  ];
  for (const p of params) {
    const par = await raw(`/demands/${demandId}/parameters`, { method:'POST', headers: authed(), body: JSON.stringify(p) });
    out.push(`[DEMAND] addParam ${p.parameterDefinitionId.slice(0,8)} -> ${par.status}`);
  }

  // 2. publish -> triggers async matching
  const pub = await raw(`/demands/${demandId}/publish`, { method:'POST', headers: authed() });
  out.push(`[DEMAND] publish -> ${pub.status} status=${pub.body?.data?.status ?? '-'}`);

  // wait for async matching
  await sleep(3000);
  const matches = await raw(`/demands/${demandId}/matches`, { headers: authed() });
  const mArr = matches.body?.data?.data ?? (Array.isArray(matches.body?.data) ? matches.body.data : []) ?? [];
  const mTotal = matches.body?.data?.total ?? mArr.length;
  out.push(`[MATCH] GET /demands/:id/matches -> ${matches.status} total=${mTotal}`);
  if (mTotal > 0 && mArr[0]) {
    const matchId = mArr[0].id;
    out.push(`[MATCH] firstMatch id=${!!matchId} product=${mArr[0].product?.name ?? '-'} score=${mArr[0].score ?? mArr[0].matchScore ?? '-'} status=${mArr[0].matchStatus ?? mArr[0].status ?? '-'}`);
    // 3. chain: PENDING→MATCHED→REVIEWED→ACCEPTED
    if (matchId) {
      const toMatched = await raw(`/demands/${demandId}/matches/${matchId}`, { method:'PATCH', headers: authed(), body: JSON.stringify({ status:'MATCHED' }) });
      out.push(`[MATCH] →MATCHED -> ${toMatched.status}`);
      const toReviewed = await raw(`/demands/${demandId}/matches/${matchId}`, { method:'PATCH', headers: authed(), body: JSON.stringify({ status:'REVIEWED' }) });
      out.push(`[MATCH] →REVIEWED -> ${toReviewed.status}`);
      const toAccepted = await raw(`/demands/${demandId}/matches/${matchId}`, { method:'PATCH', headers: authed(), body: JSON.stringify({ status:'ACCEPTED' }) });
      out.push(`[MATCH] →ACCEPTED -> ${toAccepted.status}`);
    }
  } else {
    out.push('[MATCH] NO MATCHES — matching path did not produce DemandMatch records in runtime.');
  }

  // 4. create RFQ from a match (use matches list regardless of accept)
  await sleep(1000);
  const m2 = await raw(`/demands/${demandId}/matches`, { headers: authed() });
  const mArr2 = m2.body?.data?.data ?? (Array.isArray(m2.body?.data) ? m2.body.data : []) ?? [];
  const matchId2 = mArr2?.[0]?.id ?? null;
  if (matchId2) {
    const rfq = await raw('/rfqs/from-match', { method:'POST', headers: authed(), body: JSON.stringify({ matchId: matchId2 }) });
    const rfqId = rfq.body?.data?.id ?? null;
    const rfqStatus = rfq.body?.data?.status ?? null;
    out.push(`[RFQ] from-match -> ${rfq.status} id=${!!rfqId} status=${rfqStatus}`);
    if (rfqId) {
      const pubRfq = await raw(`/rfqs/${rfqId}/publish`, { method:'POST', headers: authed() });
      out.push(`[RFQ] publish -> ${pubRfq.status} status=${pubRfq.body?.data?.status ?? '-'}`);
      // 5. supplier sees targeted RFQ
      await sleep(500);
      const s1 = await login('demo.supplier.01@visndt.local');
      const supRfqs = await raw('/workspace/supplier/rfqs', { headers:{ Cookie: s1.cookie } });
      const srArr = supRfqs.body?.data?.data ?? supRfqs.body?.data ?? [];
      const seen = Array.isArray(srArr) ? srArr.some(r=>r.id===rfqId || r.reference===rfqId) : false;
      out.push(`[RFQ] supplier /workspace/supplier/rfqs -> ${supRfqs.status} supplierSeesTargeted=${seen}`);
    }
  } else {
    out.push('[RFQ] SKIP — no match available to create RFQ from.');
  }

  // 6. buyer notifications & pending responses confirm loop
  await sleep(500);
  const notif = await raw('/notifications', { headers: authed() });
  out.push(`[NOTIF] buyer /notifications -> ${notif.status}`);
  const pending = await raw('/workspace/buyer/pending-responses', { headers: authed() });
  out.push(`[RESP] buyer /workspace/buyer/pending-responses -> ${pending.status}`);

  end();
  function end(){
    writeFileSync('_665_loop.json', JSON.stringify(out,null,2));
    console.log(out.join('\n'));
  }
})().catch(e=>{console.error('FATAL',e); process.exit(1);});