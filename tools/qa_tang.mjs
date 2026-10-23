// QA màn tang lễ — ép chết, verify scene + overlay + screenshot
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
await c.send('Page.navigate', { url: 'http://localhost:8210/index.html?nocache=' + Date.now() });
await sleep(2500);
await c.eval(`(async () => { const rs = await navigator.serviceWorker.getRegistrations(); for (const r of rs) await r.unregister(); const ks = await caches.keys(); for (const k of ks) await caches.delete(k); return 1; })()`);
await c.send('Page.navigate', { url: 'http://localhost:8210/index.html?nocache=' + Date.now() });
await sleep(2500);

console.log('1. start:', await c.eval(`(() => { try { if (typeof xoaSave==='function') xoaSave(); chonTp=0; batDauTuMenu(); dongHopThoai(); return G.thanhPhoKey; } catch(e){ return 'ERR '+e.message; } })()`));
// cho vài NPC quan hệ >= 40 để có khách đưa tang
console.log('2. set quan hệ:', await c.eval(`(() => { let dem=0; for (const n of G.npc) { if (dem<5) { n.quanHe=60; n.ban=60; dem++; } } return dem; })()`));
// ép chết: sét đánh (giống Tom 9 To Life)
console.log('3. chet:', await c.eval(`(() => { try { chet(G, 'sét đánh khi chạy bộ giữa giông', 'Bạn chạy xuyên qua cơn giông. Sét đánh trúng cái cây cách hai con phố. Bạn chưa bao giờ thấy mình sống động đến thế. (Xin đừng làm vậy lần nữa.)'); kiemTraChet(); return 'daChet=' + !!G.daChet; } catch(e){ return 'ERR '+e.message; } })()`));
await sleep(600);
console.log('4. overlay visible:', await c.eval(`document.getElementById('van-bia').style.display`));
console.log('5. scene:', await c.eval(`SCENE_HIEN`));
console.log('6. epitaph fields:', await c.eval(`JSON.stringify({bimat: document.getElementById('vb-bimat').textContent.slice(0,40), nguoilai: document.getElementById('vb-nguoilai').textContent.slice(0,40), khach: document.getElementById('vb-khach').textContent.slice(0,40)})`));
console.log('7. cv-tang size:', await c.eval(`(() => { const cv=document.getElementById('cv-tang'); return cv.width+'x'+cv.height; })()`));
const shot = await c.send('Page.captureScreenshot', { format: 'png' });
writeFileSync('/tmp/9tolife/qa/tang_le_overlay.png', Buffer.from(shot.result.data, 'base64'));
console.log('8. screenshot overlay OK');
// chụp riêng canvas tang lễ
const b64 = await c.eval(`document.getElementById('cv-tang').toDataURL('image/png').split(',')[1]`);
writeFileSync('/tmp/9tolife/qa/tang_le_canvas.png', Buffer.from(b64, 'base64'));
console.log('9. canvas tang lễ OK');
process.exit(0);
