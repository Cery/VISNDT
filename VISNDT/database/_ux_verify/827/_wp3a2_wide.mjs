import { Driver, launchChrome, sleep } from '../../../_ux_browser_helper.mjs';
const BASE='http://localhost:3000', PORT=9341, UD='.edge-cdp-828h';
const d=new Driver(PORT); launchChrome(PORT,UD);
await d.connect(); await sleep(1200);
await d.setViewport(1440,900);
async function probe(label, path){
  await d.goto(`${BASE}${path}`); await d.waitFor(`document.body`,8000); await sleep(3500);
  const o = await d.evaluate(`(() => ({
    api: performance.getEntriesByType('resource').map(r=>r.name).filter(n=>/4000|api\\/v1/.test(n)).slice(0,8),
    h1: (document.querySelector('h1')||{}).textContent||null,
    productLinks: document.querySelectorAll('a[href^="/products/"]').length,
    catLinks: document.querySelectorAll('a[href^="/products?categoryId="]').length,
    hasError: /加载失败|暂不可用/.test(document.body.innerText||'')
  }))()`);
  console.log(`\n## ${label} ${path}\n`, JSON.stringify(o,null,1));
}
await probe('HOME','/');
await probe('PRODUCTS','/products');
await probe('CATEGORIES','/categories');
process.exit(0);