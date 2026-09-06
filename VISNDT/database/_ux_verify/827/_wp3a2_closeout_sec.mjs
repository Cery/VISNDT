// 829 Closeout gate - browser security + regression for SEC-828-P0-01 / ENV-828-E1
// Real HEADED Chrome. Verifies /products /search /categories rendering and confirms
// NO credential material in the running-API responses as observed from the browser context.
import { Driver, launchChrome, sleep } from '../../../_ux_browser_helper.mjs';

const BASE = 'http://localhost:3000';
const API = 'http://localhost:4000/api/v1';
const PORT = 9366;
const UD = '.edge-cdp-829';
const SHOTS = 'F:/Desktop/VISNDT/VISNDT/database/_ux_verify/827';

async function until(d, expr, ms = 9000, step = 250) {
  const t0 = Date.now(); let last = null;
  while (Date.now() - t0 < ms) { last = await d.evaluate(expr).catch(() => null); if (last) return last; await sleep(step); }
  return last;
}

const results = [];
function record(page, action, expected, actual, pass, note = '') {
  results.push({ pass: !!pass });
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${page} | ${action} | ${expected} => ${actual}${note ? ' | ' + note : ''}`);
}

// Browser-context fetch of the REAL running API; returns credential scan result for createdBy.
async function credScan(d, url) {
  return d.evaluate(`(async () => {
    const r = await fetch(${JSON.stringify(url)}, { credentials: 'include' });
    const j = await r.json();
    const items = (j.data && Array.isArray(j.data.data)) ? j.data.data : (Array.isArray(j.data) ? j.data : []);
    if (!items.length) return { status: r.status, count: items.length, createdByKeys: '(no items)', creds: [] };
    const cb = items[0].createdBy || {};
    const creedsT = JSON.stringify(j).match(/passwordHash|hashedPassword|\"password\"|\\\"salt\\\"|refreshToken|accessToken|\"secret\"|hashedPassword/g);
    return {
      status: r.status, count: items.length,
      itemKeys: Object.keys(items[0] || {}).join(','),
      createdByKeys: Object.keys(cb).join(','),
      creds: creedsT ? Array.from(creedsT) : [],
    };
  })()`);
}

(async () => {
  const pid = launchChrome(PORT, UD);
  const d = new Driver(PORT);
  await d.connect(); await sleep(1200);

  // ---------- 1. /products : security + render ----------
  await d.setViewport(1440, 900);
  await d.goto(`${BASE}/products`); await d.waitFor(`!!document.querySelector('header')`, 15000); await sleep(900);
  const scan = await credScan(d, `${API}/products?status=ACTIVE&page=1&pageSize=5`);
  record('Products', 'API Security (browser-context)', 'passwordHash ABSENT', `status=${scan.status} creds=[${scan.creds.join(',')}] cbKeys=${scan.createdByKeys}`, scan.status === 200 && !scan.creds.length && !scan.createdByKeys.includes('passwordHash'));
  const cards = await until(d, `document.querySelectorAll('a[href^="/products/"]').length > 0`, 9000);
  const productsStyle = !!await d.evaluate(`(() => { const c=document.querySelector('a[href^="/products/"]'); return c ? getComputedStyle(c).fontFamily.length>0 : false; })()`);
  record('Products', '1440 product cards render', 'cards present', `${cards} cards`, !!cards, '§19');
  record('Responsive', '1440 products no overflow', 'none', await d.hasOverflow(), !(await d.hasOverflow()));
  await d.screenshot(`${SHOTS}/829_products_security_1440.png`);

  // 375 products
  await d.setViewport(375, 812); await d.goto(`${BASE}/products`); await d.waitFor(`!!document.querySelector('header')`, 15000); await sleep(900);
  record('Responsive', '375 products render + no overflow', 'none', await d.hasOverflow(), !(await d.hasOverflow()));

  // ---------- 2. /search ----------
  await d.setViewport(1440, 900); await d.goto(`${BASE}/search?q=内窥镜`); await d.waitFor(`!!document.querySelector('header')`, 15000); await sleep(900);
  const scanS = await credScan(d, `${API}/search?q=${encodeURIComponent('内窥镜')}`);
  record('Search', 'API Security (browser-context)', 'no creds', `status=${scanS.status} creds=[${scanS.creds.join(',')}]`, scanS.status === 200 && !scanS.creds.length);
  const sres = await until(d, `document.body.innerText.includes('共找到')`, 9000);
  record('Search', '1440 results render', 'summary + results', `res=${!!sres}`, !!sres);
  await d.screenshot(`${SHOTS}/829_search_1440.png`);
  // search submission flow
  await d.goto(`${BASE}/search`); await d.waitFor(`!!document.querySelector('header')`, 15000); await sleep(600);
  const typed = await d.evaluate(`(async () => { const i=document.querySelector('input[aria-label="搜索关键词"], input[type="search"], input'); if(!i) return 'no-input'; const se=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set; se.call(i,'内窥镜'); i.dispatchEvent(new Event('input',{bubbles:true})); i.dispatchEvent(new Event('change',{bubbles:true})); const f=i.closest('form'); const b=f&&f.querySelector('button[type=submit]'); if(b) b.click(); return 'typed'; })()`);
  const sdest = await until(d, `location.pathname === '/search' && location.search.includes('q=')`, 8000);
  record('Search', 'form submit -> /search?q=', 'route', `${typed}|q=${await d.evaluate('location.search')}`, !!sdest, '§10');

  // ---------- 3. /categories ----------
  await d.goto(`${BASE}/categories`); await d.waitFor(`!!document.querySelector('header')`, 15000);
  const cats = await until(d, `document.querySelectorAll('a[href^="/products?categoryId="]').length`, 9000);
  record('Categories', '1440 category cards', 'categoryId links', `${cats} cards`, Number(cats) > 0, '§10');
  record('Responsive', '1440 categories no overflow', 'none', await d.hasOverflow(), !(await d.hasOverflow()));
  await d.screenshot(`${SHOTS}/829_categories_1440.png`);
  // navigation category -> products
  const catHref = await d.evaluate(`(() => { const a=document.querySelector('a[href^="/products?categoryId="]'); return a?a.getAttribute('href'):''; })()`);
  if (catHref) { await d.click(`a[href="${catHref}"]`); await sleep(2000); }
  const catDest = await d.evaluate(`location.pathname + location.search`);
  record('Categories', 'category -> /products?categoryId=', 'route', catDest, catDest.startsWith('/products?categoryId='));
  // 375 categories
  await d.setViewport(375, 812); await d.goto(`${BASE}/categories`); await d.waitFor(`!!document.querySelector('header')`, 15000); await sleep(900);
  record('Responsive', '375 categories no overflow', 'none', await d.hasOverflow(), !(await d.hasOverflow()));

  // ---------- console errors ----------
  await sleep(800);
  record('Console', 'no console.error during all pages', 'no errors', `${d.consoleErrors.length} err(s) [${d.consoleErrors.slice(0,3).join('; ')}]`, d.consoleErrors.length === 0);

  const passed = results.filter((r) => r.pass).length;
  const failed = results.length - passed;
  console.log(`\n=== RESULT: ${passed}/${results.length} PASS, ${failed} FAIL ===`);
  await sleep(300);
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error('SCRIPT ERR', e); process.exit(2); });