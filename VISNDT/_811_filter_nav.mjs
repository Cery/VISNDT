/** 811 follow-up — Prove client-side SPA nav keeps the categories cache (no refetch),
 *  which is why the /products category filter shows a deleted category.
 */
import { spawn } from 'node:child_process';
const CHROME='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT=9492; const PROFILE='C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-811s-'+Date.now();
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
async function clickLink(hrefPart){
  // find an anchor whose href matches and is a Next Link, click its center
  const c=await aev(`(()=>{const a=[...document.querySelectorAll('a')].find(x=>x.getAttribute('href')&&x.getAttribute('href').includes(${JSON.stringify(hrefPart)}));if(!a)return null;const r=a.getBoundingClientRect();a.scrollIntoView({block:'center'});return {x:r.x+r.width/2,y:r.y+r.height/2,cx:r.x,cy:r.y};})()`);
  if(!c)return false;
  await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:c.x,y:c.y});
  await send('Input.dispatchMouseEvent',{type:'mousePressed',x:c.x,y:c.y,button:'left',clickCount:1});
  await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:c.x,y:c.y,button:'left',clickCount:1});
  return true;
}
(async()=>{
  await sleep(2500);
  const page=await waitPage(); ws=await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message',(d)=>{const m=JSON.parse(d.data.toString());
    if(m.method==='Network.responseReceived'){const u=m.params?.response?.url||'';if(u.includes('/product-categories'))netLog.push(u.split('?')[0]);}
    if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.rej(new Error(m.error.message)):p.res(m.result);}});
  await send('Page.enable');await send('Runtime.enable');await send('Network.enable');

  // 1) Full-load /products => cache ['categories'] with current list
  await nav(WEB+'/products',6000);
  for(let i=0;i<20;i++){const t=await aev(`document.body.innerText.includes('检测能力')`);if(t)break;await sleep(400);}
  const baseRequests=netLog.length;
  await sleep(1500);

  // 2) Admin creates temp category (appears in backend immediately)
  const slug='811nav'+Date.now();
  const cr=await adminMut('POST','/product-categories',{name:'811导航同步验证分类ABC',slug,parentId:null});
  const tmpId=cr.body?.data?.id||cr.body?.id;
  await sleep(800);

  // 3) Client-side nav: home -> products (keep focus, preserve cache)
  const wentHome=await clickLink(''); if(!wentHome){ } 
  await nav(WEB+'/',5000); // fallback full nav to HOME (this is fine, we measure the products-revisit below)
  for(let i=0;i<20;i++){const t=await aev(`document.body.innerText.includes('推荐产品')||document.body.innerText.includes('工业检测')`);if(t)break;await sleep(400);}
  // try client-side nav back to products via header nav link
  let clicked=await clickLink('/products');
  await sleep(5000);
  if(!clicked){
    // fall back: evaluate router.push not available; end
    await nav(WEB+'/products',5000);
  }
  await sleep(1200);
  const netAfterBack=netLog.length;
  const shown=!!(await aev(`document.body.innerText.includes('811导航同步验证分类ABC')`));
  if(tmpId){await adminMut('DELETE','/product-categories/'+tmpId);}
  console.log(JSON.stringify({
    clientSideNavPerformed:clicked,
    adminCreate:{status:cr.status,tmpId:tmpId||null},
    categoriesGets:{baseRequests,afterHome:netLog.length,afterBack:netLog.length,newDuringNav:netLog.length-baseRequests,list:netLog.slice(baseRequests)},
    navTriggeredRefetch:netLog.length>baseRequests,
    tempShownOnProductsAfterNav:shown,
  },null,2));
  try{ws.close();}catch{} try{chrome.kill();}catch{}
  process.exit(0);
})().catch(async(e)=>{console.error('ERR '+e.message);try{ws?.close();}catch{}try{chrome.kill();}catch{}process.exit(2);});