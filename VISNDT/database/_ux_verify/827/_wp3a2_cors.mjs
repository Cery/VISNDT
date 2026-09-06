import { Driver, launchChrome, sleep } from '../../../_ux_browser_helper.mjs';
const BASE='http://localhost:3000', PORT=9338, UD='.edge-cdp-828e';
const d=new Driver(PORT); launchChrome(PORT,UD);
await d.connect(); await sleep(1200);
await d.setViewport(1440,900);
await d.goto(`${BASE}/`); await d.waitFor(`document.body`,8000); await sleep(800);
// 在已导航页面执行跨域 fetch，看 CORS 是否真正放行 credentialed 请求
const r = await d.evaluate(`fetch('http://localhost:4000/api/v1/products?page=1&pageSize=12&status=ACTIVE', {credentials:'include'}).then(async res=>({status:res.status, acao:res.headers.get('access-control-allow-origin'), acac:res.headers.get('access-control-allow-credentials'), ok:res.ok})).catch(e=>'FETCH_ERR:'+e)`);
console.log('in-page credentialed products fetch =>', JSON.stringify(r));
// 再看 /products 页面等待真实数据的表现
await d.goto(`${BASE}/products`); await d.waitFor(`document.body`,8000);
for (const t of [1000, 2000, 4000]) { await sleep(t===1000?1000:t-1000); const s=await d.evaluate(`({cards:document.querySelectorAll('a[href^="/products/"]').length, empty:(document.body.innerText||'').includes('暂无注册能力'), err:(document.body.innerText||'').includes('加载产品失败'), load:(document.body.innerText||'').includes('注册表正在建设')})`); console.log(`products @sleep ${t}:`, JSON.stringify(s)); }
process.exit(0);