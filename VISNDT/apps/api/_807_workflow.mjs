// 807 workflow-events + notification evidence drawn from REAL runtime for the controlled chain.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
const BASE='http://localhost:4000/api/v1';
const OUT=join('../../database/_807_visual'); mkdirSync(OUT,{recursive:true});
const CHAIN={demand:'e0672785-9e4e-4d61-8b48-454f0e1a6f33',match:'40f68c3c-2c92-4a3b-9300-3776e1759a81',rfq:'d3604b3f-dc15-4801-a7e0-5857066aa7e7',response:'d9ed1fa5-bd91-484b-9578-a77aacf31f44',inquiry:'f866c67c-7850-4efa-80d2-5c3ee5e91eab',offer:'ba16e230-9abf-4397-bd64-f3b018b4c281'};
async function api(m,p,b,t){const h={'Content-Type':'application/json'};if(t)h.Authorization=`Bearer ${t}`;if(m!=='GET'){let c=null;try{const j=await(fetch(BASE+'/auth/csrf').then(r=>r.json()));c=j.data&&j.data.csrfToken;}catch{}if(c){h['X-CSRF-Token']=c;h.Cookie=`csrf_token=${c}`;}}const r=await fetch(BASE+p,{method:m,headers:h,body:b?JSON.stringify(b):undefined});let j=null;try{j=await r.json();}catch{}return{status:r.status,body:j};}
const l=await api('POST','/auth/login',{email:'demo.buyer.01@visndt.local',password:'demo123456'});const bt=l.body.data.accessToken;
const bu=await api('POST','/auth/login',{email:'demo.buyer.01@visndt.local',password:'demo123456'});const bb=bu.body.data.user;
const su=await api('POST','/auth/login',{email:'demo.supplier.01@visndt.local',password:'demo123456'});const st=su.body.data.accessToken;const sb=su.body.data.user;
(async()=>{
 const wf=(await api('GET','/workflow-events?pageSize=100',null,bt)).body?.data?.data||[];
 const pick=(id)=>wf.filter(e=>e.entityId===id).map(e=>({entityType:e.entityType,action:e.action,actor:e.operator?.name||null,organizationId:e.metadata?.organizationId||sb.organizationId,createdAt:e.createdAt}));
 const events={demand:pick(CHAIN.demand),match:pick(CHAIN.match),rfq:pick(CHAIN.rfq),response:pick(CHAIN.response)};
 const bN=(await api('GET','/notifications?pageSize=50',null,bt)).body?.data?.data||[];
 const sN=(await api('GET','/notifications?pageSize=50',null,st)).body?.data?.data||[];
 const notif={buyer:{orgId:bb.organizationId,count:bN.length,related:bN.filter(n=>[CHAIN.rfq,CHAIN.response,CHAIN.inquiry].includes(n.entityId)||n.referenceId===CHAIN.inquiry || n.productId===CHAIN.match).map(n=>({title:n.title,refType:n.referenceType,status:n.status}))},supplier:{orgId:sb.organizationId,count:sN.length,related:sN.filter(n=>[CHAIN.rfq,CHAIN.response,CHAIN.inquiry].includes(n.entityId)||n.referenceId===CHAIN.inquiry).map(n=>({title:n.title,refType:n.referenceType,status:n.status}))}};
 const evidence={task:'807_M39_Workflow_Notification_Evidence',generatedAt:new Date().toISOString(),chain:CHAIN,events,notifications:notif};
 writeFileSync(join(OUT,'_807_workflow.json'),JSON.stringify(evidence,null,2),'utf8');
 console.log('WROTE _807_workflow.json');
 console.log('events counts',{demand:events.demand.length,match:events.match.length,rfq:events.rfq.length,response:events.response.length});
 console.log('buyer notif',notif.buyer.count,'supplier notif',notif.supplier.count);
})();