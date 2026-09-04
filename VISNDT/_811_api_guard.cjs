const API = 'http://localhost:4000/api/v1';
const PW = 'demo123456';
const EMAIL = 'demo.admin@visndt.local';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const slugSet = (list) => new Set((list||[]).map(c=>c.slug));
function getCookie(setCookie, name){
  const arr = Array.isArray(setCookie) ? setCookie : (setCookie?[setCookie]:[]);
  for(const h of arr){ const m = h.match(new RegExp(name+'=([^;]+)')); if(m) return m[1]; }
  return null;
}

async function login(email){
  const r = await fetch(API+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password:PW})});
  const j = await r.json().catch(()=>({}));
  return r.ok && j?.data?.accessToken ? {token:j.data.accessToken, status:r.status} : {token:null,status:r.status};
}
async function api(method,path,token,body,csrfCookie,csrfToken){
  const h = token?{Authorization:'Bearer '+token}:{};
  const cookies = [];
  if(csrfCookie) cookies.push(csrfCookie);
  if(cookies.length) h['Cookie'] = cookies.join('; ');
  if(csrfToken) h['X-CSRF-Token'] = csrfToken;
  if(body) h['Content-Type']='application/json';
  const r = await fetch(API+path,{method,headers:h,body:body?JSON.stringify(body):undefined});
  const t = await r.text(); let j=null; try{j=JSON.parse(t);}catch{}
  return {status:r.status, body:j, raw:t.slice(0,300)};
}

(async()=>{
  const {token, status:ls} = await login(EMAIL);
  const out = { login:{status:ls}, cases:[] };
  // Acquire double-submit CSRF token + cookie
  const csrfResp = await fetch(API+'/auth/csrf',{method:'GET'});
  const csrfBody = await csrfResp.json().catch(()=>({}));
  const csrfToken = csrfBody?.data?.csrfToken || null;
  const csrfCookie = 'csrf_token='+(csrfToken||'');
  if(!token){ console.log(JSON.stringify({error:'login failed'})); await prisma.$disconnect(); process.exit(1); }
  const W = {token, csrfCookie, csrfToken}; // wrapper used by mutation calls

  const cats = await prisma.$queryRawUnsafe(`SELECT id, slug, name FROM "product_category" ORDER BY name;`);
  const bySlug = Object.fromEntries(cats.map(c=>[c.slug,c]));
  const prodCat = bySlug['3d-scanner'];
  const childCat = bySlug['flaw-detector'];

  const r1 = await api('DELETE','/product-categories/'+prodCat.id, token, null, W.csrfCookie, W.csrfToken);
  const msg1 = r1.body?.message || r1.body?.data?.message || r1.raw;
  out.cases.push({ case:'delete-blocked-by-products', expected:'400 / CATEGORY_HAS_PRODUCTS',
    actualStatus:r1.status, message: (typeof msg1==='string'?msg1:JSON.stringify(msg1)) });
  const db1 = await prisma.$queryRawUnsafe(`SELECT count(*)::int AS n FROM "product_category" WHERE id::text=$1`, prodCat.id);
  const pub1 = await api('GET','/product-categories?page=1&pageSize=100', null);
  const pubSlugs1 = slugSet(pub1.body?.data?.data);
  out.cases.push({ case:'blocked-products-persistence', expected:'category remains in DB + public',
    inDB: db1[0].n===1, publicVisible: pubSlugs1.has('3d-scanner'), publicStatus: pub1.status });

  const r2 = await api('DELETE','/product-categories/'+childCat.id, token, null, W.csrfCookie, W.csrfToken);
  const msg2 = r2.body?.message || r2.body?.data?.message || r2.raw;
  out.cases.push({ case:'delete-blocked-by-children', expected:'400 / CATEGORY_HAS_CHILDREN',
    actualStatus:r2.status, message:(typeof msg2==='string'?msg2:JSON.stringify(msg2)) });

  const slugTmp = '811-tmp-fresh-'+Date.now();
  const create = await api('POST','/product-categories', token, { name:'811 临时分类', slug: slugTmp, parentId:null }, W.csrfCookie, W.csrfToken);
  const created = create.body?.data || create.body;
  const tmpId = created?.id;
  if(!tmpId){ out.cases.push({case:'create-temp',expected:'created',actualStatus:create.status,message:JSON.stringify(create.body)}); }
  else {
    const pubCreated = await api('GET','/product-categories?page=1&pageSize=100', null);
    out.cases.push({ case:'create-temp', expected:'201 + visible public',
      actualStatus:create.status, publicVisible: slugSet(pubCreated.body?.data?.data).has(slugTmp), tmpId });
    const del = await api('DELETE','/product-categories/'+tmpId, token, null, W.csrfCookie, W.csrfToken);
    const dbDel = await prisma.$queryRawUnsafe(`SELECT count(*)::int AS n FROM "product_category" WHERE id::text=$1`, tmpId);
    const pubAfter = await api('GET','/product-categories?page=1&pageSize=100', null);
    out.cases.push({ case:'delete-temp-success', expected:'200 + removed from DB + public',
      actualStatus:del.status, inDB: dbDel[0].n===0, publicVisibleAfter: slugSet(pubAfter.body?.data?.data).has(slugTmp) });
  }

  await prisma.$disconnect();
  console.log(JSON.stringify(out, null, 2));
  process.exit(0);
})().catch(async e=>{ console.error('ERR '+e.message); try{await prisma.$disconnect();}catch{} process.exit(1); });