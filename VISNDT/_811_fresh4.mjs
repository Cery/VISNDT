/** 811 Batch A — D1 freshness probe v4.
 *  Uses CDP Emulation.setFocusEmulationEnabled(true) so document.hasFocus()==true,
 *  enabling React Query refetchOnWindowFocus. Records network requests touching
 *  /product-categories to prove a focus-return triggers a fresh public fetch.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const CHROME='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT=9486; const PROFILE='C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-811d-'+Date.now();
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
async function nav(u,ms=5000){try{await send('Page.navigate',{url:u});}catch{}await sleep(ms);}
async function aev(x){try{const r=await send('Runtime.evaluate',{expression:x,returnByValue:true,awaitPromise:true});return r?.result?.value;}catch{return null;}}
async function waitFor(fn,timeout=30000){const t0=Date.now();while(Date.now()-t0<timeout){const v=await fn();if(v)return v;await sleep(800);}return null;}

(async()=>{
  const out={}; await sleep(2500);
  const page=await waitPage(); ws=await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message',(d)=>{const m=JSON.parse(d.data.toString());
    if(m.method==='Network.responseReceived'){
      const u=m.params?.response?.url||'';
      if(u.includes('/product-categories')) netLog.push({t:Date.now(),u,status:m.params?.response?.status});
    }
    if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.rej(new Error(m.error.message)):p.res(m.result);}
  });
  await send('Page.enable');await send('Runtime.enable');await send('Network.enable');
  // Focus emulation => document.hasFocus() true (needed by React Query refetchOnWindowFocus)
  await send('Emulation.setFocusEmulationEnabled',{enabled:true});

  await nav(WEB+'/categories',6000);
  await waitFor(async()=>{const t=await aev(`document.body.innerText.includes('能力分类')||document.body.innerText.includes('工业检测')`);return t;},40000);
  await sleep(6000);
  const baseCount=netLog.length; // initial categories fetch(es) during hydration/StrictMode
  fs.writeFileSync('F:\\Desktop\\VISNDT\\VISNDT\\_811_fresh4_net.json', JSON.stringify(netLog,null,2));

  const slug='811focus4'+Date.now();
  const cr=await adminMut('POST','/product-categories',{name:'811焦点验证临时分类4',slug,parentId:null});
  const tmpId=cr.body?.data?.id||cr.body?.id;
  out.createTemp={status:cr.status,tmpId:tmpId||null,slug};
  await sleep(4000);

  // Force window blur, wait past staleTime(60s global) so query expires,
  // while the temp category is NOT yet shown (no refetch while fresh/unfocused).
  await aev(`window.dispatchEvent(new Event('blur')); document.dispatchEvent(new Event('visibilitychange'));`);
  await sleep(62000);
  const beforeFocusCount=netLog.length;
  const shownWhileUnfocused=await aev(`document.body.innerText.includes('811焦点验证临时分类4')`);
  out.shownBeforeFocus=!!shownWhileUnfocused;

  // Emulate focus return with a REAL mouse click (gives the page true focus in headless)
  await send('Input.dispatchMouseEvent',{type:'mousePressed',x:320,y:320,button:'left',clickCount:1});
  await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:320,y:320,button:'left',clickCount:1});
  await aev(`window.dispatchEvent(new Event('focus')); document.dispatchEvent(new Event('visibilitychange'));`);
  await sleep(800);
  out.focusHasFocus=!!(await aev(`document.hasFocus()`));
  await waitFor(async()=>netLog.length>beforeFocusCount,12000);
  await sleep(1000);
  out.network={
    baseCount,
    requestsBeforeFocus:beforeFocusCount,
    requestsAfterFocus:netLog.length,
    refetchFired:netLog.length>beforeFocusCount,
    newRequests:netLog.slice(beforeFocusCount).map(r=>({status:r.status,url:r.u.slice(0,90)})),
  };
  out.catalogNowVisible=!!(await aev(`document.body.innerText.includes('811焦点验证临时分类4')`));
  if(tmpId){const dl=await adminMut('DELETE','/product-categories/'+tmpId);out.cleanup={status:dl.status};}
  console.log(JSON.stringify(out,null,2));
  try{ws.close();}catch{} try{chrome.kill();}catch{}
  process.exit(0);
})().catch(async(e)=>{console.error('ERR '+e.message);try{ws?.close();}catch{}try{chrome.kill();}catch{}process.exit(2);});