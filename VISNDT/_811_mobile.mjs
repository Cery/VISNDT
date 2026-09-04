/** 811 Batch A — Mobile responsiveness probe (viewports 375/768/1024/1440).
 *  Checks public catalog pages + homepage render without horizontal overflow.
 */
import { spawn } from 'node:child_process';
const CHROME='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT=9490; const PROFILE='C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-811m-'+Date.now();
const WEB='http://localhost:3000';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const chrome=spawn(CHROME,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-proxy-server',`--remote-debugging-port=${PORT}`,`--user-data-dir=${PROFILE}`],{stdio:'ignore'});
let msgId=0;const pending=new Map();let ws=null;
const connect=(u)=>new Promise((res,rej)=>{const s=new WebSocket(u);s.onopen=()=>res(s);s.onerror=()=>rej(new Error('ws'));});
const send=(m,p={})=>new Promise((res,rej)=>{const id=++msgId;pending.set(id,{res,rej});ws.send(JSON.stringify({id,method:m,params:p}));});
async function waitPage(){for(let i=0;i<80;i++){try{const t=await(await fetch(`http://127.0.0.1:${PORT}/json`)).json();const p=t.find(x=>x.type==='page');if(p)return p;}catch{}await sleep(250);}throw new Error('no page');}
async function aev(x){try{const r=await send('Runtime.evaluate',{expression:x,returnByValue:true,awaitPromise:true});return r?.result?.value;}catch{return null;}}
const VIEWPORTS=[375,768,1024,1440];
const PAGES=['/','/categories','/products'];

(async()=>{
  await sleep(2500);
  const page=await waitPage(); ws=await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message',(d)=>{const m=JSON.parse(d.data.toString());if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.rej(new Error(m.error.message)):p.res(m.result);}});
  await send('Page.enable');await send('Runtime.enable');
  const results=[];
  for(const vp of VIEWPORTS){
    await send('Emulation.setDeviceMetricsOverride',{width:vp,height:900,deviceScaleFactor:1,mobile:vp<=430});
    for(const pg of PAGES){
      await send('Page.navigate',{url:WEB+pg}); await sleep(1800);
      await aev(`document.fonts&&document.fonts.ready&&document.fonts.ready.catch(()=>{})`);
      await sleep(700);
      // wait for hydration content
      for(let i=0;i<20;i++){ const t=await aev(`(document.body.innerText||'').trim().length`); if(t>50) break; await sleep(500); }
      const m=await aev(`(()=>{const d=document.documentElement;return {sw:Math.max(300,d.clientWidth),scrollW:d.scrollWidth,overflowX:(getComputedStyle(document.body).overflowX)+'|'+(getComputedStyle(d).overflowX)};})()`);
      results.push({viewport:vp,page:pg,scorllWidth:m&&m.scrollW,clientWidth:m&&m.sw,overflowX:m&&m.overflowX,hOverflow:m?(m.scrollW>m.sw):null});
    }
  }
  console.log(JSON.stringify(results,null,2));
  try{ws.close();}catch{} try{chrome.kill();}catch{}
  process.exit(0);
})().catch(async(e)=>{console.error('ERR '+e.message);try{ws?.close();}catch{}try{chrome.kill();}catch{}process.exit(2);});