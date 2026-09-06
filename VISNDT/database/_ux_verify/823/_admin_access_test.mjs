const base='http://localhost:4000/api/v1';
async function login(){
  const r=await fetch(base+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'demo.admin@visndt.local',password:'demo123456'})});
  const j=await r.json();
  return j.data?.access_token||j.data?.accessToken||null;
}
const token=await login();
console.log('token?', !!token);
if(token){
  for (const path of ['/admin/supplier-products?page=1&pageSize=5','/admin/supplier-products/e037dea8-d486-4732-b495-c855aa668c2c']){
    const r=await fetch(base+path,{headers:{Authorization:'Bearer '+token}});
    const t=await r.text();
    console.log(path.slice(0,40),'=>',r.status, t.slice(0,160));
  }
}
process.exit(0);