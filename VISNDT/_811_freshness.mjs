/** 811 Batch A — D1 freshness (refetchOnWindowFocus) + mobile. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9483;
const PROFILE = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-811-' + Date.now();
const API = 'http://localhost:4000/api/v1'; const WEB = 'http://localhost:3000';
const PW = 'demo123456'; const EMAIL = 'demo.admin@visndt.local';
const SHOT = 'f:\\Desktop\\VISNDT\\VISNDT\\database\\_811_visual';
if (!fs.existsSync(SHOT)) fs.mkdirSync(SHOT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- Admin API helper (server-side, separate from browser context) ----
async function login(email){
  const r = await fetch(API+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password:PW})});
  const j = await r.json().catch(()=>({}));
  return r.ok && j?.data?.accessToken ? j.data.accessToken : null;
}
async function csrfToken(){ const r=await fetch(API+'/auth/csrf',{method:'GET'}); const j=await r.json().catch(()=>({})); return j?.data?.csrfToken||null; }
async function adminMutate(method,path,body){
  const token=await login(EMAIL); const csrf=await csrfToken();
  const h={Authorization:'Bearer '+token,'X-CSRF-Token':csrf,'Cookie':'csrf_token='+csrf};
  if(body) h['Content-Type']='application/json';
  const r=await fetch(API+path,{method,headers:h,body:body?JSON.stringify(body):undefined});
  const t=await r.text(); let j=null; try{j=JSON.parse(t);}catch{}
  return {status:r.status, body:j};
}

// ---- CDP harness ----
const chrome = spawn(CHROME, ['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-proxy-server',`--remote-debugging-port=${PORT}`,`--user-data-dir=${PROFILE}`], { stdio: 'ignore' });
let msgId=0; const pending=new Map(); let ws=null; let netCalls=[];
const connect=(u)=>new Promise((res,rej)=>{const s=new WebSocket(u);s.onopen=()=>res(s);s.onerror=()=>rej(new Error('ws'));});
const send=(m,p={})=>new Promise((res,rej)=>{const id=++msgId;pending.set(id,{res,rej});ws.send(JSON.stringify({id,method:m,params:p}));});
async function waitPage(){for(let i=0;i<80;i++){try{const t=await(await fetch(`http://127.0.0.1:${PORT}/json`)).json();const p=t.find(x=>x.type==='page');if(p)return p;}catch{}await sleep(250);}throw new Error('no page');}
async function nav(u,ms=5000){try{await send('Page.navigate',{url:u});}catch{}await sleep(ms);}
async function aev(expr){try{const r=await send('Runtime.evaluate',{expression:expr,returnByValue:true,awaitPromise:true});return r?.result?.value;}catch{return null;}}
function setupWs(page){
  ws.addEventListener('message',(d)=>{const m=JSON.parse(d.data.toString());
    if(m.method==='Network.responseReceived' && m.params?.response?.url?.includes('/product-categories')){netCalls.push(m.params.response.url);}
    if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.rej(new Error(m.error.message)):p.res(m.result);}
  });
}

(async()=>{
  const out={};
  await sleep(2500);
  const page=await waitPage(); ws=await connect(page.webSocketDebuggerUrl); setupWs();
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');

  // ===== D1 freshness =====
  await nav(WEB+'/categories', 8000);
  await sleep(1500);
  // capture initial rendered category slugs (visible text / links)
  const before = await aev(`JSON.stringify((()=>{const s=new Set();document.querySelectorAll('a').forEach(a=>{const m=a.pathname&&a.pathname.match(/products\\?categoryId=(.*)/);if(m)s.add(a.getAttribute('href'));});document.body.innerText.split(/\\n/).forEach(t=>{const m=t.trim().match(/\/products\?categoryId=[^" ]+/);});return Array.from(s);})())`);
  const beforeSet = new Set(JSON.parse(before||'[]'));
  out.initialLinkCount = beforeSet.size;
  netCalls.length=0;

  // admin mutation: create throwaway temp category (changes public catalog)
  const slugTmp='811-focus-fresh-'+Date.now();
  const cr=await adminMutate('POST','/product-categories',{name:'811 焦点刷新临时分类',slug:slugTmp,parentId:null});
  const tmpId=cr.body?.data?.id||cr.body?.id;
  out.createTemp={status:cr.status, tmpId:tmpId||null};

  // wait until React Query data is stale (>60s staleTime since page load)
  out.staleWaitMs = 65000;
  await sleep(65000);
  const beforeFocusGets = netCalls.length;

  // trigger window focus (React Query refetchOnWindowFocus)
  await aev(`window.dispatchEvent(new Event('focus')); true`);
  await sleep(4000);
  const afterFocusGets = netCalls.length;
  const pageContains = await aev(`document.body.innerText.includes('811 焦点刷新临时分类')||document.body.innerText.includes('${slugTmp}')`);
  out.freshness={ requestFired:(afterFocusGets>beforeFocusGets), beforeFocusGets, afterFocusGets, slugTmp, renderedTempInPage:pageContains };

  // cleanup: delete temp category (controlled)
  if(tmpId){ const dl=await adminMutate('DELETE','/product-categories/'+tmpId); out.cleanup={status:dl.status}; }

  // ===== Mobile / viewport =====
  const mobile=[];
  for (const w of [375,768,1024,1440]) {
    for (const [label,path] of [['categories','/categories'],['home','/']]) {
      await send('Emulation.setDeviceMetricsOverride',{width:w,height:w<=768?2200:1000,deviceScaleFactor:1,mobile:w<=768});
      await nav(WEB+path,6500);
      const r=await aev(`JSON.stringify({path:location.pathname,overflow:(document.documentElement.scrollWidth-1)>document.documentElement.clientWidth,scrollW:document.documentElement.scrollWidth,clientW:document.documentElement.clientWidth,err:!!document.querySelector('#__next_error__')||document.body.innerText.includes('Internal Server Error')})`);
      mobile.push({surface:label,viewport:w,...JSON.parse(r||'{}')});
    }
  }
  out.mobile=mobile;

  fs.writeFileSync(`${SHOT}\\_811_freshness.json`, JSON.stringify(out,null,2));
  console.log(JSON.stringify(out,null,2));
  try{ws.close();}catch{} try{chrome.kill();}catch{}
  process.exit(0);
})().catch(async(e)=>{console.error('ERR '+e.message);try{ws?.close();}catch{}try{chrome.kill();}catch{}process.exit(2);});