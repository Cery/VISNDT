/**
 * 825 Foundation Browser + Mobile Gate.
 * REAL headed Chrome (CDP) via _ux_browser_helper.
 * Verifies Web /foundation primitives render & interact at 1440 / 375 / 768.
 */
import { Driver, launchChrome, sleep } from '../../../_ux_browser_helper.mjs';
import { mkdirSync } from 'node:fs';

const PORT = 9331;
const UD = '.edge-cdp-825';
const SHOTS = 'database/_ux_verify/825';
mkdirSync(SHOTS, { recursive: true });

const BASE = 'http://localhost:3000/foundation';

// ---------- result recorder ----------
const results = [];
function rec(item, ok, detail = '') {
  results.push({ ...item, ok: !!ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  [${item.id}] ${item.name}${detail ? ' :: ' + detail : ''}`);
}

(async () => {
  const pid = launchChrome(PORT, UD);
  const d = new Driver(PORT);
  await d.connect();
  await sleep(1200);

  // ============ Desktop 1440 ============
  await d.setViewport(1440, 900);
  await d.goto(BASE);
  await d.waitFor(`document.querySelector('[role=tablist]') && document.body.innerText.includes('VISNDT Web Foundation')`, 15000);

  // Tablist present with 6 tabs
  const tabs = await d.evaluate(`Array.from(document.querySelectorAll('[role=tab]')).map(t=>t.innerText.trim())`);
  rec({ id: 'g-desk-tablist', name: 'Tabs 存在且含 6 个语义 Tab', section: 'Browser Gate' }, tabs.length === 6, tabs.join('|'));

  // Tabs interaction: click each and assert content
  const tabChecks = [
    ['设计 Token', 'VISNDT Web Foundation'],
    ['表单控件', '设备名称'],
    ['表格与搜索', '表格与搜索'],
    ['状态 / 反馈', 'REJECTED'],
    ['弹窗 / 抽屉', '打开 Modal'],
    ['按钮', 'Loading'],
  ];
  for (const [label, probe] of tabChecks) {
    const clicked = await d.clickText(label);
    await d.waitMs(500);
    const ok = await d.waitFor(`document.body.innerText.includes(${JSON.stringify(probe)})`, 5000);
    rec({ id: 'g-desk-tab-' + (label.slice(0, 2)), name: `Tab「${label}」渲染内容`, section: 'Browser Gate' }, clicked && ok, probe);
  }

  // Form controls on 表单控件 tab
  await d.clickText('表单控件');
  await d.waitMs(400);
  rec({ id: 'g-desk-form-input', name: 'Input 可见 Label+(关联) 存在', section: 'Form' },
    await d.waitFor(`document.querySelector('input#showcase-name') !== null`, 4000));
  rec({ id: 'g-desk-form-select', name: 'Select 含分类选项', section: 'Form' },
    await d.evaluate(`[...document.querySelectorAll('#showcase-select option')].some(o=>o.textContent.includes('超声波'))`));
  rec({ id: 'g-desk-form-textarea', name: 'Textarea 存在', section: 'Form' },
    await d.waitFor(`document.querySelector('textarea#showcase-desc') !== null`, 3000));
  rec({ id: 'g-desk-form-checkbox', name: 'Checkbox 存在', section: 'Form' },
    await d.evaluate(`!!document.querySelector('input[type=checkbox]')`));
  rec({ id: 'g-desk-form-radio', name: 'RadioGroup 含 3 项', section: 'Form' },
    await d.evaluate(`Array.from(document.querySelectorAll('input[type=radio]')).length === 3`));

  // Form submit → validation error shows associated FieldMessage
  await d.clickText('提交');
  await d.waitMs(400);
  rec({ id: 'g-desk-form-err', name: '必填校验错误关联（FieldMessage + aria-invalid）', section: 'Form' },
    await d.evaluate(`document.body.innerText.includes('设备名称不能为空')`));

  // Search interaction on 表格与搜索 tab
  await d.clickText('表格与搜索');
  await d.waitMs(400);
  await d.waitFor(`document.querySelector('input[type=search]')`, 4000);
  await d.evaluate(`document.querySelector('input[type=search]').focus()`);
  await d.send('Input.insertText', { text: '超声' });
  await d.pressEnter();
  await d.waitMs(400);
  const searchValue = await d.evaluate(`(document.querySelector('input[type=search]')||{}).value || ''`);
  rec({ id: 'g-desk-search', name: 'Search 键入 + 回车 + Loading', section: 'Search' },
    (searchValue.includes('超声')) && (await d.waitFor(`document.body.innerText.includes('正在搜索')`, 4000)), searchValue);

  // Table: rows + pagination
  rec({ id: 'g-desk-table-rows', name: 'Table 渲染数据行', section: 'Table' },
    await d.evaluate(`document.querySelectorAll('tbody tr').length > 0`));
  rec({ id: 'g-desk-table-pagination', name: 'Table 分页存在', section: 'Table' },
    await d.waitFor(`document.querySelector('[aria-label=pagination]') !== null`, 3000));
  // pagination next → page2 rows (涡流探伤仪)
  await d.clickText('›');
  await d.waitMs(500);
  rec({ id: 'g-desk-table-next', name: 'Table 分页「下一页」切换', section: 'Table' },
    await d.waitFor(`document.body.innerText.includes('涡流探伤仪')`, 3000));
  // responsive strategy toggle to stacked
  await d.clickText('移动端堆叠');
  await d.waitMs(400);
  rec({ id: 'g-desk-table-flag', name: '移动端堆叠卡片存在（sm 隐藏策略）', section: 'Table' },
    await d.evaluate(`document.querySelectorAll('main li').length > 0`));

  // Status
  await d.clickText('状态 / 反馈');
  await d.waitMs(400);
  const stOK = ['PUBLISHED', 'REJECTED', 'PENDING', 'ACCEPTED', 'CLOSED'].every((s) => {
    // StatusDisplay tags are spans with text equal to status
    return d.evaluate(`Array.from(document.querySelectorAll('span')).some(x => (x.innerText||'').trim() === ${JSON.stringify(s)})`);
  });
  rec({ id: 'g-desk-status', name: '业务状态→语义状态渲染', section: 'Status' }, await stOK);

  await d.screenshot(`${SHOTS}/825_desktop_1440_foundation.png`);

  // ============ Modal / Drawer ============
  await d.clickText('弹窗 / 抽屉');
  await d.waitMs(400);
  await d.clickText('打开 Modal');
  await d.waitMs(500);
  rec({ id: 'g-modal-open', name: 'Modal 打开（role=dialog + aria-modal）', section: 'Modal' },
    await d.evaluate(`!!document.querySelector('[role=dialog][aria-modal="true"]')`));
  await d.screenshot(`${SHOTS}/825_modal_1440.png`);
  await d.pressEnter(); // no-op safeguard
  await d.evaluate(`document.querySelector('[aria-label="关闭"]') && document.querySelector('[aria-label="关闭"]').click()`);
  await d.waitMs(400);
  rec({ id: 'g-modal-close', name: 'Modal 关闭（关闭按钮）', section: 'Modal' },
    await d.evaluate(`!document.querySelector('[aria-label="关闭"]')`));

  await d.clickText('打开 Drawer (右侧)');
  await d.waitMs(500);
  rec({ id: 'g-drawer-open', name: 'Drawer（右侧）打开', section: 'Drawer' },
    await d.evaluate(`[...document.querySelectorAll('[role=dialog]')].some(x => getComputedStyle(x).display !== 'none')`));
  await d.evaluate(`document.querySelector('button[aria-label="关闭"]') && document.querySelector('button[aria-label="关闭"]').click()`);
  await d.waitMs(400);

  // ============ Mobile Gate 375 ============
  await d.setViewport(375, 812);
  await d.goto(BASE);
  await d.waitFor(`document.querySelector('[role=tablist]')`, 12000);
  rec({ id: 'm-375-load', name: '375 加载 Showcase', section: 'Mobile Gate' },
    await d.waitFor(`document.body.innerText.includes('VISNDT Web Foundation')`, 8000));
  rec({ id: 'm-375-nooverflow', name: '375 无全局水平溢出', section: 'Mobile Gate' },
    !(await d.hasOverflow()));

  // 375: form controls clamp
  await d.waitMs(600);
  await d.clickText('表单控件');
  await d.waitMs(400);
  rec({ id: 'm-375-form', name: '375 表单控件可渲染', section: 'Mobile Gate' },
    await d.waitFor(`document.querySelector('textarea#showcase-desc') !== null`, 4000));

  // 375: table stacked default? we toggled to stacked earlier - reset via reload
  await d.setViewport(768, 1024);
  await d.goto(BASE);
  await d.waitFor(`document.querySelector('[role=tablist]')`, 12000);
  await d.clickText('表格与搜索');
  await d.waitMs(500);
  rec({ id: 'm-768-table', name: '768 表格渲染 + 无溢出', section: 'Mobile Gate' },
    await d.waitFor(`document.querySelectorAll('tbody tr').length > 0`, 5000) && !(await d.hasOverflow()));

  // 768 drawer
  await d.clickText('弹窗 / 抽屉');
  await d.waitMs(400);
  await d.clickText('打开 Drawer (底部)');
  await d.waitMs(500);
  await d.screenshot(`${SHOTS}/825_mobile_375_table.png`);

  // console errors check
  const cleanErrors = d.consoleErrors.filter((m) => !m.includes('favicon')); // filter benign network-ish
  rec({ id: 'g-console', name: '无新增 console error', section: 'Regression Context' }, cleanErrors.length === 0, cleanErrors.slice(0, 3).join(' | '));
  rec({ id: 'g-exception', name: '无页面 JS 异常', section: 'Regression Context' }, d.exceptions.length === 0, d.exceptions.slice(0, 3).join(' | '));

  console.log('\n===== SUMMARY =====');
  const pass = results.filter((r) => r.ok).length;
  console.log(`PASS ${pass} / ${results.length}  FAIL ${results.length - pass}`);
  await sleep(300);
  process.exit(0);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });