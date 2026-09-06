import { Driver, launchChrome, sleep } from '../../../_ux_browser_helper.mjs';
const BASE='http://localhost:3000', PORT=9337, UD='.edge-cdp-828d';
const d=new Driver(PORT); launchChrome(PORT, UD);
await d.connect(); await sleep(1200);
await d.setViewport(1440,900);

async function dump(label, expr){
  const v = await d.evaluate(expr).catch(e=>'EVAL_ERR:'+String(e));
  console.log(`\n## ${label}\n${JSON.stringify(v,null,0)}`);
}
await dump('API health via fetch', `fetch('/api/v1/health').then(r=>r.status+ ' : '+ (r.ok? '':'')+' : '+r.text().slice(0,0)).catch(e=>'ERR:'+e)`);
// products page anchors + text markers
await d.goto(`${BASE}/products`); await d.waitFor(`document.body`,8000); await sleep(1800);
await dump('/products anchors', `Array.from(document.querySelectorAll('a')).map(a=>a.getAttribute('href')).filter(h=>h&&h.startsWith('/products'))`);
await dump('/products markers', `({found:(document.body.innerText||'').includes('未找到匹配能力'), empty:(document.body.innerText||'').includes('暂无注册能力'), total:((document.body.innerText||'').match(/共\\s*([\\d,]+)\\s*项注册能力/)||[])[1], hasSelect:!!document.querySelector('select[aria-label="排序方式"]'), hasPagination:!!document.querySelector('nav[aria-label="分页"]')})`);
// categories
await d.goto(`${BASE}/categories`); await d.waitFor(`document.body`,8000); await sleep(1800);
await dump('/categories cat links', `Array.from(document.querySelectorAll('a[href^="/products?categoryId="]')).length`);
await dump('/categories markers', `({empty:(document.body.innerText||'').includes('暂无分类'), error:(document.body.innerText||'').includes('加载分类失败')})`);
// search page after typed submit
await d.goto(`${BASE}/search`); await d.waitFor(`document.body`,8000); await sleep(900);
await d.evaluate(`(()=>{const i=document.querySelector('input'); if(i) i.focus();})()`);
await d.send('Input.insertText',{text:'超声'}); await sleep(400);
await d.evaluate(`(()=>{const i=document.querySelector('input'); const f=i&&i.closest('form'); const b=f&&f.querySelector('button[type=submit]'); if(b) b.click();})()`);
await sleep(3500);
await dump('/search after submit', `({path:location.pathname, search:location.search, hasCommon:(document.body.innerText||'').includes('共找到'), qInUrl:location.search.includes('q=')})`);
await dump('/search product anchors', `Array.from(document.querySelectorAll('a')).map(a=>a.getAttribute('href')).filter(h=>h&&h.startsWith('/products/')).slice(0,5)`);
process.exit(0);