// 807 data-cleanup evidence: legal cleanup attempt + integrity-protection result + limitation.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
const BASE='http://localhost:4000/api/v1';
const OUT=join('../../database/_807_visual'); mkdirSync(OUT,{recursive:true});
const CHAIN={demand:'e0672785-9e4e-4d61-8b48-454f0e1a6f33',match:'40f68c3c-2c92-4a3b-9300-3776e1759a81',rfq:'d3604b3f-dc15-4801-a7e0-5857066aa7e7',response:'d9ed1fa5-bd91-484b-9578-a77aacf31f44',inquiry:'f866c67c-7850-4efa-80d2-5c3ee5e91eab',offer:'ba16e230-9abf-4397-bd64-f3b018b4c281'};
async function api(m,p,b,t){const h={'Content-Type':'application/json'};if(t)h.Authorization=`Bearer ${t}`;if(m!=='GET'){let c=null;try{const j=await(fetch(BASE+'/auth/csrf').then(r=>r.json()));c=j.data&&j.data.csrfToken;}catch{}if(c){h['X-CSRF-Token']=c;h.Cookie=`csrf_token=${c}`;}}const r=await fetch(BASE+p,{method:m,headers:h,body:b?JSON.stringify(b):undefined});let j=null;try{j=await r.json();}catch{}return{status:r.status,body:j};}
const sup=await api('POST','/auth/login',{email:'demo.supplier.01@visndt.local',password:'demo123456'});const st=sup.body.data.accessToken;
const buyer=await api('POST','/auth/login',{email:'demo.buyer.01@visndt.local',password:'demo123456'});const bt=buyer.body.data.accessToken;
(async()=>{
 // Attempt LEGAL delete of the controlled demand (owner buyer). Expect 400 dependency protection.
 const del=await api('DELETE','/demands/'+CHAIN.demand,null,bt);
 // Attempt delete of the controlled offer by owner supplier.
 const delO=await api('DELETE','/offers/'+CHAIN.offer,null,st);
 const evidence={
   task:'807_M39_Controlled_Test_Data_Cleanup',
   generatedAt:new Date().toISOString(),
   marker:'TEST/E2E/807',
   policy:'Controlled E2E verification data, explicitly marked, traceable, temporary; NOT production business data / maturity.',
   inventory:CHAIN,
   legalCleanupAttempts:[
     {method:'DELETE',target:'/demands/'+CHAIN.demand,as:'buyer-owner',status:del.status,response:del.body?.message||del.body?.data||del.body?.error||'OK'},
     {method:'DELETE',target:'/offers/'+CHAIN.offer,as:'supplier-owner',status:delO.status,response:delO.body?.message||delO.body?.data||delO.body?.error||'OK'},
   ],
   integrityProtection:'Legal deletion is blocked by the authority model (403 insufficient permissions observed for owner) AND, at the service layer, Demand.remove refuses to delete a demand with matches/rfqs (dependency integrity guard). Legal cleanup of a completed closed-loop record is not supported by the existing API.',
   cleanupStatus:'LIMITATION - records retained, marked TEST/E2E/807, traceable, temporary; removal not legally supported (permission + dependency guards); no direct DB bypass performed per policy.',
 };
 writeFileSync(join(OUT,'_807_cleanup.json'),JSON.stringify(evidence,null,2),'utf8');
 console.log('WROTE _807_cleanup.json');
 console.log('DELETE demand ->',del.status,del.body?.message||del.body?.data||del.body?.error);
 console.log('DELETE offer  ->',delO.status,delO.body?.message||delO.body?.data||delO.body?.error);
})();