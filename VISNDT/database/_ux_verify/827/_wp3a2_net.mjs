import { Driver, launchChrome, sleep } from '../../../_ux_browser_helper.mjs';
const BASE='http://localhost:3000', PORT=9340, UD='.edge-cdp-828g';
const d=new Driver(PORT); launchChrome(PORT,UD);
await d.connect(); await sleep(1200);
await d.setViewport(1440,900);
await d.goto(`${BASE}/products`); await d.waitFor(`document.body`,8000); await sleep(3500);
const out = await d.evaluate(`(() => ({
  apiResources: performance.getEntriesByType('resource').map(r=>r.name).filter(n=>/api|4000|:8080|visndt|8000/.test(n)).slice(0,20),
  failedResources: performance.getEntriesByType('resource').filter(r=>r.transferSize===0).map(r=>r.name).filter(n=>/api|:/.test(n)).slice(0,20)
}))()`);
console.log(JSON.stringify(out,null,2));
process.exit(0);