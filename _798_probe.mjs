import { spawn } from 'node:child_process';
const CHROME='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT=9337, PROFILE='C:\\Users\\ws_tj\\AppData\\Local\\Temp\\visndt-cdp-probe-'+Date.now();
const API='http://localhost:4000/api/v1';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const chrome=spawn(CHROME,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-proxy-server','--proxy-bypass-list=*',`--remote-debugging-port=${PORT}`,`--user-data-dir=${PROFILE}`],{stdio:'ignore'});
let msgId=0; const pending=new Map(); let ws;
function connect(u){return new Promise((res,rej)=>{const s=new WebSocket(u);s.onopen=()=>res(s);s.onerror=e=>rej(new Error('ws'))});}
function send(m,p={}){return new Promise((res,rej)=>{const id=++msgId;pending.set(id,{res,rej});ws.send(JSON.stringify({id,method:m,params:p}));});}
async function waitPage(){for(let i=0;i<60;i++){try{const t=await(await fetch(`http://127.0.0.1:${PORT}/json`)).json();const p=t.find(x=>x.type==='page');if(p)return p;}catch{}await sleep(400);}throw new Error('no page');}
async function nav(u,ms=2500){await send('Page.navigate',{url:u});await sleep(ms);}
async function ev(expr){const r=await send('Runtime.evaluate',{expression:expr,returnByValue:true});return r.result?.value;}
async function main(){
  const page=await waitPage(); ws=await connect(page.webSocketDebuggerUrl);
  send('Page.enable');send('Runtime.enable');
  ws.addEventListener('message',(d)=>{const m=JSON.parse(d.data.toString());if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.rej(new Error(m.error.message)):p.res(m.result);}});
  await nav('http://localhost:3000/login',2500);
  const loginRes=await ev(`(async()=>{try{const r=await fetch('${API}/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'demo.buyer.01@visndt.local',password:'demo123456'}),credentials:'include'});return 'LOGIN_'+r.status;}catch(e){return 'ERR '+e.message;}})()`);
  console.log('LOGIN_RES='+loginRes);
  await sleep(2000);
  const me=await ev(`(async()=>{try{const r=await fetch('${API}/auth/me',{credentials:'include'});return 'ME_'+r.status+':'+(await r.text()).slice(0,120);}catch(e){return 'ME_ERR '+e.message;}})()`);
  console.log('ME='+me);
  const allCookies=await ev(`document.cookie`);
  console.log('DOC_COOKIE='+JSON.stringify(allCookies));
  // now load workspace page fresh
  await nav('http://localhost:3000/workspace/demands',3500);
  const after=await ev(`JSON.stringify({path:location.pathname,loginInput:!!document.querySelector('#login-email'),h1:document.querySelector('h1')?.textContent?.trim().slice(0,30)})`);
  console.log('AFTER_NAV='+after);
  const me2=await ev(`(async()=>{try{const r=await fetch('${API}/auth/me',{credentials:'include'});return 'ME2_'+r.status;}catch(e){return 'ERR';}})()`);
  console.log('ME2='+me2);
  try{ws.close();}catch{} chrome.kill(); process.exit(0);
}
main().catch(e=>{console.error('FATAL '+e.message);try{ws&&ws.close();}catch{}try{chrome.kill();}catch{}process.exit(2);});