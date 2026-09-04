/** 811 follow-up — Home CategorySection freshness after admin delete,
 *  using pure client-side nav (no full reload).
 */
import { spawn } from 'node:child_process';
const CHROME='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT=9494; const PROFILE='C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-811h-'+Date.now();
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

  const name='811首页分类验证HH'+Date.now().toString().slice(-4);
  const slug='811hh'+Date.now();
  // A) create temp, then FULL-load home so CategorySection contains it
  const cr=await adminMut('POST','/product-categories',{name,slug,parentId:null});
  const tmpId=cr.body?.data?.id||cr.body?.id;
  await nav(WEB+'/',6000);
  await aev(`window.__sh=1;true`);
  for(let i=0;i<25;i++){if(await aev(`document.body.innerText.includes(${JSON.stringify(name)})`))break;await sleep(600);}
  const shownAfterCreateHome=!!(await aev(`document.body.innerText.includes(${JSON.stringify(name)})`));

  // B) admin deletes
  const del=await adminMut('DELETE','/product-categories/'+tmpId);
  const baseRequests=netLog.length;

  // C) pure client-side nav: home -> /products -> back home
  let a1=false,a2=false;
  for(const href of ['/products','/']){
    const m0=await aev(`window.__sh`);
    const r=await spaClick(href); if(!r.ok)break;
    await sleep(4500);
    const m1=await aev(`window.__sh`);
    await aev(`window.__sh=2;true`);
    if(href==='/products' && m1===1)a1=true;
    if(href==='/' && m1===2)a2=true;
  }
  for(let i=0;i<25;i++){if(await aev(`document.body.innerText.includes('工业检测')||document.body.innerText.includes('推荐产品')`))break;await sleep(500);}
  await sleep(1500);
  const shownAfterSpaBackHome=!!(await aev(`document.body.innerText.includes(${JSON.stringify(name)})`));
  const navRefetched=netLog.length>baseRequests;

  console.log(JSON.stringify({
    adminCreate:{status:cr.status,tmpId},
    shownAfterCreateHome,
    adminDelete:{status:del.status},
    pureClientSideNav:{home_products:a1,products_home:a2},
    categoriesGets:{baseRequests,after:netLog.length,newDuringNav:netLog.length-baseRequests,list:netLog.slice(baseRequests)},
    result:{deletedStillOnHomeAfterSpaNav:shownAfterSpaBackHome,homeRefetchedOnMount:navRefetched},
  },null,2));
  try{ws.close();}catch{} try{chrome.kill();}catch{}
  process.exit(0);
})().catch(async(e)=>{console.error('ERR '+e.message);try{ws?.close();}catch{}try{chrome.kill();}catch{}process.exit(2);});