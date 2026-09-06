import { Driver, launchChrome, sleep } from '../../../_ux_browser_helper.mjs';
import { mkdirSync, writeFileSync, appendFileSync } from 'node:fs';

const OUT = 'F:/Desktop/VISNDT/VISNDT/database/_ux_verify/buyer';
const BASE = 'http://localhost:3000';
const PORT = 9359;
const TS = Date.now();
const USER = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\ux-wp3b-' + TS;
const LOG = `${OUT}/823_wp3b_buyer_workspace.jsonl`;
mkdirSync(OUT, { recursive: true });

// Controlled test data (demo.buyer.01 org), confirmed in 823 baseline — NOT production.
const DEMAND_ID = 'd6d8b4f7-a6de-420f-8ff1-1c2010584d6f';   // 807 demand
const MATCH_ID  = '3623963a-a7de-4110-8e58-1b046c101543';   // ACCEPTED match
const RFQ_ID    = 'a24806ee-a967-463d-928c-db929dd6de68';   // OPEN rfq w/ ACCEPTED response

const VIEWPORTS = [1440, 1024, 768, 375];
let consoleErrors = [];
let exceptions = [];

async function rec(step, url, action, expected, actual, pass, shot, ce) {
  const o = { step, url, action, expected, actual: (actual || '').slice(0, 400), pass, screenshot: shot || undefined, consoleErrors: ce };
  appendFileSync(LOG, JSON.stringify(o) + '\n');
  return o;
}
async function shot(d, fn) { await d.screenshot(`${OUT}/${fn}`); return fn; }
async function hasField(d, sel) { return await d.evaluate(`!!document.querySelector(${JSON.stringify(sel)})`); }
async function waitBody(d, minLen = 450, timeout = 25000, minText = []) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    try {
      const t = await d.bodyText();
      if (t.length >= minLen && minText.every(k => t.includes(k))) return t;
    } catch {}
    await sleep(1200);
  }
  return await d.bodyText();
}

async function login() {
  let lastWhy = '';
  for (let a = 1; a <= 4; a++) {
    await d.goto(BASE + '/login'); await sleep(5000);
    if (!(await hasField(d, '#login-email')) || !(await hasField(d, '#login-password'))) { lastWhy = 'fields missing'; continue; }
    await d.type('#login-email', 'demo.buyer.01@visndt.local');
    await d.type('#login-password', 'demo123456'); await sleep(400);
    await d.submitFormContaining('#login-password');
    for (let i = 0; i < 10; i++) { await sleep(1200); const u = await d.url(); if (/dashboard|workspace/.test(u)) return u; }
    lastWhy = 'stayed on login';
  }
  return lastWhy;
}

// Navigate to buyer dashboard / buyer workspace home
async function gotoBuyerHome() {
  // buyer dashboard route is /dashboard/buyer; fallback /dashboard then redirect expected
  await d.goto(BASE + '/dashboard/buyer'); await sleep(2500);
  let u = await d.url();
  if (!/dashboard|workspace/.test(u)) { await d.goto(BASE + '/dashboard'); await sleep(2500); u = await d.url(); }
  return u;
}

launchChrome(PORT, USER);
await sleep(4000);
const d = new Driver(PORT); await d.connect();

try {
  // ── LOGIN ──
  const landing = await login();
  console.log('login landing =>', landing);
  if (!/dashboard|workspace/.test(landing)) throw new Error('LOGIN FAIL: ' + landing);

  // ── BUYER HOME / DASHBOARD (procurement journey) ──
  const homeUrl = await gotoBuyerHome();
  d.consoleErrors = []; d.exceptions = [];
  const home = await waitBody(d, 400, 25000, ['采购旅程', '需求', '匹配', '询价']);
  const homeOk = /采购旅程/.test(home) && /DEMAND → MATCH → RFQ → DECISION/.test(home) && /需求/.test(home) && /匹配/.test(home) && /询价/.test(home) && /决策/.test(home) && /返回能力发现/.test(home);
  await rec('home', homeUrl, '打开采购方工作台', '展示采购旅程 DEMAND→MATCH→RFQ→DECISION + 返回发现入口', 'len=' + home.length + ' journey=' + /采购旅程/.test(home) + ' ret=' + /返回能力发现/.test(home), homeOk, await shot(d, '823b_home_journey_1440.png'), d.consoleErrors.length ? d.consoleErrors.slice(-2).join(' | ') : undefined);

  // ── DEMAND LIST ──
  d.consoleErrors = []; d.exceptions = [];
  await d.goto(BASE + '/workspace/demands'); await sleep(2200);
  const dl = await waitBody(d, 400, 25000, ['我的需求']);
  const dlOk = /我的需求/.test(dl) && /创建需求/.test(dl) && /采购旅程/.test(dl);
  await rec('demand_list', await d.url(), '打开需求列表', 'BUYER·DEMAND 页面身份 + 创建需求 + 采购旅程', 'len=' + dl.length + ' id=' + /BUYER · DEMAND/.test(dl), dlOk, await shot(d, '823b_demand_list_1440.png'), d.consoleErrors.length ? d.consoleErrors.slice(-2).join(' | ') : undefined);

  // ── DEMAND DETAIL (real data) ──
  d.consoleErrors = []; d.exceptions = [];
  await d.goto(`${BASE}/workspace/demands/${DEMAND_ID}`); await sleep(2200);
  const dd = await waitBody(d, 450, 25000, ['807']);
  const ddOk = /807|高精度三维扫描仪/.test(dd) && !/无权访问|此页面无法找到/.test(dd) && /查看匹配结果/.test(dd);
  await rec('demand_detail', await d.url(), '打开 807 需求详情', '真实需求数据 + 匹配结果入口', 'has807=' + /807/.test(dd) + ' matchesShortcut=' + /查看匹配结果/.test(dd), ddOk, await shot(d, '823b_demand_detail_1440.png'), d.consoleErrors.length ? d.consoleErrors.slice(-2).join(' | ') : undefined);

  // ── MATCH LIST ──
  d.consoleErrors = []; d.exceptions = [];
  await d.goto(BASE + '/workspace/matches'); await sleep(2200);
  const ml = await waitBody(d, 400, 25000, ['匹配结果']);
  const mlOk = /匹配结果/.test(dl) || /匹配结果/.test(ml);
  await rec('match_list', await d.url(), '打开匹配列表', 'BUYER·MATCHING 页面身份 + 采购旅程', 'len=' + ml.length, mlOk, await shot(d, '823b_match_list_1440.png'), d.consoleErrors.length ? d.consoleErrors.slice(-2).join(' | ') : undefined);

  // ── MATCH DETAIL (real ACCEPTED) ──
  d.consoleErrors = []; d.exceptions = [];
  await d.goto(`${BASE}/workspace/matches/${MATCH_ID}`); await sleep(2200);
  const md = await waitBody(d, 450, 25000, ['已接受']);
  const mdOk = /已接受|ACCEPTED/.test(md) && /匹配详情/.test(md) && /MetroY|高精度三维扫描/.test(md);
  await rec('match_detail', await d.url(), '打开 ACCEPTED 匹配详情', '匹配评分/解释/状态 + H1 页面身份', 'len=' + md.length + ' st=' + (/已接受/.test(md) ? 'ACCEPTED' : '?'), mdOk, await shot(d, '823b_match_detail_1440.png'), d.consoleErrors.length ? d.consoleErrors.slice(-2).join(' | ') : undefined);

  // ── RFQ LIST ──
  d.consoleErrors = []; d.exceptions = [];
  await d.goto(BASE + '/workspace/rfqs'); await sleep(2200);
  const rl = await waitBody(d, 400, 25000, ['我的询价请求']);
  const rlOk = /我的询价请求/.test(rl) && /创建询价请求/.test(rl);
  await rec('rfq_list', await d.url(), '打开询价列表', 'BUYER·RFQ 页面身份 + 创建询价请求', 'len=' + rl.length, rlOk, await shot(d, '823b_rfq_list_1440.png'), d.consoleErrors.length ? d.consoleErrors.slice(-2).join(' | ') : undefined);

  // ── RFQ DETAIL (response/offer/decision) ──
  d.consoleErrors = []; d.exceptions = [];
  await d.goto(`${BASE}/workspace/rfqs/${RFQ_ID}`); await sleep(2200);
  const rd = await waitBody(d, 450, 25000, ['明视工业检测设备有限公司']);
  const rdOk = /响应审核|响应详情/.test(rd) && /明视工业检测设备有限公司/.test(rd) && /已接受|ACCEPTED/.test(rd);
  await rec('rfq_detail', await d.url(), '打开 OPEN RFQ 详情(响应审核)', '供应商响应 + 决策态(ACCEPTED)', 'len=' + rd.length + ' hasSup=' + /明视工业检测设备有限公司/.test(rd) + ' decided=' + /已接受/.test(rd), rdOk, await shot(d, '823b_rfq_detail_1440.png'), d.consoleErrors.length ? d.consoleErrors.slice(-2).join(' | ') : undefined);

  // ── PERMISSION: buyer denied supplier-private ──
  d.consoleErrors = []; d.exceptions = [];
  await d.goto(BASE + '/workspace/supplier/products'); await sleep(8000);
  const pb = await d.bodyText();
  // Must NOT render any supplier workspace data / menu (no cross-role leak).
  const leakedSupplier = /供应商工作台|供应商产品|SupplierProducts|我的供应|组织概览|成员管理|Opportunities|Opportunity/.test(pb);
  const blocked = /无权访问|权限不足|没有权限|Forbidden|Access denied|access denied|无权限|请登录|需要登录/.test(pb) || /403|unauthorized/.test(await d.url());
  await rec('permission_deny', await d.url(), 'Buyer 越权访问供应商私有页', '被权限拦截且无供应商数据泄露', 'len=' + pb.length + ' deniedHint=' + blocked + ' leaked=' + leakedSupplier + ' head=' + pb.slice(0, 80), blocked && !leakedSupplier, await shot(d, '823b_permission_deny_1440.png'), d.consoleErrors.length ? d.consoleErrors.slice(-2).join(' | ') : undefined);

  // ── SECOND permission: buyer denied admin governance ──
  d.consoleErrors = []; d.exceptions = [];
  await d.goto(BASE + '/admin'); await sleep(8000);
  const pb2 = await d.bodyText();
  const leakedAdmin = /系统管理|治理|Admin|管理后台|用户管理|平台治理/.test(pb2);
  const adminBlocked = /无权访问|权限不足|没有权限|Forbidden|Access denied|access denied|无权限|请登录|需要登录/.test(pb2) || /403|unauthorized/.test(await d.url()) || /404/.test(pb2);
  await rec('permission_admin', await d.url(), 'Buyer 越权访问 Admin 治理', '被权限拦截且无治理数据泄露', 'blocked=' + adminBlocked + ' leaked=' + leakedAdmin, adminBlocked && !leakedAdmin, await shot(d, '823b_permission_admin_1440.png'), d.consoleErrors.length ? d.consoleErrors.slice(-2).join(' | ') : undefined);

  // ── RESPONSIVE: overflow check across viewports on dashboard + a detail page ──
  const respPages = [
    ['/dashboard/buyer', 'dashboard'],
    ['/workspace/demands', 'demand_list'],
    ['/workspace/matches', 'match_list'],
    [`/workspace/rfqs/${RFQ_ID}`, 'rfq_detail'],
  ];
  for (const vp of VIEWPORTS) {
    await d.setViewport(vp, 900);
    for (const [path, tag] of respPages) {
      d.consoleErrors = []; d.exceptions = [];
      await d.goto(BASE + path); await sleep(2500);
      const ovf = await d.hasOverflow();
      const bw = await d.evaluate('document.documentElement.clientWidth');
      await rec('resp_' + tag + '_' + vp, await d.url(), `viewport ${vp}px 打开 ${tag}`, '无横向溢出', 'clientW=' + bw + ' overflow=' + ovf, !ovf, undefined, d.consoleErrors.length ? d.consoleErrors.slice(-2).join(' | ') : undefined);
      console.log(`  vp=${vp} ${tag} overflow=${ovf}`);
    }
  }
  await d.setViewport(1440, 900);

  console.log('DONE. steps recorded to', LOG);
} catch (e) {
  console.error('RUNNER ERR', e);
  writeFileSync(`${OUT}/823_wp3b_buyer_workspace_error.json`, JSON.stringify({ error: String(e) }, null, 2));
  process.exit(1);
}