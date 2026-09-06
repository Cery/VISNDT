import { Driver, launchChrome, sleep } from '../../../_ux_browser_helper.mjs';
import { mkdirSync, writeFileSync, appendFileSync } from 'node:fs';

const OUT = 'F:/Desktop/VISNDT/VISNDT/database/_ux_verify/buyer';
const BASE = 'http://localhost:3000';
const PORT = 9326;
const TS = Date.now();
const USER = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\ux-823buyer-' + TS;
const LOG = `${OUT}/823_buyer_vertical.jsonl`;
mkdirSync(OUT, { recursive: true });

// Real controlled test data located via DB probes (not production):
const RFQ_ID = 'a24806ee-a967-463d-928c-db929dd6de68';           // OPEN, 807 demand, has ACCEPTED response
const MATCH_ID = '3623963a-a7de-4110-8e58-1b046c101543';           // ACCEPTED match for 807
const DEMAND_ID = 'd6d8b4f7-a6de-420f-8ff1-1c2010584d6f';          // 807 demand (org=8b0e7521)

async function rec(step, url, action, expected, actual, pass, shot, ce){
  const o={step,url,action,expected,actual:(actual||'').slice(0,420),pass,screenshot:shot||undefined,consoleErrors:ce};
  appendFileSync(LOG, JSON.stringify(o)+'\n');
  return o;
}
async function shot(d, fn){ await d.screenshot(`${OUT}/${fn}`); return fn; }
async function hasField(d, sel){ return await d.evaluate(`!!document.querySelector(${JSON.stringify(sel)})`); }
async function waitBody(d, minLen=450, timeout=25000, minText=[]){
  const t0=Date.now();
  while(Date.now()-t0<timeout){
    try{
      const t=await d.bodyText();
      const matched = t.length>=minLen && minText.every(k=>t.includes(k));
      if(matched) return t;
    }catch{}
    await sleep(1500);
  }
  return await d.bodyText();
}

launchChrome(PORT, USER);
await sleep(4000);
const d = new Driver(PORT); await d.connect(); d.consoleErrors=[]; d.exceptions=[];

async function login(){
  let lastWhy='';
  for(let a=1;a<=4;a++){
    await d.goto(BASE+'/login'); await sleep(5000);
    if(!(await hasField(d,'#login-email')) || !(await hasField(d,'#login-password'))){ lastWhy='fields missing'; continue; }
    await d.type('#login-email','demo.buyer.01@visndt.local');
    await d.type('#login-password','demo123456'); await sleep(400);
    await d.submitFormContaining('#login-password');
    for(let i=0;i<10;i++){ await sleep(1200); const u=await d.url(); if(u.includes('/dashboard')||u.includes('/workspace')) return u; }
    lastWhy='stayed on login';
  }
  return lastWhy;
}

try{
  const landing = await login();
  console.log('login landing =>', landing);
  if(!/dashboard|workspace/.test(landing)) throw new Error('LOGIN FAIL: '+landing);
  await rec(1, landing, '登录 Buyer 账号', '进入买家端', 'url='+landing, true, await shot(d,'823_vertical_01_login_1440.png'));

  // STEP 2 — Demand detail (807)
  d.consoleErrors=[]; d.exceptions=[];
  await d.goto(`${BASE}/workspace/demands/${DEMAND_ID}`); await sleep(2000);
  const pb2 = await waitBody(d, 450, 25000, ['807']);
  const demOk = pb2.length>450 && /807|高精度三维扫描仪/.test(pb2) && !/无权访问|此页面无法找到/.test(pb2);
  await rec(2, await d.url(), '打开 807 需求详情', '渲染需求信息(标题/发布状态)', 'len='+pb2.length+' has807='+/807/.test(pb2), demOk, await shot(d,'823_vertical_02_demand_1440.png'), d.consoleErrors.length?d.consoleErrors.slice(-2).join(' | '):undefined);

  // STEP 3 — Match detail (ACCEPTED)
  d.consoleErrors=[]; d.exceptions=[];
  await d.goto(`${BASE}/workspace/matches/${MATCH_ID}`); await sleep(2000);
  const pb3 = await waitBody(d, 450, 25000, ['已接受']);
  const matchOk = pb3.length>450 && /已接受|ACCEPTED/.test(pb3) && /MetroY|高精度三维扫描/.test(pb3);
  await rec(3, await d.url(), '打开 ACCEPTED 匹配详情', '渲染匹配评分/解释/状态', 'len='+pb3.length+' st='+(/已接受/.test(pb3)?'ACCEPTED':'?'), matchOk, await shot(d,'823_vertical_03_match_1440.png'), d.consoleErrors.length?d.consoleErrors.slice(-2).join(' | '):undefined);

  // STEP 4 — RFQ detail (OPEN with ACCEPTED response) -> buyer decision UI evidence
  d.consoleErrors=[]; d.exceptions=[];
  await d.goto(`${BASE}/workspace/rfqs/${RFQ_ID}`); await sleep(2000);
  const pb4 = await waitBody(d, 450, 25000, ['明视工业检测设备有限公司']);
  const rfqOk = /响应审核|响应详情/.test(pb4) && /明视工业检测设备有限公司/.test(pb4) && /已接受|ACCEPTED/.test(pb4);
  await rec(4, await d.url(), '打开 OPEN RFQ 详情(响应审核)', '渲染供应商响应+决策态(ACCEPTED)', 'len='+pb4.length+' hasSup='+/明视工业检测设备有限公司/.test(pb4)+' decided='+/已接受/.test(pb4), rfqOk, await shot(d,'823_vertical_04_rfq_1440.png'), d.consoleErrors.length?d.consoleErrors.slice(-2).join(' | '):undefined);

  // STEP 5 — Role boundary: buyer should NOT access supplier-only route
  d.consoleErrors=[]; d.exceptions=[];
  await d.goto(`${BASE}/workspace/supplier/products`); await sleep(2000);
  const pb5 = await waitBody(d, 200, 15000);
  const blocked = /无权访问|权限不足|404|没有权限|Forbidden|没有权限访问|Access denied|access denied|无权限/.test(pb5) || (await d.url()).includes('/403') || (await d.url()).includes('/unauthorized') || /请登录|需要登录/.test(pb5);
  await rec(5, await d.url(), 'Buyer 越权访问供应商私有页', '被权限拦截(非空白白屏)', 'len='+pb5.length+' blocked='+blocked+' head='+pb5.slice(0,60), blocked, await shot(d,'823_vertical_05_roleboundary_1440.png'), d.consoleErrors.length?d.consoleErrors.slice(-2).join(' | '):undefined);

  console.log('DONE. steps recorded to', LOG);
} catch(e){
  console.error('RUNNER ERR', e);
  writeFileSync(`${OUT}/823_buyer_vertical_error.json`, JSON.stringify({error:String(e)},null,2));
  process.exit(1);
}