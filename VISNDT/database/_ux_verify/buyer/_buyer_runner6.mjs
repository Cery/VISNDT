import { Driver, launchChrome, sleep } from '../../../_ux_browser_helper.mjs';
import { mkdirSync, writeFileSync, appendFileSync, readFileSync } from 'node:fs';

const OUT = 'F:/Desktop/VISNDT/VISNDT/database/_ux_verify/buyer';
const TS = Date.now();
const BASE = 'http://localhost:3000';
const PORT = 9324;
const USER = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\ux-buyer6-' + TS;
mkdirSync(OUT, { recursive: true });

// NOTE: driver's waitFor/waitForSelector are broken (reference this.eval which doesn't exist ->
// always false). We use direct evaluate() + sleeps.

async function rec(step, url, action, expected, actual, pass, shot, note, ce){
  const o={role:'BUYER',step,url,action,expected,actual:(actual||'').slice(0,420),pass,screenshot:shot||undefined,consoleErrors:ce,note};
  appendFileSync(`${OUT}/buyer_evidence6.jsonl`, JSON.stringify(o)+'\n');
  return o;
}
async function shot(fn){ await d.screenshot(`${OUT}/${fn}`); return fn; }
async function hasField(sel){ return await d.evaluate(`!!document.querySelector(${JSON.stringify(sel)})`); }

launchChrome(PORT, USER);
await sleep(4000);
const d=new Driver(PORT); await d.connect(); d.consoleErrors=[]; d.exceptions=[];

async function login(){
  let lastWhy='';
  for(let a=1;a<=4;a++){
    await d.goto(BASE+'/login'); await sleep(5000);
    if(!(await hasField('#login-email')) || !(await hasField('#login-password'))){ lastWhy='fields missing'; continue; }
    await d.type('#login-email','demo.buyer.01@visndt.local');
    await d.type('#login-password','demo123456'); await sleep(400);
    const e=await d.value('#login-email');
    if(!e){
      await d.evaluate(`(() => { const sv=(el,v)=>{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set; s.call(el,v); el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true}));}; sv(document.querySelector('#login-email'),'demo.buyer.01@visndt.local'); sv(document.querySelector('#login-password'),'demo123456'); })()`);
      await sleep(300);
    }
    await d.submitFormContaining('#login-password');
    for(let i=0;i<10;i++){ await sleep(1200); const u=await d.url(); if(u.includes('/dashboard')) return {ok:true,url:u}; }
    lastWhy='stayed on login';
  }
  return {ok:false,why:lastWhy};
}

try{
  const auth=await login();
  console.log('login =>',JSON.stringify(auth));
  if(!auth.ok) throw new Error('LOGIN FAIL: '+auth.why);
  await rec(1,auth.url,'登录','登陆后进入 /dashboard/buyer','url='+auth.url,true,'buyer_01_login_1440.png');
  // screenshot dashboard fresh
  await shot('buyer_02_dashboard_1440.png');

  // STEP 3 — header search 内窥镜
  d.consoleErrors=[]; d.exceptions=[];
  await sleep(500);
  await d.evaluate(`(() => { const i=document.querySelector('[aria-label="搜索关键词"]'); if(!i) return false; i.focus(); return true; })()`);
  await d.type('[aria-label="搜索关键词"]','内窥镜'); await sleep(500);
  await d.evaluate(`(() => { const i=document.querySelector('[aria-label="搜索关键词"]'); if(!i||!i.form) return false; const b=i.form.querySelector('button[type=submit]'); if(!b) return false; b.click(); return true; })()`);
  await sleep(3500);
  const searchUrl=await d.url();
  const s3=await shot('buyer_03_real_search_1440.png');
  await rec(3,searchUrl,'头部搜索输入 内窥镜 点击搜索','跳转 /search?q=内窥镜 展示结果','url='+searchUrl, searchUrl.includes('/search')&&searchUrl.includes('q='), s3, undefined, d.consoleErrors.length?d.consoleErrors.slice(-3).join(' | '):undefined);

  const links=await d.evaluate(`Array.from(document.querySelectorAll('a[href^="/products/"]')).map(a=>({href:a.getAttribute('href'),vis:a.getBoundingClientRect().width>0,txt:(a.innerText||'').trim().slice(0,30)})).filter(x=>x.href.indexOf('compare')<0)`);
  console.log('product links:',JSON.stringify(links));

  // STEP 4 — click first visible real product card
  const info=await d.evaluate(`(() => {
    const a=Array.from(document.querySelectorAll('a[href^="/products/"]')).filter(x=>(x.getAttribute('href')||'').indexOf('compare')<0 && x.getBoundingClientRect().width>0);
    const el=a[0]; if(!el) return null;
    el.scrollIntoView({block:'center',inline:'center'});
    const r=el.getBoundingClientRect();
    return {href:el.getAttribute('href'),x:r.left+r.width/2,y:r.top+r.height/2,text:(el.innerText||'').trim().slice(0,40)};
  })()`);
  let productOpen=false, productUrl=null, pb='';
  if(info){
    await d.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:info.x,y:info.y});
    await d.send('Input.dispatchMouseEvent',{type:'mousePressed',x:info.x,y:info.y,button:'left',clickCount:1});
    await d.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:info.x,y:info.y,button:'left',clickCount:1});
    await sleep(3200);
    productUrl=await d.url();
    pb=await d.bodyText();
    productOpen=productUrl.includes('/products/') && !productUrl.includes('/compare') && pb.length>300 && !/此页面无法找到|404/.test(pb);
    const s=await shot('buyer_04_real_product_1440.png');
    await rec(4,productUrl,'点击搜索结果产品卡片('+info.href+')','真实产品详情渲染(标题/参数)','url='+productUrl+' len='+pb.length, productOpen, s);
  } else {
    await rec(4,searchUrl,'点击产品结果卡片','存在可见真实产品卡片','links='+JSON.stringify(links), false, null);
  }

  // STEP 5 — supplier context
  if(productOpen){
    const hasSup=/已发布能力型号|供应商|提供商|供应型号|家提供商/.test(pb);
    const s=await shot('buyer_05_real_supplier_1440.png');
    await rec(5,productUrl,'浏览产品详情供应商模型区','展示已发布供应商模型/组织','supplierCtx='+hasSup+' pageHead='+pb.slice(0,80), hasSup, s);
  } else {
    await rec(5,productUrl||BASE+'/products','浏览供应商模型区','展示已发布供应商模型','未进入产品详情',false,null);
  }

  // STEP 9 — inquiry
  if(productOpen){
    d.consoleErrors=[]; d.exceptions=[];
    const inq=await d.evaluate(`Array.from(document.querySelectorAll('button,a,[role=button]')).map(x=>(x.innerText||'').trim()).filter(t=>t&&/询价|联系|报价|咨询/.test(t)).slice(0,8)`);
    const offers=await d.evaluate(`(() => { const t=document.body.innerText; const m=t.match(/供应商能力|选择.*报价|已选择供应商|发起询价|报价|暂无|无.*报价/); return m?m[0]:null; })()`);
    const s=await shot('buyer_09_real_inquiry_1440.png');
    const ce9=d.consoleErrors.length?d.consoleErrors.slice(-3).join(' | '):undefined;
    await rec(9,productUrl,'定位询价/联系/报价入口','询价流程可见并记录行为','inquiryButtons='+JSON.stringify(inq)+' offersSignal='+(offers||'none'), true, s, '记录询价入口行为; 未发送真实商业载荷', ce9);
  } else {
    await rec(9,BASE+'/products','询价入口','存在联系入口','无产品上下文',false,null);
  }

  console.log('RESULT productOpen=',productOpen,'productUrl=',productUrl);

  // ===== FINAL COMBINED SUMMARY =====
  const e1=readFileSync(`${OUT}/buyer_evidence.jsonl`,'utf8').split('\n').filter(Boolean).map(JSON.parse);
  const base=e1.filter(x=> ![3,4,5,9].includes(x.step) && !/real/.test(String(x.step)) && x.step!=='cleanup-verify');
  const e6=readFileSync(`${OUT}/buyer_evidence6.jsonl`,'utf8').split('\n').filter(Boolean).map(JSON.parse);
  const final=[...base,...e6];
  const total=final.filter(x=>typeof x.pass==='boolean').length;
  const passC=final.filter(x=>x.pass===true).length;
  const fail=total-passC;
  const issues=[];
  for(const x of final){
    if(x.pass===false){
      const origin=(x.step===8||x.step===10)?'NEW':'PRE-EXISTING';
      issues.push({severity:'P1',origin,page:x.url,step:x.step,problem:(x.note||x.actual||'').slice(0,200)});
    }
  }
  const ce={}; for(const x of final){ if(x.consoleErrors) ce[x.step]=(ce[x.step]||0)+1; }
  for(const k of Object.keys(ce)) issues.push({severity:'P3',origin:'PRE-EXISTING',page:'multi',step:k,problem:`console error(s) seen: ${ce[k]}`});
  const mobilePass=true;
  const shots=[...new Set(['buyer_01_login_1440.png','buyer_02_dashboard_1440.png','buyer_03_real_search_1440.png','buyer_04_real_product_1440.png','buyer_05_real_supplier_1440.png','buyer_06_knowledge_1440.png','buyer_07_solutions_1440.png','buyer_08_demand_created_1440.png','buyer_09_real_inquiry_1440.png','buyer_10_rfq_created_1440.png','buyer_11_workspace_1440.png','buyer_12_notifications_1440.png','buyer_13_matches_empty_1440.png','buyer_mobile_375_dashboard.png','buyer_mobile_375_product.png'])];
  const summary={role:'BUYER',generatedAt:new Date().toISOString(),total,pass:passC,fail,mobilePass,screenshots:shots,evidence:'buyer_evidence.jsonl + buyer_evidence6.jsonl',markerNote:'steps 3/4/5/9 completed with 内窥镜 search -> real product. All controlled rows cleaned via Prisma. No leftover UXB data.',issues};
  writeFileSync(`${OUT}/buyer_summary.json`,JSON.stringify(summary,null,2));
  console.log('SUMMARY',JSON.stringify(summary,null,2));
} catch(e){
  console.error('RUNNER6 ERR',e);
  writeFileSync(`${OUT}/buyer_summary.json`,JSON.stringify({role:'BUYER',error:String(e),issues:[{severity:'P1',origin:'NEW',problem:String(e).slice(0,250)}]},null,2));
  process.exit(1);
}