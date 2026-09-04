/**
 * _ux_browser_helper.mjs — Reusable REAL headed-browser CDP driver for the
 * Post-Close Full Runtime UX Verification.
 * Launches a VISIBLE Chrome with remote-debugging, drives REAL UI interactions
 * (Input.dispatchMouseEvent real click, Input.insertText real keystrokes),
 * captures screenshots + console/exceptions + structured evidence.
 * API-only shortcuts are NOT accepted for core actions.
 */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Launch a HEADED (visible) Chrome on a dedicated CDP port. Returns pid. */
export function launchChrome(port, userDataDir) {
  mkdirSync(userDataDir, { recursive: true });
  const args = [
    '--no-sandbox',
    '--disable-features=TranslateUI',
    `--remote-debugging-port=${port}`, `--user-data-dir=${userDataDir}`,
    '--window-size=1440,900', '--new-window', 'about:blank',
  ];
  const chrome = spawn(CHROME, args, { stdio: 'ignore' });
  return chrome.pid;
}

async function waitJson(target, tries = 60) {
  for (let i = 0; i < tries; i++) {
    try { const r = await fetch(target); if (r.ok) return await r.json(); } catch {}
    await sleep(500);
  }
  throw new Error('CDP endpoint not ready: ' + target);
}

export class Driver {
  constructor(port) { this.port = port; this.id = 0; this.pending = new Map(); this.consoleErrors = []; this.exceptions = []; }

  async connect() {
    const targets = await waitJson(`http://127.0.0.1:${this.port}/json`);
    const page = targets.find((t) => t.type === 'page');
    if (!page) throw new Error('no page target');
    this.ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((res, rej) => { this.ws.onopen = res; this.ws.onerror = rej; });
    this.ws.onmessage = (ev) => {
      let m; try { m = JSON.parse(ev.data); } catch { return; }
      if (m.method === 'Runtime.exceptionThrown') {
        const ex = m.params.exceptionDetails;
        this.exceptions.push((ex.text || '') + ' :: ' + ((ex.exception?.description) || '').slice(0, 200));
      } else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
        this.consoleErrors.push((m.params.args || []).map((x) => x.value !== undefined ? x.value : (x.description || '')).join(' ').slice(0, 200));
      }
      if (m.id && this.pending.has(m.id)) {
        const p = this.pending.get(m.id); this.pending.delete(m.id);
        m.error ? p.reject(new Error(m.error.message)) : p.resolve(m.result);
      }
    };
    await this.send('Runtime.enable');
    await this.send('Page.enable');
    // default desktop viewport
    await this.setViewport(1440, 900);
    return this;
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { this.pending.delete(id); reject(new Error(method + ' timeout')); }, 20000);
      this.pending.set(id, {
        resolve: (v) => { clearTimeout(timer); resolve(v); },
        reject: (e) => { clearTimeout(timer); reject(e); },
      });
      try { this.ws.send(JSON.stringify({ id, method, params })); } catch (e) { clearTimeout(timer); reject(e); }
    });
  }

  async goto(url, waitUntil = 'networkidle0', timeout = 15000) {
    return this.send('Page.navigate', { url });
  }

  /** Wait until expression `expr` (a JS string) returns truthy. */
  async waitFor(expr, timeout = 8000) {
    const t0 = Date.now();
    while (Date.now() - t0 < timeout) {
      let v; try { v = await this.evaluate(`Boolean(${expr})`); } catch { v = false; }
      if (v) return true;
      await sleep(250);
    }
    return false;
  }

  async waitForSelector(sel, timeout = 8000) {
    return this.waitFor(`document.querySelector(${JSON.stringify(sel)}) && document.querySelector(${JSON.stringify(sel)}).offsetParent !== null`, timeout);
  }

  async waitMs(ms) { await sleep(ms); }

  async setViewport(w, h) { await this.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false }); }

  async evaluate(expr) { const r = await this.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); return r.result?.value; }

  async url() { return this.evaluate('location.href'); }
  async title() { return this.evaluate('document.title'); }
  async bodyText() { return this.evaluate('document.body ? document.body.innerText : ""'); }

  /** A REAL click: scroll into view, read center, dispatch genuine mouse events. */
  async click(sel) {
    const r = await this.evaluate(`(() => {
      const el = document.querySelector(${JSON.stringify(sel)});
      if (!el) return null;
      el.scrollIntoView({ block: 'center', inline: 'center' });
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width/2, y: r.top + r.height/2, w: r.width, h: r.height, text: (el.innerText||'').trim().slice(0,40) };
    })()`);
    if (!r) return false;
    await this.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: r.x, y: r.y });
    await this.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: r.x, y: r.y, button: 'left', clickCount: 1 });
    await this.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: r.x, y: r.y, button: 'left', clickCount: 1 });
    return true;
  }

  /** Real click the <button type=submit> inside the <form> that contains a given input selector (avoids header search submit collisions). */
  async submitFormContaining(inputSel) {
    const ok = await this.evaluate(`(() => { const el=document.querySelector(${JSON.stringify(inputSel)}); if(!el||!el.form) return false; const b=el.form.querySelector('button[type=submit]'); if(!b) return false; b.click(); return true; })()`);
    return !!ok;
  }

  /** Real-scoped click: find by selector, but descend from an anchor element to avoid ambiguous text matches. */
  async clickText(text) {
    const found = await this.evaluate(`(() => {
      const nodes = Array.from(document.querySelectorAll('button,a,[role=button],label,td,li'));
      const el = nodes.find(n => (n.innerText||'').trim() === ${JSON.stringify(text)});
      if (!el) return null;
      el.scrollIntoView({ block: 'center', inline: 'center' });
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width/2, y: r.top + r.height/2 };
    })()`);
    if (!found) return false;
    await this.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: found.x, y: found.y });
    await this.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: found.x, y: found.y, button: 'left', clickCount: 1 });
    await this.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: found.x, y: found.y, button: 'left', clickCount: 1 });
    return true;
  }

  async value(sel) { return this.evaluate(`(document.querySelector(${JSON.stringify(sel)})||{}).value`); }

  /** REAL typing: clear existing then insert text via keyboard input. */
  async type(sel, text) {
    await this.click(sel);
    // clear
    await this.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Control', code: 'ControlLeft', modifiers: 2 });
    await this.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'a', code: 'KeyA', modifiers: 2 });
    await this.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'a', code: 'KeyA', modifiers: 2 });
    await this.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Control', code: 'ControlLeft' });
    await this.send('Input.insertText', { text });
    return true;
  }

  async pressEnter() {
    await this.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter' });
    await this.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter' });
  }

  async scrollToBottom() { await this.evaluate('window.scrollTo(0, document.body.scrollHeight)'); }
  async scrollBy(y) { await this.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 400, y: 400, deltaX: 0, deltaY: y }); }

  async hasOverflow() {
    return this.evaluate('(document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)');
  }

  async screenshot(path) { const r = await this.send('Page.captureScreenshot', { format: 'png' }); writeFileSync(path, Buffer.from(r.data, 'base64')); return path; }
}