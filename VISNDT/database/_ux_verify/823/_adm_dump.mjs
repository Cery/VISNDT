import { Driver, launchChrome, sleep } from '../../../_ux_browser_helper.mjs';
const OUT='F:/Desktop/VISNDT/VISNDT/database/_ux_verify/admin';
const PORT=9329;
launchChrome(PORT, 'C:\\Users\\ws_tj\\AppData\\Local\\Temp\\ux-823admdump');
await sleep(4000);
const d=new Driver(PORT); await d.connect();
await d.goto('http://localhost:3001/login'); await sleep(6000);
const dump = await d.evaluate(`(() => {
  const inputs=Array.from(document.querySelectorAll('input')).map(i=>({id:i.id,name:i.name,type:i.type,ph:i.placeholder}));
  const buttons=Array.from(document.querySelectorAll('button')).map(b=>({txt:(b.innerText||'').trim(),type:b.type})).slice(0,6);
  const hasForm=!!document.querySelector('form');
  return JSON.stringify({inputs,buttons,hasForm,text:(document.body.innerText||'').slice(0,200)});
})()`);
console.log(dump);
process.exit(0);