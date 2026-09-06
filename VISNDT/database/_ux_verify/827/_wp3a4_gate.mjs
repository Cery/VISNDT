// WP-3A.4 Knowledge + Solution + Public Content — final closeout gate.
// Real headed Chrome. Covers: knowledge list/detail (recomposed discovery surface),
// solution list/detail, product↔content closed loop, content↔product discovery,
// representative mobile widths, a11y, security cred scan, console/5xx/overflow.
import { Driver, launchChrome, sleep } from '../../../_ux_browser_helper.mjs';

const BASE = 'http://localhost:3000';
const API = 'http://localhost:4000/api/v1';
const PORT = 9376;
const UD = '.edge-cdp-3a4';
const SHOTS = 'F:/Desktop/VISNDT/VISNDT/database/_ux_verify/827';

const KNOWN = 'industrial-video-borescope-introduction';   // 工业视频内窥镜基础介绍 (KNOWLEDGE)
const SOL = 'aero-engine-internal-inspection-solution';    // 航空发动机内部检测方案 (SOLUTION)
const PROD_A = 'a5a26d69-320f-4c95-a480-3d15f2faea2a';     // POP 4 三维扫描仪

async function until(d, expr, ms = 9000, step = 250) {
  const t0 = Date.now(); let last = null;
  while (Date.now() - t0 < ms) { last = await d.evaluate(expr).catch(() => null); if (last) return last; await sleep(step); }
  return last;
}
const results = [];
function record(area, action, note, pass) {
  results.push({ pass: !!pass });
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${area} | ${action} | ${note}`);
}

async function credScan(d, url) {
  return d.evaluate(`(async () => {
    const r = await fetch(${JSON.stringify(url)}, {credentials:'include'});
    const j = await r.json();
    const s = JSON.stringify(j);
    const creds = s.match(/passwordHash|hashedPassword|"password"|refreshToken|accessToken|"secret"|privateContact|internalNote|adminOnly/g);
    return { status: r.status, creds: creds ? Array.from(creds) : [] };
  })()`);
}

(async () => {
  const pid = launchChrome(PORT, UD);
  const d = new Driver(PORT);
  await d.connect(); await sleep(1200);

  // ============ 1. Knowledge List (recomposed surface) ============
  await d.setViewport(1440, 900);
  await d.goto(`${BASE}/knowledge`); await d.waitFor(`document.body.innerText.includes('技术知识中心')`, 15000);
  const kHero = await d.evaluate(`document.body.innerText.includes('WHY') && document.body.innerText.includes('KNOWLEDGE') && document.body.innerText.includes('CAPABILITY')`);
  record('Knowledge', 'List hero journey line', `why→knowledge→capability→solution`, kHero);
  const kNav = await d.evaluate(`!!document.querySelector('nav[aria-label="工程信息发现"]')`);
  record('Knowledge', 'Cross-surface discovery nav', String(kNav), kNav);
  const kQuick = await d.evaluate(`document.body.innerText.includes('从知识语境进入')`);
  record('Knowledge', 'Context quick entry', String(kQuick), kQuick);
  const kCards = await until(d, `document.querySelectorAll('a[href^="/knowledge/"]').length > 2 ? document.querySelectorAll('a[href^="/knowledge/"]').length : 0`, 9000);
  record('Knowledge', 'List real cards', `${kCards}`, Number(kCards) >= 3);
  const kOverflow = await d.hasOverflow();
  record('Knowledge', 'List no overflow 1440', String(kOverflow), !kOverflow);

  // ============ 2. Knowledge Detail (unified engineering discovery) ============
  await d.goto(`${BASE}/knowledge/${KNOWN}`); await d.waitFor(`document.body.innerText.includes('工业视频内窥镜')`, 15000); await sleep(1000);
  const kdH1 = await d.evaluate(`document.querySelector('h1')?.innerText||''`);
  record('Knowledge', 'Detail H1', kdH1, kdH1.includes('工业视频内窥镜'));
  const kdDisc = await d.evaluate(`document.body.innerText.includes('相关工程发现') && document.body.innerText.includes('相关检测能力产品') && document.body.innerText.includes('相关解决方案')`);
  record('Knowledge', 'Detail engineering discovery frame', String(kdDisc), kdDisc);
  const kdNext = await d.evaluate(`document.body.innerText.includes('下一步发现')`);
  record('Knowledge', 'Detail next-discovery actions', String(kdNext), kdNext);

  // Knowledge → Product closed loop: click a real product link inside discovery
  const kdProdLink = await d.evaluate(`(() => { const a=Array.from(document.querySelectorAll('a[href^="/products/"]')).find(a=>/^\\/products\\/[a-zA-Z0-9-]+$/.test(a.getAttribute('href')||'')); return a?a.getAttribute('href'):''; })()`);
  record('Knowledge', 'Detail → product link present', kdProdLink, kdProdLink.startsWith('/products/'));
  if (kdProdLink) { await d.goto(`${BASE}${kdProdLink}`); await d.waitFor(`document.querySelector('h1')`, 15000); await sleep(1000); }
  const prodH1 = await d.evaluate(`document.querySelector('h1')?.innerText||''`);
  const prodPath = await d.evaluate(`location.pathname`);
  record('Knowledge', '→ product detail (closed loop)', `${prodPath} | ${prodH1}`, prodPath.startsWith('/products/') && prodH1.length > 0);

  // ============ 3. Product → Knowledge closed loop (via Related Knowledge tab) ============
  await d.goto(`${BASE}/products/${PROD_A}`); await d.waitFor(`document.body.innerText.includes('POP 4')`, 15000); await sleep(1000);
  const prodKnowledgeTab = await d.evaluate(`(() => { const t=Array.from(document.querySelectorAll('[role=tab]')).find(t=>t.innerText.includes('相关知识')); if(t) t.click(); return !!t; })()`);
  record('Content', 'Product related-knowledge tab present', String(prodKnowledgeTab), prodKnowledgeTab);
  const kEntryLink = await until(d, `(() => { const a=Array.from(document.querySelectorAll('a[href^="/knowledge-base/"]')).find(a=>/^\\/knowledge-base\\/[a-z0-9-]+$/.test(a.getAttribute('href')||'')); return a?a.getAttribute('href'):''; })()`, 8000);
  record('Content', 'Product → knowledge link', kEntryLink, kEntryLink.startsWith('/knowledge-base/'));
  if (kEntryLink) { await d.goto(`${BASE}${kEntryLink}`); await d.waitFor(`document.querySelector('h1')`, 15000); await sleep(800); }
  const kDetailPath = await d.evaluate(`location.pathname`);
  record('Content', '→ knowledge detail (closed loop)', kDetailPath, kDetailPath.startsWith('/knowledge-base/'));

  // ============ 4. Solution List ============
  await d.goto(`${BASE}/solutions`); await d.waitFor(`document.body.innerText.includes('工业检测解决方案')`, 15000);
  const sNav = await d.evaluate(`!!document.querySelector('nav[aria-label="工程信息发现"]')`);
  record('Solution', 'List cross-surface nav', String(sNav), sNav);
  const sCards = await until(d, `document.querySelectorAll('a[href^="/solutions/"]').length > 1 ? document.querySelectorAll('a[href^="/solutions/"]').length : 0`, 9000);
  record('Solution', 'List real cards', `${sCards}`, Number(sCards) >= 2);

  // ============ 5. Solution Detail (unified discovery frame) ============
  await d.goto(`${BASE}/solutions/${SOL}`); await d.waitFor(`document.body.innerText.includes('航空发动机')`, 15000); await sleep(800);
  const sdH1 = await d.evaluate(`document.querySelector('h1')?.innerText||''`);
  record('Solution', 'Detail H1', sdH1, sdH1.includes('航空发动机'));
  const sdDisc = await d.evaluate(`document.body.innerText.includes('相关工程发现') && document.body.innerText.includes('相关技术知识')`);
  record('Solution', 'Detail engineering discovery frame', String(sdDisc), sdDisc);
  const sdProdLink = await d.evaluate(`(() => { const a=Array.from(document.querySelectorAll('a[href^="/products/"]')).find(a=>/^\\/products\\/[a-zA-Z0-9-]+$/.test(a.getAttribute('href')||'')); return a?a.getAttribute('href'):''; })()`);
  record('Solution', 'Detail → product link present', sdProdLink, sdProdLink.startsWith('/products/'));

  // ============ 6. Content Security Scan ============
  const sec1 = await credScan(d, `${API}/content/public?type=KNOWLEDGE&pageSize=50`);
  const sec2 = await credScan(d, `${API}/content/public/${KNOWN}`);
  const sec3 = await credScan(d, `${API}/products?status=ACTIVE&pageSize=5`);
  record('Security', 'content list creds', `status=${sec1.status} creds=${JSON.stringify(sec1.creds)}`, sec1.status === 200 && sec1.creds.length === 0);
  record('Security', 'content detail creds', `status=${sec2.status} creds=${JSON.stringify(sec2.creds)}`, sec2.status === 200 && sec2.creds.length === 0);
  record('Security', 'product list creds', `status=${sec3.status} creds=${JSON.stringify(sec3.creds)}`, sec3.status === 200 && sec3.creds.length === 0);

  // ============ 7. Mobile (375) Knowledge + Solution + Content ============
  await d.setViewport(375, 812);
  await d.goto(`${BASE}/knowledge`); await d.waitFor(`document.body.innerText.includes('技术知识中心')`, 15000); await sleep(600);
  const k375 = await d.hasOverflow();
  const k375Nav = await d.evaluate(`document.querySelector('nav[aria-label="工程信息发现"]') !== null`);
  record('Mobile', '375 knowledge list no overflow', String(k375), !k375);
  record('Mobile', '375 discovery nav visible', String(k375Nav), k375Nav === true);
  await d.screenshot(`${SHOTS}/3a4_knowledge_375.png`);

  await d.goto(`${BASE}/knowledge/${KNOWN}`); await d.waitFor(`document.querySelector('h1')`, 15000); await sleep(600);
  const kd375 = await d.hasOverflow();
  record('Mobile', '375 knowledge detail no overflow', String(kd375), !kd375);
  await d.screenshot(`${SHOTS}/3a4_knowledge_detail_375.png`);

  await d.goto(`${BASE}/solutions`); await d.waitFor(`document.body.innerText.includes('工业检测解决方案')`, 15000); await sleep(600);
  const s375 = await d.hasOverflow();
  record('Mobile', '375 solution list no overflow', String(s375), !s375);

  await d.goto(`${BASE}/solutions/${SOL}`); await d.waitFor(`document.querySelector('h1')`, 15000); await sleep(600);
  const sd375 = await d.hasOverflow();
  record('Mobile', '375 solution detail no overflow', String(sd375), !sd375);
  await d.screenshot(`${SHOTS}/3a4_solution_detail_375.png`);

  // ============ 8. Tablet / Desktop intermediate widths ============
  for (const [w, label] of [[768, '768'], [1024, '1024']]) {
    await d.setViewport(w, 900);
    await d.goto(`${BASE}/knowledge/${KNOWN}`); await d.waitFor(`document.querySelector('h1')`, 15000); await sleep(500);
    const ov = await d.hasOverflow();
    record('Mobile', `${label} knowledge detail no overflow`, String(ov), !ov);
  }
  await d.setViewport(1440, 900);
  await d.goto(`${BASE}/knowledge/${KNOWN}`); await d.waitFor(`document.querySelector('h1')`, 15000); await sleep(500);
  await d.screenshot(`${SHOTS}/3a4_knowledge_detail_1440.png`);

  // ============ 9. Console / exceptions / 5xx ============
  const consoleErr = d.consoleErrors.length;
  const exceptions = d.exceptions.length;
  record('Console', 'console errors', `${consoleErr} ${JSON.stringify(d.consoleErrors)}`, consoleErr === 0);
  record('Console', 'runtime exceptions', `${exceptions}`, exceptions === 0);

  const passed = results.filter((r) => r.pass).length;
  const total = results.length;
  console.log(`\n=== WP-3A.4 GATE: ${passed}/${total} PASS ===`);
  process.exit(passed === total ? 0 : 1);
})();
