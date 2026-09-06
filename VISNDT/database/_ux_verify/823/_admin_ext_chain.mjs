// Admin extended high-value actions: publish/unpublish (APPROVED<->PUBLISHED) + reject (with note) on a newly-created controlled DRAFT.
// Records evidence to admin/823_admin_gov_chain.jsonl
const base='http://localhost:4000/api/v1';
const LOG='F:/Desktop/VISNDT/VISNDT/database/_ux_verify/admin/823_admin_gov_chain.jsonl';
const { appendFileSync } = await import('node:fs');
let CSRF=null;
function rec(step,api,action,expected,actual,pass,note){
  const o={step,api,action,expected,actual:(actual||'').slice(0,200),pass,note,role:'ADMIN'};
  appendFileSync(LOG, JSON.stringify(o)+'\n');
  console.log(JSON.stringify(o));
}
async function getCsrfGet(){
  const r=await fetch(base+'/auth/csrf');
  const setc=r.headers.get('set-cookie')||'';
  const m=setc.match(/csrf_token=([^;]+)/);
  const body=await r.json();
  CSRF=m?m[1]:(body.data?.csrfToken||body.csrfToken||null);
  return CSRF;
}
async function call(token,method,path,body){
  const h={'Content-Type':'application/json',Authorization:'Bearer '+token,'X-CSRF-Token':CSRF||''};
  if(CSRF) h.Cookie='csrf_token='+CSRF+'; ';
  const r=await fetch(base+path,{method,headers:h,body:body?JSON.stringify(body):undefined});
  const t=await r.text(); let data=null; try{data=JSON.parse(t);}catch{}
  return {status:r.status, data, raw:t.slice(0,220)};
}
async function main(){
  await getCsrfGet();
  const lr=await fetch(base+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'demo.admin@visndt.local',password:'demo123456'})});
  const j=await lr.json();
  const token=j.data?.access_token||j.data?.accessToken;
  if(!token){ console.error('LOGIN FAIL'); process.exit(1); }
  const delay=(ms)=>new Promise(r=>setTimeout(r,ms));

  const PUB='e037dea8-d486-4732-b495-c855aa668c2c';
  const ORG='926d5a96-e1be-455c-8d58-8f4a79b6735d';
  const PP='98fe9224-12b1-4b2e-ba5d-f17f23f7e9e2';

  // Publish (APPROVED->PUBLISHED) then unpublish (PUBLISHED->APPROVED) on same product
  let r=await call(token,'POST',`/admin/supplier-products/${PUB}/publish`);
  rec('chain-p1','admin/supplier-products','publish (APPROVED→PUBLISHED)','201','status='+r.status+' new='+(r.data?.data?.status), r.status<300, r.status<300?('now '+(r.data?.data?.status)):'');
  if(!(r.status<300)){ console.log('publish FAIL', r.raw); }
  await delay(1800);
  r=await call(token,'POST',`/admin/supplier-products/${PUB}/unpublish`);
  rec('chain-p2','admin/supplier-products','unpublish (PUBLISHED→APPROVED)','201','status='+r.status+' new='+(r.data?.data?.status), r.status<300, r.status<300?('now '+(r.data?.data?.status)):'');
  if(!(r.status<300)){ console.log('unpublish FAIL', r.raw); }
  await delay(1800);

  // Reject path on a NEW controlled DRAFT -> submit -> review -> reject(with note)
  r=await call(token,'POST','/admin/supplier-products',{organizationId:ORG,platformProductId:PP,brand:'UX测试品牌',modelNumber:'UX-REJ-TEST-001',description:'UX reject-path controlled test (created for 823, will be removed)'});
  rec('chain-r0','admin/supplier-products','create controlled DRAFT (reject path)','201','status='+r.status+' new='+(r.data?.data?.status), r.status<300, (r.data?.data?.id)||'');
  const NEWID=r.data?.data?.id;
  if(!NEWID){ console.log('create FAIL', r.raw); process.exit(1); }
  await delay(1500);
  r=await call(token,'POST',`/admin/supplier-products/${NEWID}/submit`);
  rec('chain-r1','admin/supplier-products','submit (DRAFT→SUBMITTED)','201','status='+r.status+' new='+(r.data?.data?.status), r.status<300, '');
  if(!(r.status<300)){ process.exit(1); }
  await delay(1500);
  r=await call(token,'POST',`/admin/supplier-products/${NEWID}/review`);
  rec('chain-r2','admin/supplier-products','beginReview (SUBMITTED→REVIEWING)','201','status='+r.status+' new='+(r.data?.data?.status), r.status<300, '');
  if(!(r.status<300)){ process.exit(1); }
  await delay(1500);
  r=await call(token,'POST',`/admin/supplier-products/${NEWID}/reject`,{reviewedNote:'823 controlled reject-path verification note'});
  rec('chain-r3','admin/supplier-products','reject (REVIEWING→REJECTED, note)','200/201','status='+r.status+' new='+(r.data?.data?.status), r.status<300, r.status<300?('now '+(r.data?.data?.status)):r.raw);

  // cleanup: delete controlled NEWID
  await delay(1200);
  r=await call(token,'DELETE',`/admin/supplier-products/${NEWID}`);
  rec('chain-r4','admin/supplier-products','cleanup delete controlled DRAFT','200','status='+r.status, r.status<300, 'controlled test removed');

  console.log('EXT CHAIN DONE. e037dea8 final state:');
  r=await call(token,'GET',`/admin/supplier-products/${PUB}`);
  console.log('  e037dea8 status=', r.status, r.data?.data?.status);
  process.exit(0);
}
main();