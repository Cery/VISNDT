/* 821 Governed SupplierProduct Lifecycle — runtime verification.
   Supplier Submit → Admin Review/Approve/Reject/Publish/Unpublish + Publish Gate + Public Boundary. */
import { PrismaClient } from '@prisma/client';
const API='http://localhost:4000/api/v1'; const PW='demo123456';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const results=[]; const check=(name,pass,detail)=>{results.push({name,pass:!!pass,detail});console.log(`${pass?'PASS':'FAIL'}  ${name}${detail?'  | '+detail:''}`);};
const prisma=new PrismaClient();
const login=async(email)=>{const r=await fetch(API+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password:PW})});const j=await r.json().catch(()=>({}));return r.ok?{ok:true,token:j?.data?.accessToken}:{ok:false,status:r.status};};
const csrf=async()=>(await(await fetch(API+'/auth/csrf')).json().catch(()=>({})))?.data?.csrfToken||null;
const req=async(token,method,path,body)=>{const c=await csrf();const h={Authorization:token?'Bearer '+token:'','X-CSRF-Token':c,Cookie:'csrf_token='+c};if(body!==undefined)h['Content-Type']='application/json';const r=await fetch(API+path,{method,headers:h,body:body!==undefined?JSON.stringify(body):undefined});let j=null;try{j=await r.json();}catch{}return{status:r.status,body:j};};
const ORG_B='926d5a96-e1be-455c-8d58-8f4a79b6735d';
const ORG_A='697c99b2-1447-491a-a68a-566f51ca9181';
const TAG=`821-${Date.now()}`;

(async()=>{
  const admin=await login('demo.admin@visndt.local'); check('admin login',admin.ok); if(!admin.ok)process.exit(2);
  const sup=await login('demo.supplier.01@visndt.local'); check('supplier login',sup.ok); if(!sup.ok)process.exit(2);
  const c=await csrf(); const eh={Authorization:'Bearer '+admin.token,'X-CSRF-Token':c,Cookie:'csrf_token='+c,'Content-Type':'application/json'};

  let ppId=null;
  for(const ep of ['/platform-products','/products']){const r=await fetch(API+ep).catch(()=>null);if(r&&r.ok){const j=await r.json().catch(()=>({}));const arr=Array.isArray(j?.data?.data)?j.data.data:(Array.isArray(j?.data)?j.data:[]);if(arr.length&&arr[0]?.id){ppId=arr[0].id;break;}}}
  check('found platform product',!!ppId); if(!ppId)process.exit(2);
  const pp=await (await fetch(API+'/products/'+ppId)).json().catch(()=>({})); const ppName=pp?.data?.name; const ppSlug=pp?.data?.slug;
  check('platform product name/slug known',!!ppName, 'name='+ppName+' slug='+ppSlug);

  // === Supplier create + submit ===
  const mk=await req(sup.token,'POST','/supplier-products/my',{platformProductId:ppId,brand:'Brand821',series:'S',modelNumber:`R-${TAG}`,description:'821 realistic model with description',technicalDescription:'t',applicationInfo:'app'});
  const model=mk?.body?.data?.id; check('supplier create own (real) → 201',(mk.status===201||mk.status===200)&&!!model,'status='+mk.status);
  const sub=await req(sup.token,'POST',`/supplier-products/my/${model}/submit`);
  check('supplier submit own → DRAFT→SUBMITTED',sub.status===201||sub.status===200,'status='+sub.status+' body='+JSON.stringify(sub.body?.data?.status));
  const subSt=sub?.body?.data?.status;
  const resub=await req(sup.token,'POST',`/supplier-products/my/${model}/submit`);
  check('re-submit non-DRAFT → 400 (illegal transition)',resub.status===400||resub.status===409,'status='+resub.status);

  // cross-org submit blocked
  const other=await (await fetch(API+'/admin/supplier-products',{method:'POST',headers:eh,body:JSON.stringify({organizationId:ORG_A,platformProductId:ppId,brand:'OtherOrg',modelNumber:`O-${TAG}`})})).json().catch(()=>({}));
  const otherId=other?.data?.id; check('admin created orgA product for isolation',!!otherId);
  const crossSub=await req(sup.token,'POST',`/supplier-products/my/${otherId}/submit`);
  check('supplier cross-org submit → 404',crossSub.status===404,'status='+crossSub.status);

  // guest cannot submit
  const guest=await req(null,'POST',`/supplier-products/my/${model}/submit`);
  check('guest submit → 401',guest.status===401,'status='+guest.status);

  // === Admin review / approve ===
  const review=await req(admin.token,'POST',`/admin/supplier-products/${model}/review`);
  check('admin review → SUBMITTED→REVIEWING',(review.status===201||review.status===200)&&review?.body?.data?.status==='REVIEWING','status='+review.status);
  const approve=await req(admin.token,'POST',`/admin/supplier-products/${model}/approve`);
  check('admin approve → REVIEWING→APPROVED',(approve.status===201||approve.status===200)&&approve?.body?.data?.status==='APPROVED','status='+approve.status);

  // === Publish gate: real model with description passes ===
  const pub=await req(admin.token,'POST',`/admin/supplier-products/${model}/publish`);
  check('admin publish real model → PUBLISHED',(pub.status===201||pub.status===200)&&pub?.body?.data?.status==='PUBLISHED','status='+pub.status);

  // === Publish gate: placeholder rejected ===
  // A placeholder legibly reuses the platform-derived brand + slug modelNumber.
  // Pre-clear any leftover slug-named placeholder row from a prior run so the
  // unique (orgId+platformProductId+modelNumber) constraint does not collide.
  const phModel=`${ppSlug??'platform'}`;
  await prisma.supplierProduct.deleteMany({where:{organizationId:ORG_B,platformProductId:ppId,modelNumber:phModel}});
  const ph=await (await fetch(API+'/admin/supplier-products',{method:'POST',headers:eh,body:JSON.stringify({organizationId:ORG_B,platformProductId:ppId,brand:ppName,modelNumber:phModel,description:'placeholder desc'})})).json().catch(()=>({}));
  const phId=ph?.data?.id; check('admin created placeholder-draft',!!phId,'msg='+JSON.stringify(ph?.message));
  await req(admin.token,'POST',`/admin/supplier-products/${phId}/submit`);
  await req(admin.token,'POST',`/admin/supplier-products/${phId}/review`);
  await req(admin.token,'POST',`/admin/supplier-products/${phId}/approve`);
  const phPub=await req(admin.token,'POST',`/admin/supplier-products/${phId}/publish`);
  check('publish PLACEHOLDER (platform brand/modelNumber) → rejected(400)',phPub.status===400,'status='+phPub.status+' msg='+JSON.stringify(phPub.body?.message));

  // === Publish gate: real model with EMPTY description rejected ===
  const nd=await (await fetch(API+'/admin/supplier-products',{method:'POST',headers:eh,body:JSON.stringify({organizationId:ORG_B,platformProductId:ppId,brand:'Brand821Real',modelNumber:`ND-${TAG}`})})).json().catch(()=>({}));
  const ndId=nd?.data?.id; check('admin created real-but-no-description draft',!!ndId);
  await req(admin.token,'POST',`/admin/supplier-products/${ndId}/submit`);
  await req(admin.token,'POST',`/admin/supplier-products/${ndId}/review`);
  await req(admin.token,'POST',`/admin/supplier-products/${ndId}/approve`);
  const ndPub=await req(admin.token,'POST',`/admin/supplier-products/${ndId}/publish`);
  check('publish real model w/o description → rejected(400)',ndPub.status===400,'status='+ndPub.status);

  // === Reject path ===
  const rj=await (await fetch(API+'/admin/supplier-products',{method:'POST',headers:eh,body:JSON.stringify({organizationId:ORG_B,platformProductId:ppId,brand:'Brand821RJ',modelNumber:`RJ-${TAG}`,description:'reject path'})})).json().catch(()=>({}));
  const rjId=rj?.data?.id;
  await req(admin.token,'POST',`/admin/supplier-products/${rjId}/submit`);
  await req(admin.token,'POST',`/admin/supplier-products/${rjId}/review`);
  const rjNoNote=await req(admin.token,'POST',`/admin/supplier-products/${rjId}/reject`,{});
  check('reject without note → 400',rjNoNote.status===400,'status='+rjNoNote.status);
  const rjOk=await req(admin.token,'POST',`/admin/supplier-products/${rjId}/reject`,{reviewedNote:'missing required evidence'});
  check('reject with note → REJECTED',(rjOk.status===201||rjOk.status===200)&&rjOk?.body?.data?.status==='REJECTED','status='+rjOk.status);

  // === Unpublish ===
  const unp=await req(admin.token,'POST',`/admin/supplier-products/${model}/unpublish`);
  check('admin unpublish → PUBLISHED→APPROVED',(unp.status===201||unp.status===200)&&unp?.body?.data?.status==='APPROVED','status='+unp.status);

  // === Supplier cannot publish (no self-service publish route) ===
  const supPub=await req(sup.token,'POST',`/supplier-products/my/${model}/publish`);
  check('supplier publish attempt → 404 (no self-service publish)',supPub.status===404,'status='+supPub.status);

  // === Public boundary: only PUBLISHED visible in public search ===
  // publish a model fully then confirm it appears; SUBMITTED/etc must NOT appear.
  const pub2=await req(admin.token,'POST',`/admin/supplier-products/${model}/publish`);
  check('re-publish model for public-boundary check',(pub2.status===201||pub2.status===200)&&pub2?.body?.data?.status==='PUBLISHED','status='+pub2.status);
  await sleep(500);
  let searchAll=await (await fetch(API+'/search/supplier-models?pageSize=100')).json().catch(()=>({}));
  // Resilience: a single transient failure of the public index must not fail the
  // boundary assertion — retry once before declaring the result.
  // /search/supplier-models returns the raw DTO `{query,items,total,facets}` (no
  // ApiResponse wrapper) — read `items` at the top level.
  let arr=(i)=>Array.isArray(i?.items)?i.items:Array.isArray(i?.data?.items)?i.data.items:Array.isArray(i?.data)?i.data:Array.isArray(i?.data?.data)?i.data.data:[];
  if(arr(searchAll).length===0){ await sleep(800); searchAll=await (await fetch(API+'/search/supplier-models?pageSize=100')).json().catch(()=>({})); }
  const items=arr(searchAll);
  check('public search has result set',items.length>0,'n='+items.length+' raw='+JSON.stringify(searchAll?.data?.message??''));
  const visible=Array.isArray(items)&&items.some(x=>String(x.supplierProduct?.modelNumber)===`R-${TAG}`||String(x.supplierProduct?.id)===model);
  check('PUBLISHED real model visible in public search',visible===true);
  const leakedRJ=Array.isArray(items)&&items.some(x=>String(x.supplierProduct?.modelNumber)===`RJ-${TAG}`||String(x.supplierProduct?.id)===rjId);
  check('REJECTED model NOT visible in public search',!leakedRJ);
  const leakedPh=Array.isArray(items)&&items.some(x=>String(x.supplierProduct?.id)===phId||String(x.id)===phId);
  check('APPROVED(placeholder, unpublished) model NOT visible in public search',!leakedPh);

  // DB consistency
  const dbRejected=await prisma.supplierProduct.findUnique({where:{id:rjId},select:{status:true}});
  check('DB confirms REJECTED state persisted',dbRejected?.status==='REJECTED');

  // cleanup
  for(const id of [model,otherId,phId,ndId,rjId]){await req(admin.token,'DELETE',`/admin/supplier-products/${id}`).catch(()=>{});}
  const remain=await prisma.supplierProduct.count({where:{modelNumber:{in:[`R-${TAG}`,`O-${TAG}`,`ND-${TAG}`,`RJ-${TAG}`]}}});
  check('cleanup removed 821 test rows (except maybe placeholder slug-named)',remain===0,'remaining='+remain);

  await prisma.$disconnect();
  const passed=results.filter(r=>r.pass).length;
  console.log('\n=== 821 VERIFY SUMMARY ==='); console.log(JSON.stringify({passCount:passed,total:results.length,ALL_PASS:passed===results.length,items:results},null,1));
  process.exit(0);
})().catch(e=>{console.error('FATAL '+e.message);prisma.$disconnect().finally(()=>process.exit(2));});