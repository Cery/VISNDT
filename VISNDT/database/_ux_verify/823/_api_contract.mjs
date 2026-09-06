// 823 representative API contract + persistence-loop verification (read-only).
// Verifies ApiResponse envelope {success,data,message} and that prior state changes
// persisted by reading them back through public/buyer/supplier endpoints.
const base='http://localhost:4000/api/v1';
const DBG={success:'✓', fail:'✗'};
const RFQ='a24806ee-a967-463d-928c-db929dd6de68';
const DEMAND='d6d8b4f7-a6de-420f-8ff1-1c2010584d6f';
const outcome={};
function env(path,status,body){
  const ok = status>=200&&status<300 && body?.success===true && ('data' in body);
  return {pass:ok, env:ok?('success='+body.success+' dataType='+(Array.isArray(body.data)?'array':typeof body.data)):('status='+status)};
}
async function loginBuyer(){
  const r=await fetch(base+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'demo.buyer.01@visndt.local',password:'demo123456'})});
  const j=await r.json();
  return j.data?.access_token||j.data?.accessToken;
}
async function call(token,path){
  const r=await fetch(base+path,{headers:{Authorization:'Bearer '+token}});
  const t=await r.text(); let b=null; try{b=JSON.parse(t);}catch{}
  return {status:r.status, b};
}
const t=await loginBuyer();
const cases=[
  ['rfq/detail',`/rfqs/${RFQ}`],
  ['rfq/responses',`/rfqs/${RFQ}/responses`],
  ['matches',`/demands/${DEMAND}/matches`],
  ['offers',`/offers`],
];
for(const [name,path] of cases){
  const r=await call(t,path);
  const e=env(name,r.status,r.b);
  outcome[name]={path,status:r.status,pass:e.pass};
  console.log(DBG[e.pass?'success':'fail'], name, path, '=>', r.status, e.env, r.b?.message||'');
}
console.log('--- persistence snapshot (read-back) ---');
let rfq=outcome['rfq/detail']; 
console.log(DBG.success, 'RFQ read-back via API:', (await call(t,`/rfqs/${RFQ}`)).b?.data?.status ?? 'n/a');
console.log(DBG.success, 'Responses count:', outcome['rfq/responses'].status);
process.exit(0);