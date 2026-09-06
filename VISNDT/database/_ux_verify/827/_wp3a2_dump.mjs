import { Driver, launchChrome, sleep } from '../../../_ux_browser_helper.mjs';
const BASE='http://localhost:3000', PORT=9339, UD='.edge-cdp-828f';
const d=new Driver(PORT); launchChrome(PORT,UD);
await d.connect(); await sleep(1200);
await d.setViewport(1440,900);
await d.goto(`${BASE}/products`); await d.waitFor(`document.body`,8000); await sleep(3500);
const out = await d.evaluate(`(() => {
  const anchors = Array.from(document.querySelectorAll('a[href]')).map(a=>a.getAttribute('href')).filter(h=>h && (h.startsWith('/products') || h.includes('categoryId')));
  const monoTotal = document.querySelector('[class*="tabular-nums"]')?.textContent;
  const h1 = document.querySelector('h1')?.textContent;
  const catRail = Array.from(document.querySelectorAll('button')).map(b=>b.textContent.trim()).filter(t=>t.includes('检测能力')).slice(0,6);
  const resultLine = Array.from(document.querySelectorAll('p,span,div')).map(e=>e.textContent).find(t=>t && /共\\s*[\\d,]+\\s*项注册能力/.test(t))||null;
  return { h1:h1??null, monoTotal:monoTotal??null, resultLine:resultLine??null, catRail, anchors };
})()`);
console.log(JSON.stringify(out,null,2));
process.exit(0);