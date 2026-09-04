import { Driver, launchChrome, sleep } from '../../../_ux_browser_helper.mjs';
import { mkdirSync, writeFileSync, appendFileSync } from 'node:fs';
const OUT='F:/Desktop/VISNDT/VISNDT/database/_ux_verify/buyer';
const TS=Date.now(); const BASE='http://localhost:3000'; const PORT=9326;
const USER='C:\\Users\\ws_tj\\AppData\\Local\\Temp\\ux-mob-'+TS;
mkdirSync(OUT,{recursive:true});
const PRODUCT='/products/ebb1c034-4280-480b-89ce-29753660e126';
launchChrome(PORT,USER); await sleep(4000);
const d=new Driver(PORT); await d.connect(); d.consoleErrors=[]; d.exceptions=[];
async function hasField(s){return await d.evaluate(`!!document.querySelector(${JSON.stringify(s)})`);}
async function shot(fn){await d.screenshot(`${OUT}/${fn}`);return fn;}
const res=[];
async function go(w,path,name){
  await d.setViewport(w,900); await d.goto(BASE+path); await sleep(2600);
  const ov=await d.hasOverflow();
  const obj={w,name,path,overflow:ov};
  res.push(obj); console.log('  MOB',w,path,'overflow=',ov);
  if(w===375){ let f=await shot(`buyer_mobile_375_${name}.png`); obj.screenshot=f; }
  return obj;
}
try{
  // login for dashboard
  await d.goto(BASE+'/login'); await sleep(5000);
  if(await hasField('#login-email')){
    await d.type('#login-email','demo.buyer.01@visndt.local');
    await d.type('#login-password','demo123456'); await sleep(400);
    await d.submitFormContaining('#login-password');
    for(let i=0;i<10;i++){await sleep(1200); if((await d.url()).includes('/dashboard'))break;}
  }
  const widths=[375,768,1024,1440];
  const pages=[['/dashboard/buyer','dashboard'],['/search?q=%E5%86%85%E7%AA%A5%E9%95%9C','search'],['/login','login'],['/knowledge-base','knowledge'],['/products/ebb1c034-4280-480b-89ce-29753660e126','product']];
  for(const w of widths){ for(const [p,n] of pages){ await go(w,p,n); } }
  const overflowing=res.filter(r=>r.overflow);
  const mobilePass=overflowing.length===0;
  appendFileSync(`${OUT}/buyer_evidence_mobile.jsonl`, JSON.stringify({role:'BUYER',step:'MOBILE',url:BASE,action:'多视口溢出检测',expected:'无横向溢出',actual:JSON.stringify(res.filter(r=>r.overflow)),pass:mobilePass,note:'waves 375/768/1024/1440 over 5 key pages'})+'\n');
  // regenerate summary including mobile
  const fs=await import('node:fs');
  const s=JSON.parse(fs.readFileSync(`${OUT}/buyer_summary.json`,'utf8'));
  s.mobilePass=mobilePass; s.mobileDetails=res; s.screenshots=Array.from(new Set([...(s.screenshots||[]), ...res.filter(r=>r.screenshot).map(r=>r.screenshot)]));
  // add any mobile overflow issues
  for(const o of overflowing){ s.issues.push({severity:o.overflow?'P2':'P0',origin:'PRE-EXISTING',page:BASE+o.path,step:'MOBILE',problem:'horizontal overflow at width '+o.w}); }
  writeFileSync(`${OUT}/buyer_summary.json`, JSON.stringify(s,null,2));
  console.log('MOBILE final pass=',mobilePass,'overflow=',JSON.stringify(overflowing));
}catch(e){console.error('MOB ERR',e);writeFileSync(`${OUT}/buyer_summary.json`,JSON.stringify({role:'BUYER',error:String(e)},null,2));process.exit(1);}