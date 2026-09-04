/* 821 Admin mobile verification — /supplier-products (Review pool; detail provides
   Review/Publish/Reject). Injects admin auth via zustand localStorage 'visndt-auth',
   then drives CDP across 375/768/1024/1440 and asserts the page renders with the
   governance header and no page-level horizontal overflow. */
import { spawn } from 'node:child_process';
const CHROME='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT=9496; const PROFILE='C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-821ma-'+Date.now();
const ADMIN='http://localhost:3001'; const API='http://localhost:4000/api/v1';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const results=[];
const sleepSafe=(ms)=>new Promise(r=>setTimeout(r,ms));
const adminLogin=async()=>{
  for(let a=0;a<4;a++){
    try{
      const r=await fetch(API+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'demo.admin@visndt.local',password:'demo123456'})});
      const at=(r.headers.get('set-cookie')||'').match(/access_token=([^;]+)/)?.[1];
      if(at) return {at,status:r.status};
    }catch(e){}
    await sleepSafe(1500);
  }
  return {at:null,status:0};
};
const chrome=spawn(CHROME,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-proxy-server',`--remote-debugging-port=${PORT}`,`--user-data-dir=${PROFILE}`],{stdio:'ignore'});
let msgId=0;const pending=new Map();let ws=null;
const connect=(u)=>new Promise((res,rej)=>{const s=new WebSocket(u);s.onopen=()=>res(s);s.onerror=()=>rej(new Error('ws'));});
const send=(m,p={})=>new Promise((res,rej)=>{const id=++msgId;pending.set(id,{res,rej});ws.send(JSON.stringify({id,method:m,params:p}));});
async function waitPage(){for(let i=0;i<80;i++){try{const t=await(await fetch(`http://127.0.0.1:${PORT}/json`)).json();const p=t.find(x=>x.type==='page');if(p)return p;}catch{}await sleep(250);}throw new Error('no page');}
async function aev(x){try{const r=await send('Runtime.evaluate',{expression:x,returnByValue:true,awaitPromise:true});return r?.result?.value;}catch{return null;}}
const VIEWPORTS=[375,768,1024,1440];

(async()=>{
  const lg=await adminLogin();
  results.push({name:'admin login',pass:!!lg.at,status:lg.status});
  if(!lg.at){console.log(JSON.stringify(results,null,2));process.exit(2);}
  await sleep(2600);
  const page=await waitPage(); ws=await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message',(d)=>{const m=JSON.parse(d.data.toString());if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.rej(new Error(m.error.message)):p.res(m.result);}});
  await send('Page.enable');await send('Runtime.enable');
  const now=Date.now();
  const stateObj={accessToken:lg.at,user:{id:'admin-verify',name:'admin',email:'demo.admin@visndt.local',role:'ADMIN'},isAuthenticated:true,tokenExpiresAt:now+3600000};
  const persisted=JSON.stringify({state:stateObj,version:0});
  // Inject the auth token synchronously on every new document BEFORE app scripts run,
  // so the zustand persist store rehydrates with a valid admin session.
  await send('Page.addScriptToEvaluateOnNewDocument',{source:`(()=>{try{localStorage.setItem('visndt-auth', ${JSON.stringify(persisted)});}catch(e){}})();`});
  await send('Page.navigate',{url:ADMIN+'/'}); await sleep(1800);

  for(const vp of VIEWPORTS){
    await send('Emulation.setDeviceMetricsOverride',{width:vp,height:900,deviceScaleFactor:1,mobile:vp<=430});
    await send('Page.navigate',{url:ADMIN+'/supplier-products'}); await sleep(2200);
    await sleep(700);
    for(let i=0;i<25;i++){const t=await aev(`(document.body.innerText||'').trim().length`);if(t>80)break;await sleep(500);}
    const info=await aev(`(()=>{const d=document.documentElement;const t=(document.body.innerText||'');return {sw:Math.max(300,d.clientWidth),scrollW:d.scrollWidth,hasHeader:t.includes('能力型号管理')||t.includes('能力型号审核'),hasReview:t.includes('审核'),hasStatus:t.includes('草稿')||t.includes('已提交')||t.includes('已通过')||t.includes('已发布')||t.includes('已拒绝'),isLoginPage:!!(t.includes('登 录')||t.includes('登录'))&&!t.includes('能力型号')&&!t.includes('审核'),len:t.length,txt:t.slice(0,400)};})()`);
    if(vp===1440) console.log('DEBUG1440:', JSON.stringify(info?.txt));
    results.push({viewport:vp,hasGovHeader:!!info?.hasHeader,hasRowAction:!!info?.hasReview||!!info?.hasStatus,loggedIn:!info?.isLoginPage,hOverflow:!!info?(info.scrollW>info.sw):null,scrollW:info?.scrollW,clientW:info?.sw,textLen:info?.len});
  }
  console.log(JSON.stringify(results,null,2));
  try{ws.close();}catch{} try{chrome.kill();}catch{}
  process.exit(0);
})().catch(async(e)=>{console.error('ERR '+e.message);try{ws?.close();}catch{}try{chrome.kill();}catch{}process.exit(2);});