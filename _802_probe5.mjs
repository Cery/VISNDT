/** 802_M39 — discover real detail slugs from rendered list pages + verify detail surfaces. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9378;
const PROFILE = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-802e-' + Date.now();
const WEB = 'http://localhost:3000';
const SHOT = 'f:\\Desktop\\VISNDT\\VISNDT\\database\\_802_visual';
if (!fs.existsSync(SHOT)) fs.mkdirSync(SHOT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = spawn(CHROME, ['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-proxy-server','--proxy-bypass-list=*',`--remote-debugging-port=${PORT}`,`--user-data-dir=${PROFILE}`], { stdio:'ignore' });
let msgId=0; const pending=new Map(); let ws=null;
function connect(u){return new Promise((res,rej)=>{const s=new WebSocket(u);s.onopen=()=>res(s);s.onerror=()=>rej(new Error('ws'));});}
function send(m,p={}){return new Promise((res,rej)=>{const id=++msgId;pending.set(id,{res,rej});ws.send(JSON.stringify({id,method:m,params:p}));});}
async function waitPage(){for(let i=0;i<60;i++){try{const t=await(await fetch(`http://127.0.0.1:${PORT}/json`)).json();const p=t.find(x=>x.type==='page');if(p)return p;}catch{}await sleep(300);}throw new Error('no page');}
async function nav(u,ms=4500){try{await send('Page.navigate',{url:u});}catch{}await sleep(ms);}
async function aev(e){try{const r=await send('Runtime.evaluate',{expression:e,returnByValue:true,awaitPromise:true});return r?.result?.value;}catch{return null;}}
async function allHrefs(path){await nav(WEB+path,4500); return (await aev(`JSON.stringify(Array.from(new Set(Array.from(document.querySelectorAll('a')).map(a=>a.getAttribute('href')).filter(Boolean))))`))||'[]';}
async function detailState(path,width){
  await send('Emulation.setDeviceMetricsOverride',{width,height:width<=768?2000:1000,deviceScaleFactor:1,mobile:width<=768});
  await nav(WEB+path,5000); await aev('window.scrollTo(0,document.body.scrollHeight||0)'); await sleep(400);
  return JSON.parse((await aev(`JSON.stringify({path:location.pathname,overflow:(document.documentElement.scrollWidth-1)>document.documentElement.clientWidth,h1:(document.querySelector('h1')?.textContent||'').trim().slice(0,46),relDiscovery:document.body.innerText.includes('相关工程发现')||document.body.innerText.includes('Relevant Engineering Discovery'),evalRibbon:document.body.innerText.includes('CAPABILITY EVALUATION')||document.body.innerText.includes('评估'),journey:document.body.innerText.includes('CAPABILITY DISCOVERY JOURNEY'),err:!!document.querySelector('#__next_error__')||document.body.innerText.includes('Internal Server Error')||document.body.innerText.includes('Application error')})`))||'{}');
}
async function main(){
  await sleep(2500); const page=await waitPage(); ws=await connect(page.webSocketDebuggerUrl);
  ws.addEventListener('message',(d)=>{const m=JSON.parse(d.data.toString());if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.rej(new Error(m.error.message)):p.res(m.result);}});
  send('Page.enable'); send('Runtime.enable'); const out={};
  for (const path of ['/products','/categories','/knowledge-base','/solutions','/supplier-models','/products/compare']) {
    try { const h=JSON.parse(await allHrefs(path)); out[path]=h.slice(0,40); } catch(e){ out[path]='ERR '+e.message; }
  }
  const results=[];
  const pick=(arr,re)=>{ const i=arr.findIndex(x=>x&&x.match(re)); return i>=0?arr[i]:null; };
  const prd=pick(out['/products']||[],/\/products\/[^?#/]+$/); if(prd){for(const w of[375,1440])results.push({surface:'productDetail',viewport:w,...(await detailState(prd,w))});}
  const cat=pick(out['/categories']||[],/\/categories\/[^?#/]+$/); 
  const kbs=pick(out['/knowledge-base']||[],/\/knowledge-base\/[^?#/]+$/);
  const sup=pick([...(out['/supplier-models']||[]),...(out['/products']||[])],/\/suppliers\/\d+/);
  results.push({discovered:{product:prd,category:cat,knowledge:kbs,supplier:sup}});
  if(kbs){for(const w of[375,1440])results.push({surface:'knowledgeDetail',viewport:w,...(await detailState(kbs,w))});}
  if(sup){for(const w of[375,1440])results.push({surface:'supplierDetail',viewport:w,...(await detailState(sup,w))});}
  fs.writeFileSync(`${SHOT}/_802_pages5.json`,JSON.stringify({hrefs:out,results},null,2));
  console.log('WRITTEN',results.length); try{ws.close();}catch{} try{chrome.kill();}catch{} process.exit(0);
}
main().catch((e)=>{console.error('FATAL '+e.message);try{ws&&ws.close();}catch{}try{chrome.kill();}catch{}process.exit(2);});