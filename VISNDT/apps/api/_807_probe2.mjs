const BASE='http://localhost:4000/api/v1';
async function api(m,p,b,t){const h={'Content-Type':'application/json'};if(t)h.Authorization=`Bearer ${t}`;if(p!=='GET'){const {body:c}=await fetch(BASE+'/auth/csrf');h['X-CSRF-Token']=c.data.csrfToken;h.Cookie=`csrf_token=${c.data.csrfToken}`;}const r=await fetch(BASE+p,{method:m,headers:h,body:b?JSON.stringify(b):undefined});let j=null;try{j=await r.json();}catch{}return{status:r.status,body:j};}
(async()=>{
 const l=await api('POST','/auth/login',{email:'admin@visndt.com',password:'admin123456'});
 const t=l.body.data.accessToken;
 const a=await api('GET','/offers?status=ACTIVE&pageSize=200',null,t);
 console.log('offers ACTIVE',a.status,'data.data.length',Array.isArray(a.body?.data?.data)?a.body.data.data.length:a.body?.data);
 const arr=a.body?.data?.data||a.body?.data||[];
 console.log(JSON.stringify(arr.map(o=>({id:o.id,productId:o.productId,status:o.status,org:o.organizationId})),null,2));
})();