const BASE='http://localhost:4000/api/v1';
let CSRF=null;
async function api(m,p,b,t){const h={'Content-Type':'application/json'};if(t)h.Authorization=`Bearer ${t}`;if(p!=='GET'&&CSRF){h['X-CSRF-Token']=CSRF;h.Cookie=`csrf_token=${CSRF}`;}const r=await fetch(BASE+p,{method:m,headers:h,body:b?JSON.stringify(b):undefined});let j=null;try{j=await r.json();}catch{}return{status:r.status,body:j};}
(async()=>{
  const {body:c}=await api('GET','/auth/csrf'); CSRF=c?.data?.csrfToken;
  const l=await api('POST','/auth/login',{email:'demo.buyer.01@visndt.local',password:'demo123456'});
  const t=l.body?.data?.accessToken;
  console.log('login',l.status);
  const wf=await api('GET','/workflow-events?pageSize=5');
  console.log('wf status',wf.status,'body.data.type',Array.isArray(wf.body?.data)?'ARRAY':'OBJ','keys',Array.isArray(wf.body?.data)?wf.body.data.length:(wf.body?.data?Object.keys(wf.body.data):'null'));
  console.log('wf sample',JSON.stringify(wf.body?.data?.slice?.(0,2)||wf.body?.data?.data?.slice?.(0,2)||wf.body?.data).slice(0,400));
  const mine=await api('GET','/rfqs/mine',null,t);
  console.log('rfq/mine status',mine.status,'data isArray',Array.isArray(mine.body?.data));
  const inq=await api('POST','/inquiries',{productId:'38a711ff-9352-40ea-978b-90ecd566b826',offerId:'ba16e230-9abf-4397-bd64-f3b018b4c281',organizationId:'926d5a96-e1be-455c-8d58-8f4a79b6735d',name:'张检测',email:'demo.buyer.01@visndt.local',message:'probe'});
  console.log('inquiry status',inq.status,JSON.stringify(inq.body?.data).slice(0,150));
})();