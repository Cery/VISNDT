const base='http://localhost:4000/api/v1';
const SP_ID='e037dea8-d486-4732-b495-c855aa668c2c';
async function login(){
  const r=await fetch(base+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'demo.admin@visndt.local',password:'demo123456'})});
  const j=await r.json();
  return j.data?.access_token||j.data?.accessToken||null;
}
async function call(token, method, path, body){
  const r=await fetch(base+path,{method,headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:body?JSON.stringify(body):undefined});
  const t=await r.text();
  return {status:r.status, body:t};
}
const token=await login();
console.log('token?', !!token);
let r=await call(token,'GET',`/admin/supplier-products/${SP_ID}`);
let st=null; try{ st=JSON.parse(r.body).data?.status; }catch{}
console.log('current status =>', r.status, st);
process.exit(0);