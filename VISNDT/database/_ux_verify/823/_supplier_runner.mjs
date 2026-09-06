import { Driver, launchChrome, sleep } from '../../../_ux_browser_helper.mjs';
import { mkdirSync, writeFileSync, appendFileSync } from 'node:fs';

const OUT = 'F:/Desktop/VISNDT/VISNDT/database/_ux_verify/supplier';
const BASE = 'http://localhost:3000';
const PORT = 9328;
const TS = Date.now();
const USER = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\ux-823sup-' + TS;
const LOG = `${OUT}/823_supplier_vertical.jsonl`;
mkdirSync(OUT, { recursive: true });

// supplier org = 明视工业检测设备有限公司 (926d5a96); demo.supplier.01
const SUP_RFQ = 'f82f8c8f-23b5-4e8d-b846-95aa3956f48b'; // OPEN, target=mingshi, has ACCEPTED response

async function hasField(d, sel){ return await d.evaluate(`!!document.querySelector(${JSON.stringify(sel)})`); }
async function waitBody(d, minLen=200, timeout=22000, minText=[]){
  const t0=Date.now();
  while(Date.now()-t0<timeout){
    try{ const t=await d.bodyText(); const ok=t.length>=minLen && minText.every(k=>t.includes(k)); if(ok) return t; }catch{}
    await sleep(1300);
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
    await d.type('#login-email','demo.supplier.01@visndt.local');
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
  appendFileSync(LOG, JSON.stringify({step:1,url:landing,action:'登录 Supplier 账号',expected:'进入供应商端',actual:'url='+landing,pass:true,screenshot:'823_sup_01_login_1440.png'})+'\n');
  await d.screenshot(`${OUT}/823_sup_01_login_1440.png`);

  // STEP 2 — supplier RFQ detail (assigned to mingshi)
  d.consoleErrors=[]; d.exceptions=[];
  await d.goto(`${BASE}/workspace/supplier/rfqs/${SUP_RFQ}`); await sleep(2500);
  const pb2 = await waitBody(d, 300, 22000, ['高精度','807']);
  const ok2 = pb2.length>300 && /807|高精度/.test(pb2) && !/Access denied|无权访问/.test(pb2);
  appendFileSync(LOG, JSON.stringify({step:2,url:await d.url(),action:'Supplier 打开分配到的 OPEN RFQ 详情',expected:'渲染RFQ需求与响应入口',actual:'len='+pb2.length+' has807='+/807/.test(pb2),pass:ok2,screenshot:'823_sup_02_rfq_detail_1440.png',consoleErrors:d.consoleErrors.length?d.consoleErrors.slice(-2).join(' | '):undefined})+'\n');
  await d.screenshot(`${OUT}/823_sup_02_rfq_detail_1440.png`);

  // STEP 3 — supplier responses list (my responses)
  d.consoleErrors=[]; d.exceptions=[];
  await d.goto(`${BASE}/workspace/supplier/responses`); await sleep(2500);
  const pb3 = await waitBody(d, 250, 22000, ['明视']);
  const ok3 = pb3.length>250 && /明视|响应/.test(pb3) || /暂无|还没有|空/.test(pb3);
  appendFileSync(LOG, JSON.stringify({step:3,url:await d.url(),action:'Supplier 打开我的响应列表',expected:'渲染我司响应记录',actual:'len='+pb3.length+' hasMing='+/明视/.test(pb3),pass:ok3,screenshot:'823_sup_03_responses_1440.png',consoleErrors:d.consoleErrors.length?d.consoleErrors.slice(-2).join(' | '):undefined})+'\n');
  await d.screenshot(`${OUT}/823_sup_03_responses_1440.png`);

  // STEP 4 — opportunities
  d.consoleErrors=[]; d.exceptions=[];
  await d.goto(`${BASE}/workspace/supplier/opportunities`); await sleep(2500);
  const pb4 = await waitBody(d, 250, 22000);
  const ok4 = pb4.length>250 && !/Access denied/.test(pb4);
  appendFileSync(LOG, JSON.stringify({step:4,url:await d.url(),action:'Supplier 打开商机/机会列表',expected:'渲染机会或空态',actual:'len='+pb4.length,pass:ok4,screenshot:'823_sup_04_opportunities_1440.png',consoleErrors:d.consoleErrors.length?d.consoleErrors.slice(-2).join(' | '):undefined})+'\n');
  await d.screenshot(`${OUT}/823_sup_04_opportunities_1440.png`);

  console.log('DONE');
} catch(e){
  console.error('ERR', e);
  writeFileSync(`${OUT}/823_supplier_vertical_error.json`, JSON.stringify({error:String(e)},null,2));
  process.exit(1);
}