// Launch Edge headless with CDP and verify connectivity (minimal smoke test)
import { spawn, spawnSync } from 'child_process';
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9222;
const PROFILE = 'F:\\Desktop\\VISNDT\\VISNDT\\database\\.edge-cdp-profile';

async function main() {
  const child = spawn(EDGE, [
    `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`,
    '--headless=new', '--no-first-run', '--no-default-browser-check', '--disable-gpu', '--disable-extensions', 'about:blank',
  ], { stdio: 'ignore', detached: false });
  console.log('edge pid=', child.pid);
  // wait for cdp
  let ok = false;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const v = await fetch(`http://127.0.0.1:${PORT}/json/version`).then(r => r.json());
      console.log('CDP version:', v.Browser);
      ok = true;
      break;
    } catch { /* not ready */ }
  }
  if (!ok) { console.log('CDP NOT READY'); process.exit(1); }
  console.log('CDP OK');
  // keep alive briefly then exit (leave edge running)
  await new Promise(r => setTimeout(r, 1000));
}
main().catch(e => { console.error(e); process.exit(1); });
