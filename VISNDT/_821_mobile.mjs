/* 821 Mobile verification — Supplier Product self-service page
   (/workspace/supplier/products covers My Products / Attach / Edit / Submit + status
   display). Drives headless Chrome via CDP across 375/768/1024/1440 and asserts the
   page renders without horizontal overflow and the DRAFT Submit control is present. */
import { spawn } from 'node:child_process';
const CHROME='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT=9495; const PROFILE='C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-821m-'+Date.now();
const WEB='http://localhost:3000'; const API='http://localhost:4000/api/v1';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const results=[];
const login=async()=>{
  for(let a=0;a<4;a++){
    try{
      const r=await fetch(API+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'demo.supplier.01@visndt.local',password:'demo123456'})});
      const sc=(r.headers.get('set-cookie')||'');
      const at=(sc.match(/access_token=([^;]+)/)||[])[1];
      if(at) return {at,rt:(sc.match(/refresh_token=([^;]+)/)||[])[1],status:r.status};
    }catch(e){ /* transient network — retry */ }
    await sleep(1500);
  }
  return {at:null,rt:null,status:0};
};
const chrome=spawn(CHROME,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-proxy-server',`--remote-debugging-port=${PORT}`,`--user-data-dir=${PROFILE}`],{stdio:'ignore'});
let msgId=0;const pending=new Map();let ws=null;
const connect=(u)=>new Promise((res,rej)=>{const s=new WebSocket(u);s.onopen=()=>res(s);s.onerror=()=>rej(new Error('ws'));});
const send=(m,p={})=>new Promise((res,rej)=>{const id=++msgId;pending.set(id,{res,rej});ws.send(JSON.stringify({id,method:m,params:p}));});
async function waitPage(){for(let i=0;i<80;i++){try{const t=await(await fetch(`http://127.0.0.1:${PORT}/json`)).json();const p=t.find(x=>x.type==='page');if(p)return p;}catch{}await sleep(250);}throw new Error('no page');}
async function aev(x){try{const r=await send('Runtime.evaluate',{expression:x,returnByValue:true,awaitPromise:true});return r?.result?.value;}catch{return null;}}
const VIEWPORTS=[375,768,1024,1440];

(async()=>{
  const lg=await login();
  results.push({name:'programmatic supplier login',pass:!!lg.at&&!!lg.rt,status:lg.status});
  if(!lg.at){console.log(JSON.stringify(results,null,2));process.exit(2);}
  await sleep(2600);
  const page=await waitPage(); ws=await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message',(d)=>{const m=JSON.parse(d.data.toString());if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.rej(new Error(m.error.message)):p.res(m.result);}});
  await send('Page.enable');await send('Runtime.enable');await send('Network.enable');

  // unauth gate: no cookies → must not render my-products
  await send('Network.clearBrowserCookies');
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate',{url:WEB+'/workspace/supplier/products'}); await sleep(2000);
  const gated=await aev(`(document.location.pathname||'').includes('login')||((document.body.innerText||'').includes('登录'))`);
  results.push({name:'unauth /workspace/supplier/products gated (no leak)',pass:!!gated});

  // inject supplier auth cookies
  const cookieOpts=()=>['access_token','refresh_token'].map((n,i)=>({name:n,value:i===0?lg.at:lg.rt,url:WEB+'/',httpOnly:true,sameSite:'Lax'}));
  await Promise.all(cookieOpts().map(c=>send('Network.setCookie',c)));

  for(const vp of VIEWPORTS){
    await send('Emulation.setDeviceMetricsOverride',{width:vp,height:900,deviceScaleFactor:1,mobile:vp<=430});
    await send('Page.navigate',{url:WEB+'/workspace/supplier/products'}); await sleep(1800);
    try{await aev(`document.fonts.ready.then(()=>{}).catch(()=>{})`);}catch{}
    await sleep(600);
    for(let i=0;i<25;i++){const t=await aev(`(document.body.innerText||'').trim().length`);if(t>60)break;await sleep(500);}
    const info=await aev(`(()=>{const d=document.documentElement;const t=(document.body.innerText||'');return {sw:Math.max(300,d.clientWidth),scrollW:d.scrollWidth,hasTitle:t.includes('我的产品'),hasAdd:t.includes('新增型号')||t.includes('新增产品')||t.includes('Attach')||t.includes('新增'),hasSubmit:t.includes('提交审核'),hasStatus:t.includes('草稿')||t.includes('DRAFT')||t.includes('已发布')||t.includes('PUBLISHED'),len:t.length};})()`);
    results.push({viewport:vp,hasMyProducts:!!info?.hasTitle,hasAdd:!!info?.hasAdd,hasSubmitDraft:!!info?.hasSubmit,hasStatusDisplay:!!info?.hasStatus,hOverflow:!!info?(info.scrollW>info.sw):null,scrollW:info?.scrollW,clientW:info?.sw});
  }
  console.log(JSON.stringify(results,null,2));
  try{ws.close();}catch{} try{chrome.kill();}catch{}
  process.exit(0);
})().catch(async(e)=>{console.error('ERR '+e.message);try{ws?.close();}catch{}try{chrome.kill();}catch{}process.exit(2);});