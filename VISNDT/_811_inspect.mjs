import { spawn } from 'node:child_process';
const CHROME='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT=9486; const PROFILE='C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-811i-'+Date.now();
const WEB='http://localhost:3000';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const chrome=spawn(CHROME,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-proxy-server',`--remote-debugging-port=${PORT}`,`--user-data-dir=${PROFILE}`],{stdio:'ignore'});
let msgId=0;const pending=new Map();let ws=null;
const connect=(u)=>new Promise((res,rej)=>{const s=new WebSocket(u);s.onopen=()=>res(s);s.onerror=()=>rej(new Error('ws'));});
const send=(m,p={})=>new Promise((res,rej)=>{const id=++msgId;pending.set(id,{res,rej});ws.send(JSON.stringify({id,method:m,params:p}));});
async function waitPage(){for(let i=0;i<80;i++){try{const t=await(await fetch(`http://127.0.0.1:${PORT}/json`)).json();const p=t.find(x=>x.type==='page');if(p)return p;}catch{}await sleep(250);}throw new Error('no page');}
async function nav(u,ms=6000){try{await send('Page.navigate',{url:u});}catch{}await sleep(ms);}
async function aev(x){try{const r=await send('Runtime.evaluate',{expression:x,returnByValue:true,awaitPromise:true});return r?.result?.value;}catch{return null;}}
(async()=>{
  await sleep(2500); const page=await waitPage(); ws=await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message',(d)=>{const m=JSON.parse(d.data.toString());if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.rej(new Error(m.error.message)):p.res(m.result);}});
  await send('Runtime.enable');
  await nav(WEB+'/categories',7000);
  await sleep(3000);
  const globals=await aev(`JSON.stringify({rqHook:!!window.__REACT_QUERY_DEVTOOLS_GLOBAL_HOOK__, qcGlobal:Object.keys(window).filter(k=>/query/i.test(k)).slice(0,10), hasFocus:(()=>{try{return document.hasFocus()}catch(e){return 'err'}})()})`);
  console.log('GLOBALS', globals);
  try{ws.close();}catch{} try{chrome.kill();}catch{} process.exit(0);
})().catch(async(e)=>{console.error('ERR '+e.message);try{ws?.close();}catch{}try{chrome.kill();}catch{}process.exit(2);});