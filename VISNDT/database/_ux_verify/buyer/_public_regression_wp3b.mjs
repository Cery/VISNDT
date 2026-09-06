import { Driver, launchChrome, sleep } from '../../../_ux_browser_helper.mjs';
import { mkdirSync, writeFileSync, appendFileSync } from 'node:fs';

const OUT = 'F:/Desktop/VISNDT/VISNDT/database/_ux_verify/buyer';
const BASE = 'http://localhost:3000';
const PORT = 9361;
const LOG = `${OUT}/823_wp3b_public_regression.jsonl`;
mkdirSync(OUT, { recursive: true });

async function rec(step, url, action, pass, ce) {
  const o = { step, url, action, pass, consoleErrors: ce };
  appendFileSync(LOG, JSON.stringify(o) + '\n');
}

launchChrome(PORT, 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\ux-wp3b-pub-' + Date.now());
await sleep(4000);
const d = new Driver(PORT); await d.connect();

// Representative WP-3A public paths
const paths = [
  ['/', 'Public Home'],
  ['/search?q=三维', 'Public Search'],
  ['/products', 'Product List'],
  ['/knowledge', 'Knowledge List'],
  ['/solutions', 'Solution List'],
  ['/products/capability-snapshot-04', 'Product Detail (representative)'],
];
try {
  for (const [path, label] of paths) {
    d.consoleErrors = []; d.exceptions = [];
    await d.goto(BASE + path); await sleep(4000);
    const body = await d.bodyText();
    const status = /加载失败|暂时无法|Internal Server Error|Error|异常/.test(body) ? 'error-hint' : (body.length > 120 ? 'ok' : 'short');
    const brokenRoute = body.length < 80 && !/尚在开发|Page Not Found/.test(body);
    const pass = status !== 'error-hint' && !brokenRoute;
    await rec(label, await d.url(), `公开回归 ${path}`, pass, d.consoleErrors.length ? d.consoleErrors.slice(-2).join(' | ') : undefined);
    console.log(`  [${label}] len=${body.length} ${pass ? 'PASS' : 'FAIL'}`);
  }
  console.log('PUBLIC REGRESSION DONE');
} catch (e) {
  console.error('ERR', e);
  writeFileSync(`${OUT}/823_wp3b_public_regression_error.json`, JSON.stringify({ error: String(e) }, null, 2));
  process.exit(1);
}