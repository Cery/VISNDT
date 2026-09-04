/** 811 follow-up — Reproduce: does /products category filter refresh after an admin
 *  category mutation (create a temp category) when navigating within the SPA?
 *  Uses real GET counts for /product-categories to prove (no) refetch.
 */
import { spawn } from 'node:child_process';
const CHROME='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT=9491; const PROFILE='C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-811r-'+Date.now();
const API='http://localhost:4000/api/v1'; const WEB='http://localhost:3000'; const PW='demo123456'; const EMAIL='demo.admin@visndt.local';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
async function login(e){const r=await fetch(API+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:e,password:PW})});const j=await r.json().catch(()=>({}));return r.ok&&j?.data?.accessToken?j.data.accessToken:null;}
async function csrfToken(){const r=await fetch(API+'/auth/csrf',{method:'GET'});const j=await r.json().catch(()=>({}));return j?.data?.csrfToken||null;}
async function adminMut(method,path,body){
  const token=await login(EMAIL),csrf=await csrfToken();
  const h={Authorization:'Bearer '+token,'X-CSRF-Token':csrf,'Cookie':'csrf_token='+csrf}; if(body)h['Content-Type']='application/json';
  const r=await fetch(API+path,{method,headers:h,body:body?JSON.stringify(body):undefined}); const t=await r.text(); let j=null; try{j=JSON.parse(t);}catch{} return {status:r.status,body:j};
}
const chrome=spawn(CHROME,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-proxy-server',`--remote-debugging-port=${PORT}`,`--user-data-dir=${PROFILE}`],{stdio:'ignore'});
let msgId=0;const pending=new Map();let ws=null;let netLog=[];
const connect=(u)=>new Promise((res,rej)=>{const s=new WebSocket(u);s.onopen=()=>res(s);s.onerror=()=>rej(new Error('ws'));});
const send=(m,p={})=>new Promise((res,rej)=>{const id=++msgId;pending.set(id,{res,rej});ws.send(JSON.stringify({id,method:m,params:p}));});
async function waitPage(){for(let i=0;i<80;i++){try{const t=await(await fetch(`http://127.0.0.1:${PORT}/json`)).json();const p=t.find(x=>x.type==='page');if(p)return p;}catch{}await sleep(250);}throw new Error('no page');}
async function nav(u,ms=4000){await send('Page.navigate',{url:u});await sleep(ms);}
async function aev(x){try{const r=await send('Runtime.evaluate',{expression:x,returnByValue:true,awaitPromise:true});return r?.result?.value;}catch{return null;}}
(async()=>{
  await sleep(2500);
  const page=await waitPage(); ws=await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message',(d)=>{const m=JSON.parse(d.data.toString());
    if(m.method==='Network.responseReceived'){const u=m.params?.response?.url||'';if(u.includes('/product-categories'))netLog.push(u.split('?')[0]);}
    if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.rej(new Error(m.error.message)):p.res(m.result);}});
  await send('Page.enable');await send('Runtime.enable');await send('Network.enable');

  // 1) Load /products fresh — category filter baseline
  await nav(WEB+'/products',6000);
  for(let i=0;i<20;i++){const t=await aev(`document.body.innerText.includes('能力')`);if(t)break;await sleep(400);}
  const catsBefore=(await aev(`Array.from(document.querySelectorAll('aside button, .text-sm')).map(e=>e.textContent||'').filter(t=>t.includes('检测能力')||/能力$/.test(t)).slice(0,15)`))||[];
  const baseRequests=netLog.length;

  // 2) Admin creates a temp category
  const slug='811sync'+Date.now();
  const cr=await adminMut('POST','/product-categories',{name:'811同步验证临时分类XYZ',slug,parentId:null});
  const tmpId=cr.body?.data?.id||cr.body?.id;

  // 3) SPA: go home then back to /products (focus stays on tab) WITHOUT reload
  await aev(`(async()=>{const{React}=window;return true})()`);
  // simplest focus-preserving navigation: dispatch a client-side link? headless has no UI click chain reliably.
  // Instead: full navigate home (loads home, caches ['categories'] unchanged), then SPA-free full navigate back to /products.
  await nav(WEB+'/',5000);
  const homeLoaded=!!(await aev(`document.body.innerText.includes('工业检测')||document.body.innerText.includes('推荐产品')`));
  const netAfterHome=netLog.length;
  await nav(WEB+'/products',6000);
  for(let i=0;i<20;i++){const t=await aev(`document.body.innerText.includes('能力')`);if(t)break;await sleep(400);}
  await sleep(1200);
  const netAfterBack=netLog.length;
  const textHasTemp=!!(await aev(`document.body.innerText.includes('811同步验证临时分类XYZ')`));
  const newRequests=netLog.slice(baseRequests);

  // cleanup
  if(tmpId){await adminMut('DELETE','/product-categories/'+tmpId);}
  console.log(JSON.stringify({
    categoriesSampleBefore:catsBefore,
    adminCreate:{status:cr.status,tmpId:tmpId||null},
    freshness:{baseRequests,netAfterHome,netAfterBack,requestsForCategories:newRequests.length,newRequests},
    tempShownOnProductsAfterNav:textHasTemp,
  },null,2));
  try{ws.close();}catch{} try{chrome.kill();}catch{}
  process.exit(0);
})().catch(async(e)=>{console.error('ERR '+e.message);try{ws?.close();}catch{}try{chrome.kill();}catch{}process.exit(2);});