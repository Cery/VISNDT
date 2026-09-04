/* Smoke test for _ux_browser_helper — loads web home + login as buyer. */
import { Driver, launchChrome, sleep } from './_ux_browser_helper.mjs';
const PORT = 9330;
const USER = 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\ux-smoke-' + Date.now();
const WEB = 'http://localhost:3000';

launchChrome(PORT, USER);
await sleep(2500);
const d = new Driver(PORT);
await d.connect();
await d.goto(WEB + '/');
await sleep(2500);
console.log('home title =', await d.title(), '| url=', await d.url());
const hasSearch = await d.evaluate(`!!document.querySelector('input[type=search], input[placeholder*=搜], input[placeholder*=Search]')`);
console.log('hasSearchInput =', hasSearch);

await d.goto(WEB + '/login');
await d.waitForSelector('#login-email');
await d.type('#login-email', 'demo.buyer.01@visndt.local');
await d.type('#login-password', 'demo123456');
const vals = await d.evaluate(`({ e: document.querySelector('#login-email').value, p: document.querySelector('#login-password').value })`);
console.log('input values =', JSON.stringify(vals));
await d.evaluate('document.querySelector("#login-password").form.querySelector("button[type=submit]").click()');
await sleep(1800);
const btnText = await d.evaluate('document.querySelector("#login-password").form.querySelector("button[type=submit]").innerText.trim()');
console.log('login submit btn after 1.8s =', btnText);
await sleep(5000);
const urlAfter = await d.url();
console.log('after login url =', urlAfter);
const ls = await d.evaluate(`(() => { const o={}; for (let i=0;i<localStorage.length;i++){const k=localStorage.key(i); o[k]=localStorage.getItem(k).slice(0,50);} return o; })()`);
console.log('localStorage =', JSON.stringify(ls));
if (urlAfter.includes('/login')) {
  const err = await d.evaluate(`(() => { const el = document.querySelector('.border-red-200'); return el ? el.innerText.trim() : 'NO-ERROR-BANNER'; })()`);
  console.log('login error banner =', err);
}
console.log('consoleErrors =', d.consoleErrors.length);
console.log('exceptions =', d.exceptions.length);
await d.screenshot('C:\\Users\\ws_tj\\AppData\\Local\\Temp\\ux-dashboard.png');
console.log('smoke OK');
process.exit(0);