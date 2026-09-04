const BASE='http://localhost:4000/api/v1';
async function api(m,p,b,t){const h={'Content-Type':'application/json'};if(t)h.Authorization=`Bearer ${t}`;if(p!=='GET'){let csr=null;try{const{c}=await(fetch(BASE+'/auth/csrf').then(r=>r.json()));csr=c&&c.csrfToken;}catch{}if(csr){h['X-CSRF-Token']=csr;h.Cookie=`csrf_token=${csr}`;}}const r=await fetch(BASE+p,{method:m,headers:h,body:b?JSON.stringify(b):undefined});let j=null;try{j=await r.json();}catch{}return{status:r.status,body:j};}
(async()=>{
 const buyer=await api('POST','/auth/login',{email:'demo.buyer.01@visndt.local',password:'demo123456'});
 const bt=buyer.body.data.accessToken;
 const sup=await api('POST','/auth/login',{email:'demo.supplier.01@visndt.local',password:'demo123456'});
 const st=sup.body.data.accessToken;
 // workflow events: full dump
 const wf=await api('GET','/workflow-events?pageSize=200',null,bt);
 const arr=wf.body?.data?.data||wf.body?.data||[];
 console.log('WF status',wf.status,'count',Array.isArray(arr)?arr.length:(wf.body?.data));
 if(Array.isArray(arr)&&arr.length){
   console.log('WF sample:',JSON.stringify(arr.slice(0,4).map(e=>({entityType:e.entityType,entityId:e.entityId,action:e.action,actor:e.operator?.name})),null,2));
   console.log('WF distinct entityTypes:',JSON.stringify([...new Set(arr.map(e=>e.entityType))]));
 }
 // supplier ACTIVE offer for the product
 const o=await api('GET','/offers?status=ACTIVE&pageSize=200',null,st);
 const oarr=o.body?.data?.data||o.body?.data||[];
 console.log('supplier offers ACTIVE',Array.isArray(oarr)?oarr.length:o.status);
 if(Array.isArray(oarr))console.log('supplier offer:',JSON.stringify(oarr.filter(x=>x.productId==='38a711ff-9352-40ea-978b-90ecd566b826').map(x=>({id:x.id,productId:x.productId,status:x.status}))));
 // buyer demand PF to see status
 const d=await api('GET','/demands/d6d8b4f7-a6de-420f-8ff1-1c2010584d6f',null,bt);
 console.log('demand status',d.status,JSON.stringify({status:d.body?.data?.status,id:d.body?.data?.id}));
})();