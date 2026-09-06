import { Driver, launchChrome, sleep } from '../../../_ux_browser_helper.mjs';
const BASE='http://localhost:3000', PORT=9342, UD='.edge-cdp-828i';
const d=new Driver(PORT); launchChrome(PORT,UD);
await d.connect(); await sleep(1200);
await d.setViewport(1440,900);
async function waitUrl(ms){ for(let i=0;i<ms/300;i++){ const s=await d.evaluate(`location.search`); if(s&&s.includes('sortBy')) return s; await sleep(300);} return await d.evaluate(`location.search`); }
await d.goto(`${BASE}/products`); await d.waitFor(`document.querySelector('select[aria-label="排序方式"]')`,15000); await sleep(1200);
// 尝试方法A：原生 setter + change
const a = await d.evaluate(`(() => { const s=document.querySelector('select[aria-label="排序方式"]'); if(!s) return 'noselect'; const st=Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype,'value').set; st.call(s,'name:asc'); s.dispatchEvent(new Event('change',{bubbles:true})); s.dispatchEvent(new Event('input',{bubbles:true})); return 'dispatched'; })()`);
let urlA = await waitUrl(3000);
// 尝试方法B：真实鼠标点击 select 后键盘选择（click 然后用键盘 Home/End）
await d.goto(`${BASE}/products`); await d.waitFor(`document.querySelector('select[aria-label="排序方式"]')`,15000); await sleep(800);
await d.click('select[aria-label="排序方式"]'); await sleep(300);
await d.send('Input.dispatchKeyEvent',{type:'keyDown',key:'End',code:'End'}); await sleep(100);
await d.send('Input.dispatchKeyEvent',{type:'keyUp',key:'End',code:'End'});
await d.pressEnter(); await sleep(100);
let urlB = await waitUrl(3000);
console.log('A(setter+change/input):', JSON.stringify(urlA===undefined?await d.evaluate('location.search'):urlA));
console.log('B(keyboard End+Enter):  ', urlB);
console.log('current select value:', await d.evaluate(`(document.querySelector('select[aria-label="排序方式"]')||{}).value`));
process.exit(0);