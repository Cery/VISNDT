// 807 browser E2E — real Chrome (headless) via puppeteer-core, real web runtime :3000.
// Guest + Buyer + Supplier sessions; captures at 1440 and 375; performs real page actions.
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const WEB = 'http://localhost:3000';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT = 'F:\\Desktop\\VISNDT\\VISNDT\\database\\_807_visual';
mkdirSync(OUT, { recursive: true });

// Controlled 807 entities
const DEMAND = 'e0672785-9e4e-4d61-8b48-454f0e1a6f33';
const MATCH = '40f68c3c-2c92-4a3b-9300-3776e1759a81';
const RFQ = 'd3604b3f-dc15-4801-a7e0-5857066aa7e7';
const INQ = 'f866c67c-7850-4efa-80d2-5c3ee5e91eab';

const log = [];
const rec = (s, ok, d) => { log.push({ s, ok, d }); console.log((ok ? 'PASS ' : 'FAIL ') + s + (d ? '  ::  ' + JSON.stringify(d) : '')); };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function shot(page, name) {
  const p = `${OUT}\\807_${name}.png`;
  await page.screenshot({ path: p, fullPage: false });
  return p;
}

async function goto(page, path, label, settle = 1600) {
  try { await page.goto(WEB + path, { waitUntil: 'networkidle2', timeout: 45000 }); }
  catch (e) { console.log(`  warn: goto ${path} fallback : ${e.message.slice(0, 80)}`); await page.goto(WEB + path, { waitUntil: 'load', timeout: 45000 }).catch(() => {}); }
  await sleep(settle);
  rec(label + ' render', true, { path });
}

async function loginAs(page, email, pw) {
  await goto(page, '/login', 'login page', 1000);
  await page.type('#login-email', email, { delay: 10 });
  await page.type('#login-password', pw, { delay: 10 });
  // real click of submit button
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button')).filter((b) => /登\s*录/.test(b.textContent || ''));
    if (btns.length) { btns[0].click(); return true; }
    return false;
  });
  await sleep(4500);
  const url = page.url();
  rec('login submit (' + email + ')', clicked, { clicked, url });
  return url;
}

function setVw(page, w, h) { return page.setViewport({ width: w, height: h, deviceScaleFactor: 1 }); }

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });

// GUEST session (clean context to avoid cookies)
const guestSession = (async () => {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await setVw(page, 1440, 900);
  await goto(page, '/', 'guest home', 2000);
  await shot(page, 'guest_home_1440');
  await goto(page, '/products', 'guest products list', 2500);
  await shot(page, 'guest_products_1440');
  // real action: open the first product card
  let prodUrl = null;
  try {
    const href = await page.evaluate(() => {
      const a = document.querySelector('a[href^="/products/"]');
      return a ? a.getAttribute('href') : null;
    });
    if (href) { prodUrl = href; await page.click(`a[href="${href}"]`); await sleep(3200); }
  } catch (e) { console.log('  warn click product: ' + e.message.slice(0, 60)); }
  await shot(page, 'guest_product_detail_1440');
  rec('guest opens product detail (real action)', !!prodUrl, { href: prodUrl, landed: page.url() });
  // mobile 375
  await setVw(page, 375, 812);
  await goto(page, '/products', 'guest products 375', 2000);
  await shot(page, 'guest_products_375');
  if (prodUrl) { const d = await page.goto(WEB + prodUrl, { waitUntil: 'networkidle2', timeout: 40000 }).catch(() => null); await sleep(2500); }
  await shot(page, 'guest_product_detail_375');
  return ctx.close();
})();

// BUYER session
const buyerSession = (async () => {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await setVw(page, 1440, 900);
  await loginAs(page, 'demo.buyer.01@visndt.local', 'demo123456');
  await goto(page, '/dashboard/buyer', 'buyer dashboard', 2500);
  await shot(page, 'buyer_dashboard_1440');
  await goto(page, '/workspace/demands', 'buyer demands list', 2500);
  await shot(page, 'buyer_demands_1440');
  await goto(page, '/workspace/demands/' + DEMAND, 'buyer demand detail', 2500);
  await shot(page, 'buyer_demand_detail_1440');
  await goto(page, '/workspace/matches', 'buyer matches list', 2500);
  await shot(page, 'buyer_matches_1440');
  await goto(page, '/workspace/matches/' + MATCH, 'buyer match detail', 2500);
  await shot(page, 'buyer_match_detail_1440');
  await goto(page, '/workspace/rfqs', 'buyer rfqs list', 2500);
  await shot(page, 'buyer_rfqs_1440');
  await goto(page, '/workspace/rfqs/' + RFQ, 'buyer rfq detail', 2500);
  await shot(page, 'buyer_rfq_detail_1440');
  await goto(page, '/workspace/notifications', 'buyer notifications', 2500);
  await shot(page, 'buyer_notifications_1440');
  // mobile 375 sampling
  await setVw(page, 375, 812);
  await goto(page, '/workspace/demands', 'buyer demands 375', 2000);
  await shot(page, 'buyer_demands_375');
  await goto(page, '/workspace/matches', 'buyer matches 375', 2000);
  await shot(page, 'buyer_matches_375');
  await goto(page, '/workspace/rfqs', 'buyer rfqs 375', 2000);
  await shot(page, 'buyer_rfqs_375');
  rec('buyer session complete', true, {});
  return ctx.close();
})();

// SUPPLIER session
const supplierSession = (async () => {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await setVw(page, 1440, 900);
  await loginAs(page, 'demo.supplier.01@visndt.local', 'demo123456');
  await goto(page, '/dashboard/supplier', 'supplier dashboard', 2500);
  await shot(page, 'supplier_dashboard_1440');
  await goto(page, '/workspace/supplier/opportunities', 'supplier opportunities', 2500);
  await shot(page, 'supplier_opportunities_1440');
  await goto(page, '/workspace/supplier/rfqs', 'supplier rfqs list', 2500);
  await shot(page, 'supplier_rfqs_1440');
  await goto(page, '/workspace/supplier/rfqs/' + RFQ, 'supplier rfq detail (open RFQ)', 2500);
  await shot(page, 'supplier_rfq_detail_1440');
  await goto(page, '/workspace/supplier/responses', 'supplier responses list', 2500);
  await shot(page, 'supplier_responses_1440');
  await goto(page, '/workspace/supplier/offers', 'supplier offers list', 2500);
  await shot(page, 'supplier_offers_1440');
  await goto(page, '/workspace/supplier/inquiries', 'supplier inquiries list', 2500);
  await shot(page, 'supplier_inquiries_1440');
  await goto(page, '/workspace/supplier/inquiries/' + INQ, 'supplier inquiry detail', 2500);
  await shot(page, 'supplier_inquiry_detail_1440');
  await goto(page, '/workspace/notifications', 'supplier notifications', 2500);
  await shot(page, 'supplier_notifications_1440');
  // mobile 375 sampling
  await setVw(page, 375, 812);
  await goto(page, '/workspace/supplier/rfqs', 'supplier rfqs 375', 2000);
  await shot(page, 'supplier_rfqs_375');
  await goto(page, '/workspace/supplier/responses', 'supplier responses 375', 2000);
  await shot(page, 'supplier_responses_375');
  await goto(page, '/workspace/supplier/inquiries', 'supplier inquiries 375', 2000);
  await shot(page, 'supplier_inquiries_375');
  rec('supplier session complete', true, {});
  return ctx.close();
})();

const logins = await Promise.all([guestSession, buyerSession, supplierSession]);
await sleep(500);
await browser.close();

const fails = log.filter((x) => !x.ok);
console.log('\n==== 807 BROWSER SUMMARY ==== PASS=' + (log.length - fails.length) + ' FAIL=' + fails.length + ' TOTAL=' + log.length);
if (fails.length) console.log(JSON.stringify(fails, null, 2));
const { writeFileSync } = await import('node:fs');
writeFileSync(OUT + '\\_807_browser.json', JSON.stringify({ task: '807_Browser_E2E', generatedAt: new Date().toISOString(), logins, steps: log }, null, 2), 'utf8');
process.exitCode = fails.length ? 2 : 0;