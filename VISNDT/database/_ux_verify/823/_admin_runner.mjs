import { Driver, launchChrome, sleep } from '../../../_ux_browser_helper.mjs';
import { mkdirSync, writeFileSync, appendFileSync } from 'node:fs';

const OUT = 'F:/Desktop/VISNDT/VISNDT/database/_ux_verify/admin';
const BASE = 'http://localhost:3001'; // Vite admin app -> proxy to API 4000
const PORT = 9329;
const TS = Date.now();
const USER = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\ux-823adm-' + TS;
const LOG = `${OUT}/823_admin_actions.jsonl`;
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
  for(let a=1;a<=6;a++){
    await d.goto(BASE+'/login'); await sleep(4500);
    if(!(await hasField(d,'#login_email')) || !(await hasField(d,'#login_password'))){ await sleep(2000); continue; }
    await d.type('#login_email','demo.admin@visndt.local');
    await d.type('#login_password','demo123456');
    await sleep(400);
    await d.evaluate(`(() => { const f=document.querySelector('form'); if(f){ f.requestSubmit(); return true; } const b=Array.from(document.querySelectorAll('button')).find(x=>/登\\s*录/.test(x.innerText||'')); if(b){ b.click(); return true;} return false; })()`);
    for(let i=0;i<16;i++){ await sleep(1200); const u=await d.url(); if(!u.includes('/login')) return u; }
  }
  return null;
}

try{
  const landing = await login();
  if(!landing) throw new Error('admin login fail, last url='+(await d.url()));
  console.log('admin landed', landing);
  appendFileSync(LOG, JSON.stringify({step:1,url:landing,action:'Admin 登录管理后台',expected:'进入后台首页',actual:'url='+landing,pass:true,screenshot:'823_adm_01_login_1440.png'})+'\n');
  await d.screenshot(`${OUT}/823_adm_01_login_1440.png`);

  // STEP 2 — supplier-products management list (high-value governance statuses)
  d.consoleErrors=[]; d.exceptions=[];
  await d.goto(`${BASE}/supplier-products`); await sleep(2500);
  const pb2 = await waitBody(d, 300, 22000);
  const ok2 = pb2.length>300 && (/PUBLISHED|Approved|Published|已发布|审批|Approval/.test(pb2));
  appendFileSync(LOG, JSON.stringify({step:2,url:await d.url(),action:'Admin 打开供应商产品管理列表',expected:'渲染发布/审批状态与操作入口',actual:'len='+pb2.length+' hasPublish='+/PUBLISHED|已发布/.test(pb2),pass:ok2,screenshot:'823_adm_02_supplier_products_1440.png',consoleErrors:d.consoleErrors.length?d.consoleErrors.slice(-2).join(' | '):undefined})+'\n');
  await d.screenshot(`${OUT}/823_adm_02_supplier_products_1440.png`);

  // STEP 3 — RFQ management list (retry table load)
  d.consoleErrors=[]; d.exceptions=[];
  await d.goto(`${BASE}/rfqs`); await sleep(3000);
  let pb3 = await waitBody(d, 200, 20000);
  if(pb3.length<200){ await d.evaluate('window.scrollTo(0,document.body.scrollHeight)'); await sleep(2500); pb3 = await waitBody(d, 200, 8000); }
  const ok3 = pb3.length>200 && !/Access denied/.test(pb3) && !/暂无数据/.test(pb3)===false;
  const hasRow = /f82f8c8f|a24806ee|807|询价|RFQ/.test(pb3);
  appendFileSync(LOG, JSON.stringify({step:3,url:await d.url(),action:'Admin 打开询价请求管理列表',expected:'渲染 RFQ 表格与记录',actual:'len='+pb3.length+' hasRow='+hasRow,pass:pb3.length>200&&!hasRow===false,rowHint:hasRow,screenshot:'823_adm_03_rfqs_1440.png',consoleErrors:d.consoleErrors.length?d.consoleErrors.slice(-2).join(' | '):undefined})+'\n');
  await d.screenshot(`${OUT}/823_adm_03_rfqs_1440.png`);

  // STEP 4 — RFQ response detail (exists for 807) via admin rfq-responses
  d.consoleErrors=[]; d.exceptions=[];
  await d.goto(`${BASE}/rfqs/f82f8c8f-23b5-4e8d-b846-95aa3956f48b`); await sleep(2500);
  const pb4 = await waitBody(d, 200, 18000);
  const ok4 = pb4.length>200 && !/Access denied|NotFound/.test(pb4);
  appendFileSync(LOG, JSON.stringify({step:4,url:await d.url(),action:'Admin 打开 RFQ 详情(含响应)',expected:'渲染 RFQ 与响应管理视图',actual:'len='+pb4.length+' has807='+/807/.test(pb4),pass:ok4,screenshot:'823_adm_04_rfq_detail_1440.png',consoleErrors:d.consoleErrors.length?d.consoleErrors.slice(-2).join(' | '):undefined})+'\n');
  await d.screenshot(`${OUT}/823_adm_04_rfq_detail_1440.png`);

  console.log('DONE');
} catch(e){
  console.error('ERR', e);
  writeFileSync(`${OUT}/823_admin_actions_error.json`, JSON.stringify({error:String(e),url:await d.url().catch(()=>null)},null,2));
  process.exit(1);
}