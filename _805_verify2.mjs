const API = 'http://localhost:4000/api/v1';
const PW = 'demo123456';
const SENS = ['password', 'passwordhash', 'refreshtoken', 'accesstoken', 'secret', 'privatekey', 'apikey', 'session'];
function scan(o,p,f){if(!o||typeof o!=='object')return;if(Array.isArray(o)){o.forEach((x,i)=>scan(x,p+'['+i+']',f));return;}for(const k of Object.keys(o)){const v=o[k],lk=k.toLowerCase();if(SENS.some(s=>lk.includes(s)))f.push(p+'.'+k);if(v&&typeof v==='object')scan(v,p?p+'.'+k:k,f);}}
const leak=(o)=>{const f=[];scan(o,'',f);return f;};
async function login(email){const r=await fetch(API+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json',},body:JSON.stringify({email,password:PW})});const j=await r.json().catch(()=>({}));return r.ok&&j?.data?.accessToken?j.data.accessToken:null;}
const get=async(p,t)=>{const r=await fetch(API+p,{headers:t?{Authorization:'Bearer '+t}:{}});return{status:r.status,body:await r.json().catch(()=>({}))};};

(async()=>{
  // Supplier org scope isolation
  const sup = await login('demo.supplier.01@visndt.local');
  if(!sup){console.log('SUPPLIER LOGIN FAIL');process.exit(1);}
  const my = await get('/demands/my?page=1&pageSize=50', sup);
  const items = my.body?.data?.data ?? [];
  const orgIds = new Set(items.map(d=>d.organizationId));
  const leaks = leak(my.body);
  const buyerFirstOrg = '8b0e7521-b98b-42ab-8005-4f32f0063551';
  console.log('SUPPLIER /demands/my status=' + my.status + ' items=' + items.length + ' distinctOrgs=' + [...orgIds].join(',') + ' containsBuyerOrg=' + orgIds.has(buyerFirstOrg) + ' sensitive=' + leaks.length);
  console.log('ORG_SCOPE_PASS=' + (my.status===200 && leaks.length===0 && !orgIds.has(buyerFirstOrg)));

  // Admin
  const adm = await login('demo.admin@visndt.local');
  console.log('ADMIN login=' + (adm?'OK':'FAIL'));
  if(adm){
    const usr = await get('/users?page=1&pageSize=20', adm);
    const l2 = leak(usr.body);
    console.log('ADMIN /users status=' + usr.status + ' users=' + (usr.body?.data?.data?.length??0) + ' sensitive=' + l2.length);
    const stats = await get('/admin/stats?', adm);
    console.log('ADMIN /admin/stats status=' + stats.status);
  }
})().catch(e=>{console.error('ERR '+e.message);process.exit(1);});