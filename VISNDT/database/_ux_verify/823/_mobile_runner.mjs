// 823 Mobile regression: RFQ/Response/Offer core pages at 375/768 viewports.
import { launchChrome, Driver, sleep } from 'file:///F:/Desktop/VISNDT/VISNDT/_ux_browser_helper.mjs';
import { mkdirSync, appendFileSync } from 'node:fs';
const BASE='http://localhost:3000';
const RFQ='a24806ee-a967-463d-928c-db929dd6de68';
const OUT='F:/Desktop/VISNDT/VISNDT/database/_ux_verify/admin/823_mobile.jsonl';
const SHOT='F:/Desktop/VISNDT/VISNDT/database/_ux_verify/823/shots';
mkdirSync(SHOT,{recursive:true});

async function waitBody(d,minLen=100,timeout=25000,minText=[]){
  const t0=Date.now();
  while(Date.now()-t0<timeout){
    try{ const t=await d.bodyText(); if(t.length>=minLen && minText.every(k=>t.includes(k))) return t; }catch{}
    await sleep(1500);
  }
  return await d.bodyText();
}
function rec(role,page,width,pass,detail){
  const o={step:role+'/'+width+'/px',page,viewport:width,pass,detail:(detail||'').slice(0,120)};
  appendFileSync(OUT,JSON.stringify(o)+'\n');
  console.log((pass?'✓':'✗'),role,width+'px',page,'->',detail);
}

// login helper shared
async function login(d,email,pwd){
  for(let a=1;a<=6;a++){
    await d.goto(BASE+'/login'); await sleep(4000);
    const eOk=await d.waitFor(`!!document.querySelector('#login-email') && !!document.querySelector('#login-password')`,12000);
    if(!eOk){ continue; }
    await d.type('#login-email',email); await d.type('#login-password',pwd); await sleep(300);
    await d.submitFormContaining('#login-password');
    for(let i=0;i<16;i++){ await sleep(1200); const u=await d.url(); if(!u.includes('/login')) return (await d.url()); }
  }
  return null;
}

const chrome=launchChrome(9229,'f:/Desktop/VISNDT/VISNDT/database/_ux_verify/823/chrome_mobile');
const d=new Driver(9229); await d.connect();

// 1) Buyer RFQ detail (RFQ + Responses)
const buyUrl=await login(d,'demo.buyer.01@visndt.local','demo123456');
console.log('buyer login ->',buyUrl);
for(const w of [375,768]){
  await d.setViewport(w,800);
  await d.goto(BASE+`/workspace/rfqs/${RFQ}`); await sleep(6000);
  const t=await waitBody(d,120,25000,['询价','RFQ'] );
  const overflow=await d.hasOverflow();
  const shot=await d.screenshot(`${SHOT}/buyer_rfq_${w}.png`);
  rec('buyer','/workspace/rfqs/[id]',w,(t.length>120&&!overflow),`len=${t.length} hscroll=${overflow} shot=${shot}`);
}

// 2) Supplier RFQ detail (RFQ + Responses + Offer CTA)
await d.goto(BASE+'/logout').catch(()=>{}); await sleep(1500);
const supUrl=await login(d,'demo.supplier.01@visndt.local','demo123456');
console.log('supplier login ->',supUrl);
for(const w of [375,768]){
  await d.setViewport(w,800);
  await d.goto(BASE+`/workspace/supplier/rfqs/${RFQ}`); await sleep(6000);
  const t=await waitBody(d,120,25000,['询价'] );
  const overflow=await d.hasOverflow();
  const shot=await d.screenshot(`${SHOT}/supplier_rfq_${w}.png`);
  rec('supplier','/workspace/supplier/rfqs/[id]',w,(t.length>120&&!overflow),`len=${t.length} hscroll=${overflow} shot=${shot}`);
}

process.exit(0);