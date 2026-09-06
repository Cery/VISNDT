import { Driver, launchChrome, sleep } from '../../../_ux_browser_helper.mjs';
const BASE='http://localhost:3000', PORT=9343, UD='.edge-cdp-828j';
const d=new Driver(PORT); launchChrome(PORT,UD);
await d.connect(); await sleep(1200);
await d.setViewport(375,800);
// 375 categories overflow
await d.goto(`${BASE}/categories`); await d.waitFor(`document.querySelector('header')`,15000); await sleep(2000);
const ov = await d.evaluate(`(() => {
  const doe=document.documentElement;
  const docW=doe.scrollWidth, clientW=doe.clientWidth;
  const offenders=[];
  document.querySelectorAll('*').forEach(el=>{
    const r=el.getBoundingClientRect();
    if (r.right > clientW + 2) offenders.push((el.tagName+'.'+(el.className&&String(el.className).slice(0,30))+' r='+Math.round(r.right)));
  });
  return {docW, clientW, overflow: docW>clientW+1, cnt: offenders.length, first10: offenders.slice(0,10)};
})()`);
console.log('375 categories overflow =>', JSON.stringify(ov,null,1));

// 375 products filter button
await d.goto(`${BASE}/products`); await d.waitFor(`document.querySelector('header')`,15000); await sleep(1800);
const fb = await d.evaluate(`(() => {
  const btns=Array.from(document.querySelectorAll('button'));
  const allScreen=btns.map(b=>(b.innerText||'').trim().replace(/\s+/g,'|')).filter(t=>t.includes('筛选')).slice(0,10);
  const mobileBtn=btns.find(b=>/^筛选/.test((b.innerText||'').trim()) && getComputedStyle(b).display!=='none');
  return {screen:[...new Set(allScreen)], mobileBtnText: mobileBtn?(mobileBtn.innerText||'').trim():'(none)', mobileVisible: mobileBtn? getComputedStyle(mobileBtn).display!=='none':false};
})()`);
console.log('375 products filter btn =>', JSON.stringify(fb,null,1));
process.exit(0);