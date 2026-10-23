// Chụp cận sprite nhân vật mới — crop quanh NGUOI, zoom 6x
import { writeFileSync } from 'fs';
const PORT = 9222;
const tabs = await (await fetch(`http://localhost:${PORT}/json/list`)).json();
const tab = tabs.find((t) => t.type === 'page' && t.url.includes('8210'));
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
await sleep(2500);
await c.eval(`(async () => { const rs = await navigator.serviceWorker.getRegistrations(); for (const r of rs) await r.unregister(); const ks = await caches.keys(); for (const k of ks) await caches.delete(k); return 1; })()`);
await c.send('Page.navigate', { url: 'http://localhost:8211/index.html?nocache=' + Date.now() });
await sleep(2500);
await c.eval(`(() => { if (typeof xoaSave==='function') xoaSave(); chonTp=1; batDauTuMenu(); dongHopThoai(); doiSceneImLang('quan_pho'); return 1; })()`);
await sleep(800);
// crop quanh NGUOI + NPC, zoom 5x, trả base64
const b64 = await c.eval(`(() => {
  const cv = document.getElementById('man-choi');
  const out = document.createElement('canvas');
  const Z = 5;
  const x0 = Math.max(0, NGUOI.x - 60), y0 = Math.max(0, NGUOI.y - 30);
  out.width = 130 * Z; out.height = 110 * Z;
  const o = out.getContext('2d');
  o.imageSmoothingEnabled = false;
  o.drawImage(cv, x0, y0, 130, 110, 0, 0, 130 * Z, 110 * Z);
  return out.toDataURL('image/png').split(',')[1];
})()`);
writeFileSync('/tmp/9tolife/qa/sprite_new_zoom.png', Buffer.from(b64, 'base64'));
console.log('sprite zoom OK');
// toàn cảnh quán phở HN với NPC
const full = await c.eval(`document.getElementById('man-choi').toDataURL('image/png').split(',')[1]`);
writeFileSync('/tmp/9tolife/qa/hanoi_quan_pho_npc.png', Buffer.from(full, 'base64'));
console.log('full scene OK');
process.exit(0);
