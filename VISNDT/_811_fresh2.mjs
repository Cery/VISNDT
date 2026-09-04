/** 811 Batch A — D1 freshness robust probe: temp category appears only AFTER window focus when stale. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const CHROME='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT=9484; const PROFILE='C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-811b-'+Date.now();
const API='http://localhost:4000/api/v1'; const WEB='http://localhost:3000'; const PW='demo123456'; const EMAIL='demo.admin@visndt.local';
const SHOT='f:\\Desktop\\VISNDT\\VISNDT\\database\\_811_visual';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
async function login(e){const r=await fetch(API+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:e,password:PW})});const j=await r.json().catch(()=>({}));return r.ok&&j?.data?.accessToken?j.data.accessToken:null;}
async function csrfToken(){const r=await fetch(API+'/auth/csrf',{method:'GET'});const j=await r.json().catch(()=>({}));return j?.data?.csrfToken||null;}
async function adminMut(method,path,body){
  const token=await login(EMAIL),csrf=await csrfToken();
  const h={Authorization:'Bearer '+token,'X-CSRF-Token':csrf,'Cookie':'csrf_token='+csrf}; if(body)h['Content-Type']='application/json';
  const r=await fetch(API+path,{method,headers:h,body:body?JSON.stringify(body):undefined}); const t=await r.text(); let j=null; try{j=JSON.parse(t);}catch{} return {status:r.status,body:j};
}
const chrome=spawn(CHROME,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-proxy-server',`--remote-debugging-port=${PORT}`,`--user-data-dir=${PROFILE}`],{stdio:'ignore'});
let msgId=0;const pending=new Map();let ws=null;let net=0;
const connect=(u)=>new Promise((res,rej)=>{const s=new WebSocket(u);s.onopen=()=>res(s);s.onerror=()=>rej(new Error('ws'));});
const send=(m,p={})=>new Promise((res,rej)=>{const id=++msgId;pending.set(id,{res,rej});ws.send(JSON.stringify({id,method:m,params:p}));});
async function waitPage(){for(let i=0;i<80;i++){try{const t=await(await fetch(`http://127.0.0.1:${PORT}/json`)).json();const p=t.find(x=>x.type==='page');if(p)return p;}catch{}await sleep(250);}throw new Error('no page');}
async function nav(u,ms=5000){try{await send('Page.navigate',{url:u});}catch{}await sleep(ms);}
async function aev(x){try{const r=await send('Runtime.evaluate',{expression:x,returnByValue:true,awaitPromise:true});return r?.result?.value;}catch{return null;}}
async function waitFor(fn,timeout=30000){const t0=Date.now();while(Date.now()-t0<timeout){const v=await fn();if(v)return v;await sleep(1000);}return null;}

(async()=>{
  const out={};
  await sleep(2500);
  const page=await waitPage(); ws=await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message',(d)=>{const m=JSON.parse(d.data.toString());if(m.method==='Network.responseReceived'&&m.params?.response?.url?.includes('/product-categories'))net++;if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.rej(new Error(m.error.message)):p.res(m.result);}});
  await send('Page.enable');await send('Runtime.enable');await send('Network.enable');

  // 1) load public /categories and wait until real content renders
  await nav(WEB+'/categories',6000);
  const ready=await waitFor(async()=>{const t=await aev(`document.body.innerText.trim().length`);return t&&t>200?t:null;},40000);
  out.pageReadyBodyLen=ready;
  const haveCat=await aev(`document.body.innerText.includes('内窥镜')||document.body.innerText.includes('工业检测')||document.body.innerText.includes('检测能力')`);
  out.publicCategoriesRendered=!!haveCat;
  const initialNet=net;

  // 2) admin creates throwaway temp category (mutation to public catalog)
  const slug='811focus'+Date.now();
  const cr=await adminMut('POST','/product-categories',{name:'811焦点验证临时分类',slug,parentId:null});
  const tmpId=cr.body?.data?.id||cr.body?.id;
  out.createTemp={status:cr.status,tmpId:tmpId||null,slug};

  // 3) confirm temp NOT yet present in stale page (no focus, page mounted)
  await sleep(2000);
  const beforeFocus=await aev(`document.body.innerText.includes('811焦点验证临时分类')`);

  // 4) wait until React Query staleTime (60s) is exceeded since last fetch
  out.staleWaitMs=65000; await sleep(65000);
  const netBeforeFocus=net;

  // 5) window regains focus
  await aev(`window.dispatchEvent(new Event('focus')); true`);
  const appeared=await waitFor(async()=>await aev(`document.body.innerText.includes('811焦点验证临时分类')`),15000);
  await sleep(1500);
  out.freshness={
    initialNet, netBeforeFocus, netAfter:net, requestFired:net>netBeforeFocus,
    tempShownBeforeFocus:!!beforeFocus, tempShownAfterFocus:!!appeared,
  };

  // 6) cleanup temp category
  if(tmpId){const dl=await adminMut('DELETE','/product-categories/'+tmpId);out.cleanup={status:dl.status};}
  fs.writeFileSync(`${SHOT}\\_811_freshness.json`,JSON.stringify(out,null,2));
  console.log(JSON.stringify(out,null,2));
  try{ws.close();}catch{} try{chrome.kill();}catch{}
  process.exit(0);
})().catch(async(e)=>{console.error('ERR '+e.message);try{ws?.close();}catch{}try{chrome.kill();}catch{}process.exit(2);});