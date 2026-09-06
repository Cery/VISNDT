import { Driver, launchChrome, sleep } from '../../../_ux_browser_helper.mjs';

const BASE = 'http://localhost:3000';
const PORT = 9335;
const UD = '.edge-cdp-827';
const SHOTS = 'F:/Desktop/VISNDT/VISNDT/database/_ux_verify/826';

function esc(d) { // dispatch Escape
  return d.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 }).then(() =>
    d.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 }));
}
async function goBack(d, ms = 1500) { await d.evaluate('history.back()'); await sleep(ms); }

// 真实交互搜索：聚焦输入 + insertText + 触发所在 form 的提交按钮
async function searchFrom(d, text) {
  await d.evaluate(`document.querySelector('input[aria-label="搜索关键词"]') && document.querySelector('input[aria-label="搜索关键词"]').focus()`);
  await d.send('Input.insertText', { text });
  await sleep(500);
  const ok = await d.evaluate(`(() => { const i=document.querySelector('input[aria-label="搜索关键词"]'); const f=i&&i.closest('form'); const b=f&&f.querySelector('button[type=submit]'); if(b) b.click(); return !!(b&&(i.value||'').length); })()`);
  await sleep(2800);
  return ok;
}

const results = [];
function record(page, action, expected, actual, pass, note = '') {
  results.push({ pass: !!pass });
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${page} | ${action} | ${expected} => ${actual}${note ? ' | ' + note : ''}`);
}

(async () => {
  const pid = launchChrome(PORT, UD);
  const d = new Driver(PORT);
  await d.connect();
  await sleep(1200);

  // 预热抽屉导航会触达的路由，避免 Next dev 首访重编译导致 CDP target reload（FATAL）。
  for (const p of ['/products', '/categories', '/register', '/solutions', '/knowledge-base']) {
    await d.goto(`${BASE}${p}`); await d.waitFor(`document.querySelector('main') || document.body`, 8000).catch(()=>{}); await sleep(400);
  }
  await d.goto(`${BASE}/`); await d.waitFor(`document.querySelector('header')`, 15000); await sleep(800);

  // ---------- 1. Desktop 1440 ----------
  await d.setViewport(1440, 900);
  await d.goto(`${BASE}/`); await d.waitFor(`document.querySelector('header')`, 15000); await sleep(900);

  const h1 = await d.evaluate(`document.querySelector('h1') ? document.querySelector('h1').innerText.slice(0,40) : ''`);
  record('Home', '渲染 h1', '工业无损检测...', h1, h1.includes('工业无损检测'), 'Hero 可见');
  const hasHeroSearch = await d.evaluate(`!!document.querySelector('input[aria-label="搜索关键词"]')`);
  record('Home', '首屏搜索入口', '存在 GlobalSearchBar', hasHeroSearch, hasHeroSearch, '§14 Unified Search');
  const imgAltGap = await d.evaluate(`Array.from(document.images).filter(i=>!i.alt && !i.getAttribute('aria-hidden')).length`);
  record('Home', '图片 alt', '无缺 alt', imgAltGap === 0, imgAltGap === 0, imgAltGap + ' 个缺');

  const desktopNav = await d.evaluate(`(() => { const n=document.querySelector('nav[aria-label="平台导航"]'); return !!n && getComputedStyle(n).display!=='none'; })()`);
  record('Header', 'Desktop 平台导航可见', '发现/评估/技术内容/连接', desktopNav, desktopNav, 'xl 断点');
  await d.clickText('发现'); await sleep(400);
  const mega = await d.evaluate(`document.body.innerText.includes('统一检索') && document.body.innerText.includes('能力分类')`);
  record('Header', '点击「发现」展开 mega', '含 统一检索/能力分类', mega, mega, '§9.1 点击可用');
  await esc(d); await sleep(300);

  // 复用已知稳定的真实交互：聚焦输入框 + insertText + 点击所在 form 的提交按钮
  const typedSearch = await searchFrom(d, '超声检测');
  await sleep(500);
  const searchPath = await d.evaluate('location.pathname');
  const searchQ = await d.evaluate(`location.search`);
  record('Search', '首屏搜索提交', '/search', (searchPath + searchQ), typedSearch && searchPath === '/search' && searchQ.includes('q='), '§14 Authority Unified');
  await d.waitFor(`location.pathname.includes('/search')`, 15000).catch(() => {});
  await goBack(d);
  record('Navigate', 'Browser Back 回首页', '/', await d.evaluate('location.pathname'), (await d.evaluate('location.pathname')) === '/');

  const hasCategoryLink = await d.evaluate(`!!document.querySelector('a[href^="/products?categoryId="]')`);
  record('Category', '首页分类入口', '→ /products?categoryId=', hasCategoryLink, hasCategoryLink, '§15');
  const hasProductCard = await d.evaluate(`!!document.querySelector('a[href^="/products/"], a[href^="/products"]')`);
  record('Product', '首页产品卡入口', '→ /products/:slug', hasProductCard, hasProductCard, '§16');
  const hasSolEntry = await d.evaluate(`!!document.querySelector('a[href^="/solutions"]')`);
  record('Content', '方案入口', '→ /solutions', hasSolEntry, hasSolEntry, '§8');
  const hasKnowEntry = await d.evaluate(`!!document.querySelector('a[href="/knowledge-base"]')`);
  record('Content', '知识入口', '→ /knowledge-base', hasKnowEntry, hasKnowEntry, '§8');
  const hasConnect = await d.evaluate(`!!document.querySelector('a[href="/register?role=BUYER"]')`);
  record('Connection', '连接入口', '发布需求', hasConnect, hasConnect, '§8');

  await d.screenshot(`${SHOTS}/827_home_desktop_1440.png`);
  const o1440 = await d.hasOverflow();
  record('Responsive', '1440 无横向溢出', '无', o1440, !o1440);

  // ---------- 2. Tablet 1024 ----------
  await d.setViewport(1024, 900);
  await d.goto(`${BASE}/`); await d.waitFor(`document.querySelector('header')`, 15000); await sleep(900);
  const o1024 = await d.hasOverflow();
  record('Responsive', '1024 无横向溢出', '无', o1024, !o1024);
  // xl(1280) 断点：1024 下平台导航应隐藏，改由汉堡/抽屉接管
  const nav1024 = await d.evaluate(`(() => { const n=document.querySelector('nav[aria-label="平台导航"]'); return !!n && getComputedStyle(n).display!=='none'; })()`);
  record('Header', '1024 桌面导航隐藏', 'false(抽屉接管)', nav1024, nav1024 === false);
  const ham1024 = await d.evaluate(`(() => { const b=document.querySelector('button[aria-label="切换菜单"]'); return !!b && getComputedStyle(b).display!=='none'; })()`);
  record('Header', '1024 汉堡可见', 'true', ham1024, ham1024 === true);
  await d.screenshot(`${SHOTS}/827_home_tablet_1024.png`);

  // ---------- 3. Tablet 768 ----------
  await d.setViewport(768, 900);
  await d.goto(`${BASE}/`); await d.waitFor(`document.querySelector('header')`, 15000); await sleep(900);
  const o768 = await d.hasOverflow();
  record('Responsive', '768 无横向溢出', '无', o768, !o768);
  const ham = 'button[aria-label="切换菜单"]';
  const clicked768 = await d.click(ham); await sleep(700);
  record('MobileNav', '768 点击汉堡(切换菜单)', '真实点击', clicked768, clicked768 === true, '§9.2 Menu Trigger');
  const drawerOpen768 = await d.evaluate(`!!document.querySelector('[role="dialog"][aria-modal="true"]')`);
  const drawerRight768 = await d.evaluate(`(() => { const el=document.querySelector('[role="dialog"] > [role="document"]'); if(!el) return false; const r=el.getBoundingClientRect(); return r.left > 100 && r.right <= window.innerWidth + 1; })()`);
  record('MobileNav', '768 打开右侧抽屉', 'role=dialog', drawerOpen768, drawerOpen768, '§9.2');
  record('MobileNav', '768 抽屉为右侧', '右滑出', drawerRight768, drawerRight768);
  await d.screenshot(`${SHOTS}/827_menu_tablet_768.png`);
  const prod768click = await d.click('[role="dialog"] a[href="/products"]');
  await sleep(2200);
  const prod768 = await d.evaluate('location.pathname');
  record('MobileNav', '抽屉导航→产品', '/products', (prod768click + '|' + prod768), prod768click && prod768 === '/products', '§25 真实点击');
  await goBack(d);

  // ---------- 4. Mobile 375 ----------
  await d.setViewport(375, 800);
  await d.goto(`${BASE}/`); await d.waitFor(`document.querySelector('header')`, 15000); await sleep(900);
  const o375 = await d.hasOverflow();
  record('Responsive', '375 无横向溢出', '无', o375, !o375);
  const clicked375 = await d.click(ham); await sleep(700);
  record('MobileNav', '375 点击汉堡(切换菜单)', '真实点击', clicked375, clicked375 === true);
  const drawerOpen375 = await d.evaluate(`!!document.querySelector('[role="dialog"][aria-modal="true"]')`);
  const drawerBottom375 = await d.evaluate(`(() => { const el=document.querySelector('[role="dialog"] > [role="document"]'); if(!el) return false; const r=el.getBoundingClientRect(); return Math.abs(r.bottom - window.innerHeight) < 2 && r.bottom > 100; })()`);
  record('MobileNav', '375 打开底部抽屉', 'role=dialog', drawerOpen375, drawerOpen375, '§9.2 Bottom');
  record('MobileNav', '375 抽屉为底部', 'bottom sheet', drawerBottom375, drawerBottom375);
  const searchInDrawer = await d.evaluate(`(() => { const dlg=document.querySelector('[role="dialog"]'); return !!(dlg && dlg.querySelector('input[aria-label="搜索关键词"]')); })()`);
  record('MobileNav', '抽屉内搜索可达', 'GlobalSearchBar', searchInDrawer, searchInDrawer, '§9.2');
  const navInDrawer = await d.evaluate(`!!document.querySelector('nav[aria-label="平台导航（移动）"]')`);
  record('MobileNav', '抽屉内平台导航可达', '4 层分组', navInDrawer, navInDrawer, '§9.2');
  await d.screenshot(`${SHOTS}/827_menu_mobile_375.png`);
  await esc(d); await sleep(500);
  const drawerClosed = await d.evaluate(`!document.querySelector('[role="dialog"][aria-modal="true"]')`);
  record('MobileNav', '375 Escape 关闭', '关闭', drawerClosed, drawerClosed, 'Dialog 语义');
  await d.click(ham); await sleep(500);
  const catNav375 = await d.click('[role="dialog"] a[href="/categories"]');
  await sleep(2200);
  const catPath = await d.evaluate('location.pathname');
  record('MobileNav', '抽屉导航→能力分类', '/categories', (catNav375 + '|' + catPath), catNav375 && catPath === '/categories', '§25 真实点击');

  const errs = (d.consoleErrors || []).filter((e) => !String(e).includes('favicon'));
  record('Console', '无新增 console error', '无', errs.length === 0 ? '无' : String(errs[0]).slice(0,120), errs.length === 0, errs.length ? 'err' : '');

  const pass = results.filter((r) => r.pass).length;
  console.log(`\n=== SUMMARY: ${pass}/${results.length} PASS ===`);
  process.exit(0);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });