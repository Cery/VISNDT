/** 811 decisive — Do ANY public catalog pages refetch on a PURE client-side revisit
 *  (Next router cache restore, no full reload anywhere) after a delete?
 *  Probes home / and /products separately.
 */
import { spawn } from 'node:child_process';
const CHROME='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT=9495; const PROFILE='C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-811d2-'+Date.now();
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
async function freshHome(expectName){
  const found=await aev(`(()=>{var n,w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),s='';while(n=w.nextNode()){var p=n.parentElement;if(p&&(p.tagName==='SCRIPT'||p.tagName==='STYLE'||p.tagName==='NOSCRIPT'||/RSC|font|link|meta|template/.test(p.tagName)))continue;s+=n.textContent}return s.indexOf(${JSON.stringify(expectName)})>=0})()`);
  return !!found;
}
(async()=>{
  await sleep(2500);
  const page=await waitPage(); ws=await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message',(d)=>{const m=JSON.parse(d.data.toString());
    if(m.method==='Network.responseReceived'){const u=m.params?.response?.url||'';if(u.includes('/product-categories'))netLog.push(u.split('?')[0]);}
    if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.rej(new Error(m.error.message)):p.res(m.result);}});
  await send('Page.enable');await send('Runtime.enable');await send('Network.enable');

  const name='811关键验证ZZ'+Date.now().toString().slice(-4);
  const slug='811dd2'+Date.now();
  const cr=await adminMut('POST','/product-categories',{name,slug,parentId:null});
  const tmpId=cr.body?.data?.id||cr.body?.id;

  // Initial: full-load home once; home now contains temp in CategorySection
  await nav(WEB+'/',6000); await aev(`window.__m=1;true`);
  for(let i=0;i<25;i++){if(await freshHome(name))break;await sleep(600);}
  const homeShowsOnInitial=await freshHome(name);

  // Visit /products once via client nav (populates products route + owns ['categories'])
  await spaClick('/products'); await sleep(4500);
  for(let i=0;i<20;i++){if(await aev(`document.body.innerText.includes('检测能力')`))break;await sleep(400);}
  const productsShows=await freshHome(name); // text check still works on products body

  // Admin deletes
  const del=await adminMut('DELETE','/product-categories/'+tmpId);
  const base=netLog.length;

  // Pure client-side A-B-A: /products -> home -> /products (all clicks, marker survives => no full reload)
  let a=true,b=true;
  for(const href of ['/','/products']){
    const m0=await aev(`window.__m`);
    await spaClick(href); await sleep(4500);
    const m1=await aev(`window.__m`);
    await aev(`window.__m=2;true`);
    if(href==='/' && m1!==1)a=false;
    if(href==='/products' && m1!==2)b=false;
  }
  const productsShowsAfter=await freshHome(name);
  const newDuring=netLog.length-base;

  // Now back to home via client nav, measure home revisit refetch
  await spaClick('/'); await sleep(4500);
  for(let i=0;i<25;i++){if(await aev(`document.body.innerText.includes('工业检测')||document.body.innerText.includes('推荐产品')`))break;await sleep(500);}
  await sleep(1200);
  const hasQcExposed=!!(await aev(`window.__visndtQC && window.__visndtQC.invalidateQueries`));
  const homeShowsAfter=await freshHome(name);
  const afterHome=netLog.length;
  // read the ['categories'] cache & observer state from the exposed QC
  const cacheState=await aev(`(()=>{try{var q=window.__visndtQC;var d=q.getQueryData(['categories']);var c=window.__visndtQC.getQueryCache().find({queryKey:['categories']});var list=(d&&d.data)||[];return {cachedHasTemp:list.some(x=>x.name===${JSON.stringify(name)}),tokencachesum:(d?JSON.stringify(d.data.map(x=>x.slug)).length:null),observers:c?c.getObserversCount():-1,isStale:c?c.state.isStale:null,isFetching:c?c.state.isFetching:null};}catch(e){return {err:e.message}}})()`);

  if(tmpId){await adminMut('DELETE','/product-categories/'+tmpId);} // safety
  console.log(JSON.stringify({
    tmpId, adminCreate:cr.status, adminDelete:del.status,
    homeShowsOnInitial, productsShowsAfterDeleteBaseline:productsShowsAfter,
    pureClientNav:{productsHome_homeProducts:a, home_Home:b},
    browserRestore:{newDuring, afterHome, total:netLog.length, list:netLog.slice(base)},
    result:{productsRefetchedOnPureRevisit:newDuring>0, homeRefetchedOnPureRevisit:afterHome>newDuring, productsStillDeletedShown:productsShowsAfter, homeStillDeletedShown:homeShowsAfter},
    qcExposed:hasQcExposed, cacheState,
  },null,2));
  try{ws.close();}catch{} try{chrome.kill();}catch{}
  process.exit(0);
})().catch(async(e)=>{console.error('ERR '+e.message);try{ws?.close();}catch{}try{chrome.kill();}catch{}process.exit(2);});