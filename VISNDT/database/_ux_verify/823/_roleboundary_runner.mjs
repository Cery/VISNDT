import { Driver, launchChrome, sleep } from '../../../_ux_browser_helper.mjs';
import { mkdirSync, writeFileSync, appendFileSync } from 'node:fs';

const OUT = 'F:/Desktop/VISNDT/VISNDT/database/_ux_verify/buyer';
const BASE = 'http://localhost:3000';
const PORT = 9327;
const TS = Date.now();
const USER = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\ux-823bnd-' + TS;
const LOG = `${OUT}/823_buyer_vertical.jsonl`;
mkdirSync(OUT, { recursive: true });

async function hasField(d, sel){ return await d.evaluate(`!!document.querySelector(${JSON.stringify(sel)})`); }
async function waitBody(d, minLen=100, timeout=20000){
  const t0=Date.now();
  while(Date.now()-t0<timeout){
    try{ const t=await d.bodyText(); if(t.length>=minLen) return t; }catch{}
    await sleep(1200);
  }
  return await d.bodyText();
}

launchChrome(PORT, USER);
await sleep(4000);
const d = new Driver(PORT); await d.connect(); d.consoleErrors=[]; d.exceptions=[];

async function login(){
  for(let a=1;a<=5;a++){
    await d.goto(BASE+'/login'); await sleep(4500);
    if(!(await hasField(d,'#login-email')) || !(await hasField(d,'#login-password'))){ continue; }
    await d.type('#login-email','demo.buyer.01@visndt.local');
    await d.type('#login-password','demo123456'); await sleep(400);
    await d.submitFormContaining('#login-password');
    for(let i=0;i<12;i++){ await sleep(1200); const u=await d.url(); if(/dashboard|workspace/.test(u)) return u; }
  }
  return null;
}

try{
  const landing = await login();
  if(!landing) throw new Error('login fail');
  console.log('landed', landing);

  // role boundary: BUYER -> supplier-only route
  const routes = [
    ['/workspace/supplier/products','Supplier 产品管理私有页', 'Access denied'],
    ['/workspace/supplier/opportunities','Supplier 机会私有页', 'Access denied'],
    ['/admin','Admin 控制台', 'Access denied'],
  ];
  for (const [path,label,_e] of routes) {
    d.consoleErrors=[]; d.exceptions=[];
    await d.goto(BASE+path); await sleep(2000);
    const pb = await waitBody(d, 100, 15000);
    const url = await d.url();
    const blocked = /无权访问|权限不足|404|没有权限|Forbidden|Access denied|access denied|无权限|no access|unauthorized/i.test(pb) || /403/.test(url) || /denied/i.test(pb);
    const o={step:'roleboundary',url,action:`Buyer 越权访问「${label}」`,expected:'被权限拦截',actual:`len=${pb.length} blocked=${blocked} head=${pb.slice(0,50)} blockedText=${/denied|无权|无权限|无权访问/i.test(pb)?'denied-text':'other'}`,pass:blocked,screenshot:`823_vertical_05_${path.replace(/\//g,'_').slice(1)}.png`,consoleErrors:d.consoleErrors.length?d.consoleErrors.slice(-2).join(' | '):undefined};
    appendFileSync(LOG, JSON.stringify(o)+'\n');
    await d.screenshot(`${OUT}/823_vertical_05_${path.replace(/\//g,'_').slice(1)}.png`);
    console.log(JSON.stringify(o));
  }
  console.log('DONE');
} catch(e){
  console.error('ERR', e);
  process.exit(1);
}