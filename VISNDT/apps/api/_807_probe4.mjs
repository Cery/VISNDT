const BASE='http://localhost:4000/api/v1';
async function api(m,p,b,t){const h={'Content-Type':'application/json'};if(t)h.Authorization=`Bearer ${t}`;if(p!=='GET'){let csr=null;try{const{c}=await(fetch(BASE+'/auth/csrf').then(r=>r.json()));csr=c&&c.csrfToken;}catch{}if(csr){h['X-CSRF-Token']=csr;h.Cookie=`csrf_token=${csr}`;}}const r=await fetch(BASE+p,{method:m,headers:h,body:b?JSON.stringify(b):undefined});let j=null;try{j=await r.json();}catch{}return{status:r.status,body:j};}
(async()=>{
 const admin=await api('POST','/auth/login',{email:'admin@visndt.com',password:'admin123456'});const at=admin.body.data.accessToken;
 const sup=await api('POST','/auth/login',{email:'demo.supplier.01@visndt.local',password:'demo123456'});const st=sup.body.data.accessToken;
 const buyer=await api('POST','/auth/login',{email:'demo.buyer.01@visndt.local',password:'demo123456'});const bt=buyer.body.data.accessToken;
 // 1. offer by id
 const of=await api('GET','/offers/ba16e230-9abf-4397-bd64-f3b018b4c281',null,st);
 console.log('offer by id (supplier):',of.status,JSON.stringify({status:of.body?.data?.status,productId:of.body?.data?.productId,org:of.body?.data?.organizationId}));
 const ofa=await api('GET','/offers/ba16e230-9abf-4397-bd64-f3b018b4c281',null,at);
 console.log('offer by id (admin):',ofa.status,JSON.stringify({status:ofa.body?.data?.status,productId:ofa.body?.data?.productId,org:ofa.body?.data?.organizationId}));
 // 2. supplier offers without status filter
 const o1=await api('GET','/offers?pageSize=200',null,st);
 console.log('supplier all offers status',o1.status,'shape',Array.isArray(o1.body?.data?.data)?('array'+o1.body.data.data.length):(Array.isArray(o1.body?.data)?('directarray'+o1.body.data.length):Object.keys(o1.body?.data||{})));
 const o1a=o1.body?.data?.data||o1.body?.data;
 if(Array.isArray(o1a))console.log('supplier offers:',JSON.stringify(o1a.map(o=>({id:o.id,status:o.status,productId:o.productId}))));
 // 3. workflow events valid pageSize
 for(const ps of [20,50,100]){
  const w=await api('GET','/workflow-events?pageSize='+ps,null,bt);
  const arr=w.body?.data?.data||[];
  console.log('WF pageSize',ps,'status',w.status,'n',Array.isArray(arr)?arr.length:0);
  if(Array.isArray(arr)&&arr.length){console.log('  sample:',JSON.stringify(arr.slice(0,2).map(e=>({t:e.entityType,act:e.action,id:e.entityId}))));break;}
 }
})();