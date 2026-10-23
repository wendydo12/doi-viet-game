// Chụp TOÀN TRANG (HUD + canvas + panel + dialog) — verify icon pixel mới
import { writeFileSync } from 'fs';
const PORT = 9222;
const tabs = await (await fetch(`http://localhost:${PORT}/json/list`)).json();
const tab = tabs.find((t) => t.type === 'page' && t.url.includes('8210'));
if (!tab) { console.log('no game tab'); process.exit(0); }
class CDP {
  constructor(wsUrl) { this.ws = new WebSocket(wsUrl); this.id = 0; this.pending = new Map();
    this.ws.onmessage = (m) => { const d = JSON.parse(m.data);
      if (d.id && this.pending.has(d.id)) { this.pending.get(d.id)(d); this.pending.delete(d.id); } }; }
  async open() { await new Promise((res, rej) => { this.ws.onopen = res; this.ws.onerror = rej; }); }
  send(method, params = {}) { const id = ++this.id;
    return new Promise((res) => { this.pending.set(id, res); this.ws.send(JSON.stringify({ id, method, params })); }); }
  async eval(expr) {
    const r = await this.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.result && r.result.exceptionDetails) return { err: JSON.stringify(r.result.exceptionDetails).slice(0, 300) };
    return r.result && r.result.result ? r.result.result.value : undefined;
  }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const c = new CDP(tab.webSocketDebuggerUrl);
await c.open();
await c.send('Page.enable');
await c.send('Page.navigate', { url: 'http://localhost:8211/index.html?nocache=' + Date.now() });
await sleep(3500);
// unregister SW + xóa cache để nạp pixelicons.js mới
await c.eval(`(async () => {
  const rs = await navigator.serviceWorker.getRegistrations();
  for (const r of rs) await r.unregister();
  const ks = await caches.keys();
  for (const k of ks) await caches.delete(k);
})()`);
await c.send('Page.navigate', { url: 'http://localhost:8211/index.html' });
await sleep(4000);
const start = await c.eval(`(async () => {
  if (typeof xoaSave === 'function') { try { xoaSave(); } catch(e){} }
  if (typeof chonTp !== 'undefined') chonTp = 0;
  if (typeof batDauTuMenu === 'function') batDauTuMenu();
  await new Promise(r => setTimeout(r, 800));
  return (typeof pixIcon === 'function') ? 'ok pixelicons loaded' : 'pixelicons KHONG co';
})()`);
console.log('start:', typeof start === 'object' ? JSON.stringify(start) : start);
// mở dialog
await c.eval(`if (typeof hopThoai === 'function') hopThoai('Linh', 'Phu quan oi, hom nay dep qua!')`);
await sleep(900);
const r = await c.send('Page.captureScreenshot', { format: 'png' });
writeFileSync('/tmp/9tolife/qa/full_page_v3.png', Buffer.from(r.result.data, 'base64'));
console.log('full page v3 OK');
c.ws.close();