import { spawn } from 'node:child_process';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9334;
const USER = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-d-' + Date.now();
const BASE = 'http://localhost:3000';
const chrome = spawn(CHROME, ['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage',`--remote-debugging-port=${PORT}`,`--user-data-dir=${USER}`],{stdio:'ignore'});
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
async function waitJson(t){for(let i=0;i<60;i++){try{const r=await fetch(t);if(r.ok)return await r.json();}catch{}await sleep(500);}throw new Error('cdp not ready');}
let msgId=0;const pending=new Map();
function connect(u){return new Promise((res,rej)=>{const ws=new WebSocket(u);ws.onopen=()=>res(ws);ws.onerror=()=>rej(new Error('ws'));});}
function send(ws,m,p={}){return new Promise((res,rej)=>{const id=++msgId;pending.set(id,{res,rej});ws.send(JSON.stringify({id,method:m,params:p}));});}
async function main(){
  const tg=await waitJson(`http://127.0.0.1:${PORT}/json`);
  const ws=await connect(tg.find(t=>t.type==='page').webSocketDebuggerUrl);
  ws.onmessage=(ev)=>{const m=JSON.parse(ev.data);if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.rej(new Error(m.error.message)):p.res(m.result);}};
  await send(ws,'Page.enable');await send(ws,'Runtime.enable');
  await send(ws,'Emulation.setDeviceMetricsOverride',{width:1024,height:800,deviceScaleFactor:1,mobile:false});
  await send(ws,'Page.navigate',{url:BASE+'/products/zb-k60'});
  await sleep(4000);
  const expr=`JSON.stringify({
    viewport: innerWidth,
    clients: [document.documentElement.clientWidth, document.body.scrollWidth, document.documentElement.scrollWidth],
    orgText: document.body.innerText.slice(0, 4000),
    wideEls: (()=>{
      const vw=innerWidth; const out=[];
      const els=document.querySelectorAll('*');
      const seen=new Set();
      for(const el of els){
        const r=el.getBoundingClientRect();
        if(r.right>vw+1 || r.left<-1){
          // only top-level offenders (skip if inside another offender)
          out.push({tag:el.tagName, cls:(el.getAttribute('class')||'').slice(0,90), right:Math.round(r.right), left:Math.round(r.left), w:Math.round(r.width)});
        }
      }
      out.sort((a,b)=>b.right-a.right);
      return out.slice(0,12);
    })(),
    hasAppTag: document.body.innerText.includes('应用'),
    hasScenario: document.body.innerText.includes('检测场景'),
    hasDetObj: document.body.innerText.includes('检测对象'),
    hasEngTags: !!document.querySelector('.industrial-cyan') ? document.body.querySelectorAll('span[class*="industrial-cyan"]').length : 0
  })`;
  const r=await send(ws,'Runtime.evaluate',{expression:expr,returnByValue:true});
  const m=JSON.parse(r.result.value);
  // print context tags region
  console.log(JSON.stringify(m,null,2));
  try{ws.close();}catch{}chrome.kill();process.exit(0);
}
main().catch(e=>{console.error('FATAL',e.message);try{chrome.kill();}catch{}process.exit(2);});