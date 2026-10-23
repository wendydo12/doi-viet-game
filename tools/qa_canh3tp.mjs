// QA cảnh 3 thành phố — CDP: mở game, start từng TP, chụp canvas từng scene
// Node 22 WebSocket native. Xuất PNG để vision soi.
import { writeFileSync } from 'fs';

const PORT = 9222;
const OUT = '/tmp/9tolife/qa';
import { mkdirSync } from 'fs';
mkdirSync(OUT, { recursive: true });

async function newTab(url) {
  const r = await fetch(`http://localhost:${PORT}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' });
  return r.json();
}

class CDP {
  constructor(wsUrl) { this.ws = new WebSocket(wsUrl); this.id = 0; this.pending = new Map();
    this.ws.onmessage = (m) => { const d = JSON.parse(m.data);
      if (d.id && this.pending.has(d.id)) { this.pending.get(d.id)(d); this.pending.delete(d.id); } };
  }
  async open() { await new Promise((res, rej) => { this.ws.onopen = res; this.ws.onerror = rej; }); }
  send(method, params = {}) { const id = ++this.id;
    return new Promise((res) => { this.pending.set(id, res);
      this.ws.send(JSON.stringify({ id, method, params })); }); }
  async eval(expr) {
    const r = await this.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.result && r.result.exceptionDetails) return { error: JSON.stringify(r.result.exceptionDetails) };
    return r.result && r.result.result ? r.result.result.value : undefined;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const tab = await newTab('http://localhost:8210/index.html?nocache=' + Date.now());
const c = new CDP(tab.webSocketDebuggerUrl);
await c.open();
await c.send('Page.enable'); await c.send('Runtime.enable');
await sleep(3000);
// CHỐNG SW CACHE CŨ: unregister + xóa caches + nạp lại với cache-buster
await c.eval(`(async () => {
  const rs = await navigator.serviceWorker.getRegistrations();
  for (const r of rs) await r.unregister();
  const ks = await caches.keys();
  for (const k of ks) await caches.delete(k);
  return rs.length + '/' + ks.length;
})()`);
await c.send('Page.navigate', { url: 'http://localhost:8210/index.html?nocache=' + Date.now() });
await sleep(3500);
console.log('SW cleared, fresh load. Canh3tp check:', await c.eval(`typeof window.CANH !== 'undefined' ? Object.keys(window.CANH).join(',') : 'MISSING'`));

// chụp canvas hiện tại
async function shot(name) {
  const b64 = await c.eval(`document.getElementById('man-choi').toDataURL('image/png').split(',')[1]`);
  if (!b64) { console.log(name, 'FAIL — canvas null'); return; }
  writeFileSync(`${OUT}/${name}.png`, Buffer.from(b64, 'base64'));
  console.log(name, 'OK');
}

const TPS = ['saigon', 'hanoi', 'danang'];
const SCENES = ['phong_tro', 'quan_pho', 'van_phong', 'pho_dem', 'bia_hoi'];

for (const tp of TPS) {
  // start game với TP chỉ định (gọi trực tiếp API game)
  const ok = await c.eval(`(() => {
    localStorage.removeItem('com_bui_save_v3');
    localStorage.removeItem('com_bui_save');
    for (const k of Object.keys(localStorage)) if (k.includes('com_bui')) localStorage.removeItem(k);
    location.reload();
    return true;
  })()`);
  await sleep(2500);
  const started = await c.eval(`(() => {
    try {
      if (typeof xoaSave === 'function') xoaSave();
      chonTp = TP_KEYS.indexOf('${tp}');
      batDauTuMenu();
      return G && G.thanhPhoKey;
    } catch (e) { return 'ERR ' + e.message; }
  })()`);
  console.log(`[${tp}] start:`, started);
  await sleep(1500);
  for (const sc of SCENES) {
    const sw = await c.eval(`(() => { try { doiSceneImLang('${sc}'); G.thanhPhoKey='${tp}'; if(G.thanhPho)G.thanhPho.key='${tp}'; render(); render(); return 'ok'; } catch(e){ return 'ERR '+e.message; } })()`);
    await sleep(300);
    await shot(`${tp}_${sc}`);
    if (sw && sw !== 'ok') console.log(`  [${tp}/${sc}]`, sw);
  }
}

// lưu key save thật để lần sau dùng đúng
const keys = await c.eval(`Object.keys(localStorage).join(',')`);
console.log('localStorage keys:', keys);
await c.send('Page.close').catch(() => {});
process.exit(0);
