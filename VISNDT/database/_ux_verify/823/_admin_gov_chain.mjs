// Admin high-value governance chain: DRAFT -> SUBMITTED -> REVIEWING -> APPROVED
// on controlled DRAFT supplier product. Stops at APPROVED (non-public governance state).
// CSRF: double-submit cookie. Need csrf_token cookie == X-CSRF-Token header on mutating calls.
const base='http://localhost:4000/api/v1';
const LOG='F:/Desktop/VISNDT/VISNDT/database/_ux_verify/admin/823_admin_gov_chain.jsonl';
const { appendFileSync } = await import('node:fs');
const SP_ID='e037dea8-d486-4732-b495-c855aa668c2c';
let CSRF=null; // csrf token value

function rec(step,action,expected,actual,pass,note){
  const o={step,api:'admin/supplier-products',action,expected,actual:(actual||'').slice(0,200),pass,note,role:'ADMIN'};
  appendFileSync(LOG, JSON.stringify(o)+'\n');
  console.log(JSON.stringify(o));
}

async function getCsrf(){
  // GET /auth/csrf sets csrf_token cookie (HttpOnly? read from set-cookie regardless)
  const r=await fetch(base+'/auth/csrf');
  const setc=r.headers.get('set-cookie')||'';
  const m=setc.match(/csrf_token=([^;]+)/);
  const body=await r.json();
  CSRF=m?m[1]:(body.data?.csrfToken||body.csrfToken||null);
  if(!CSRF) console.error('no csrf cookie/token from /auth/csrf; set-cookie=',setc.slice(0,200),'body=',JSON.stringify(body).slice(0,200));
  console.log('csrf=',CSRF?CSRF.slice(0,8)+'...':'(missing)');
}
async function login(){
  await getCsrf();
  const cookieHdr=CSRF?('csrf_token='+CSRF+'; '):'';
  const r=await fetch(base+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json',Cookie:cookieHdr},body:JSON.stringify({email:'demo.admin@visndt.local',password:'demo123456'})});
  const j=await r.json();
  return j.data?.access_token||j.data?.accessToken||null;
}
async function call(token, method, path, body){
  const headers={'Content-Type':'application/json',Authorization:'Bearer '+token,'X-CSRF-Token':CSRF||''};
  if(CSRF) headers.Cookie='csrf_token='+CSRF+'; ';
  const r=await fetch(base+path,{method,headers,body:body?JSON.stringify(body):undefined});
  const t=await r.text();
  let data=null; try{ data=JSON.parse(t); }catch{}
  return {status:r.status, data, raw:t.slice(0,200)};
}

const token = await login();
if(!token){ console.error('LOGIN FAIL'); process.exit(1); }
console.log('admin token ok');
const delay=(ms)=>new Promise(r=>setTimeout(r,ms));

let r = await call(token,'GET',`/admin/supplier-products/${SP_ID}`);
rec('chain-0','GET admin detail (鉴权探针)','200','status='+r.status+' st='+(r.data?.data?.status), r.status===200, 'admin GET authorized');
await delay(2000);

r = await call(token,'POST',`/admin/supplier-products/${SP_ID}/submit`);
rec('chain-1','submit (DRAFT→SUBMITTED)','200 渲染DRAFT→SUBMITTED','status='+r.status, r.status===200||r.status===201, (r.data?.data?.status)||r.data?.message||'');
if(!(r.status<300)){ console.log('submit failed, actual=',r.raw); process.exit(1); }
await delay(2000);

r = await call(token,'POST',`/admin/supplier-products/${SP_ID}/review`);
rec('chain-2','beginReview (SUBMITTED→REVIEWING)','200','status='+r.status+' new='+(r.data?.data?.status), r.status<300, r.status<300?('now '+(r.data?.data?.status)):'');
if(!(r.status<300)){ process.exit(1); }
await delay(2000);

r = await call(token,'POST',`/admin/supplier-products/${SP_ID}/approve`);
rec('chain-3','approve (REVIEWING→APPROVED)','200','status='+r.status+' new='+(r.data?.data?.status), r.status<300, r.status<300?('now '+(r.data?.data?.status)):'');
if(!(r.status<300)){ process.exit(1); }

console.log('CHAIN DONE (APPROVED reached).');
process.exit(0);