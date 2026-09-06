const base='http://localhost:4000/api/v1';
async function main(){
  const csrfRes=await fetch(base+'/auth/csrf');
  const setc=csrfRes.headers.get('set-cookie')||'';
  const csrf=(setc.match(/csrf_token=([^;]+)/)||[])[1];
  const lr=await fetch(base+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json',Cookie:'csrf_token='+csrf+'; '},body:JSON.stringify({email:'demo.admin@visndt.local',password:'demo123456'})});
  const j=await lr.json();
  const token=j.data?.access_token||j.data?.accessToken;
  const r=await fetch(base+'/admin/supplier-products?pageSize=200',{headers:{Authorization:'Bearer '+token}});
  const body=await r.json();
  const list=body.data?.data||body.data||[];
  console.log('total=',body.data?.total||list.length);
  for(const p of list){
    console.log([p.status,p.modelNumber,p.brand,(p.description||'').slice(0,30),p.id].join(' | '));
  }
  process.exit(0);
}
main();