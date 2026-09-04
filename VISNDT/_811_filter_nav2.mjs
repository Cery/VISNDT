/** 811 follow-up (clean). Cache a deleted category, then do PURE client-side nav
 *  (no full reload) and check whether the deleted category still shows in the filter.
 */
import { spawn } from 'node:child_process';
const CHROME='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT=9493; const PROFILE='C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-811c-'+Date.now();
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
async function nav(u,ms=5000){await send('Page.navigate',{url:u});await sleep(ms);}
async function aev(x){try{const r=await send('Runtime.evaluate',{expression:x,returnByValue:true,awaitPromise:true});return r?.result?.value;}catch{return null;}}
async function spaClick(hrefPart){
  const c=await aev(`(()=>{const a=[...document.querySelectorAll('a')].find(x=>x.getAttribute('href')&&x.getAttribute('href')===${JSON.stringify(hrefPart)});if(!a)return null;const r=a.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);
  if(!c)return {ok:false};
  await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:c.x,y:c.y});
  await send('Input.dispatchMouseEvent',{type:'mousePressed',x:c.x,y:c.y,button:'left',clickCount:1});
  await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:c.x,y:c.y,button:'left',clickCount:1});
  return {ok:true};
}
(async()=>{
  await sleep(2500);
  const page=await waitPage(); ws=await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message',(d)=>{const m=JSON.parse(d.data.toString());
    if(m.method==='Network.responseReceived'){const u=m.params?.response?.url||'';if(u.includes('/product-categories'))netLog.push(u.split('?')[0]);}
    if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.rej(new Error(m.error.message)):p.res(m.result);}});
  await send('Page.enable');await send('Runtime.enable');await send('Network.enable');

  // set SPA marker (survives client nav, lost on full reload)
  await nav(WEB+'/products',6000);
  await aev(`window.__sspa=1;true`);

  // A) create temp then FULL-reload /products so cache contains it
  const slug='811dd'+Date.now();
  const cr=await adminMut('POST','/product-categories',{name:'811待删验证分类QQ',slug,parentId:null});
  const tmpId=cr.body?.data?.id||cr.body?.id;
  await nav(WEB+'/products',6000);
  await aev(`window.__sspa=2;true`);
  for(let i=0;i<20;i++){if(await aev(`document.body.innerText.includes('811待删验证分类QQ')`))break;await sleep(500);}
  const shownAfterCreateReload=!!(await aev(`document.body.innerText.includes('811待删验证分类QQ')`));
  const baseRequests=netLog.length;

  // B) admin DELETES temp (backend no longer has it)
  const del=await adminMut('DELETE','/product-categories/'+tmpId);

  // C) pure client-side nav away and back (no full reload)
  let awayOk=false,backOk=false;
  for(const href of ['/','/products']){
    const m=await aev(`window.__sspa`);
    const r=await spaClick(href); if(!r.ok){break;}
    await sleep(4000);
    const mAfter=await aev(`window.__sspa`);
    await aev(`window.__sspa=3;true`);
    if(href==='/' && mAfter===2) awayOk=true;
    if(href==='/products') backOk=(mAfter===3);
  }
  await sleep(1500);
  const shownAfterSpaBack=!!(await aev(`document.body.innerText.includes('811待删验证分类QQ')`));
  const finalRequests=netLog.length;

  console.log(JSON.stringify({
    adminCreate:{status:cr.status,tmpId},
    shownAfterCreateReload,
    adminDelete:{status:del.status},
    pureClientSideNav:{awayOk,backOk},
    categoriesGets:{baseRequests,newDuringSpaNav:netLog.length-baseRequests,allRequests:netLog.length,list:netLog.slice(baseRequests)},
    result:{deletedStillShownAfterSpaNav:shownAfterSpaBack, navRefetched:netLog.length>baseRequests},
  },null,2));
  try{ws.close();}catch{} try{chrome.kill();}catch{}
  process.exit(0);
})().catch(async(e)=>{console.error('ERR '+e.message);try{ws?.close();}catch{}try{chrome.kill();}catch{}process.exit(2);});