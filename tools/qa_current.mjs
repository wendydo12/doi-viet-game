// Chụp toàn trang + canvas — bản sửa lỗi (wrap eval an toàn)
import { writeFileSync } from 'fs';
const PORT = 9222;
const tabs = await (await fetch(`http://localhost:${PORT}/json/list`)).json();
let tab = tabs.find((t) => t.type === 'page' && t.url.includes('8210'));
if (!tab) {
  const r = await fetch(`http://localhost:${PORT}/json/new?${encodeURIComponent('http://localhost:8210/index.html?nocache=' + Date.now())}`, { method: 'PUT' });
  tab = await r.json();
  await new Promise((s) => setTimeout(s, 3500));
}
const ws = new WebSocket(tab.webSocketDebuggerUrl);
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
await new Promise((r) => { ws.onopen = r; });
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
  return r.result && r.result.result ? r.result.result.value : undefined;
};
await send('Page.enable');
await send('Page.navigate', { url: 'http://localhost:8210/index.html?nocache=' + Date.now() });
await new Promise((r) => setTimeout(r, 2500));
await ev(`(async () => { const rs = await navigator.serviceWorker.getRegistrations(); for (const r of rs) await r.unregister(); const ks = await caches.keys(); for (const k of ks) await caches.delete(k); return 1; })()`);
await send('Page.navigate', { url: 'http://localhost:8210/index.html?nocache=' + Date.now() });
await new Promise((r) => setTimeout(r, 2500));
console.log('start:', await ev(`(() => { try { if (typeof xoaSave==='function') xoaSave(); chonTp=0; batDauTuMenu(); dongHopThoai(); doiSceneImLang('phong_tro'); render(); return 'ok ' + G.thanhPhoKey; } catch(e){ return 'ERR '+e.message; } })()`));
await new Promise((r) => setTimeout(r, 800));
const shot = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync('/tmp/9tolife/qa/current_page.png', Buffer.from(shot.result.data, 'base64'));
const b64 = await ev(`document.getElementById('man-choi').toDataURL('image/png').split(',')[1]`);
if (b64) writeFileSync('/tmp/9tolife/qa/current_canvas.png', Buffer.from(b64, 'base64'));
console.log('captured', b64 ? 'canvas ok' : 'canvas FAIL');
process.exit(0);
