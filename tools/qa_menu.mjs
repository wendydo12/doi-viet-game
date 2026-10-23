// QA menu chọn TP: mở game → chụp menu → bấm mũi tên đổi TP 3 lần → chụp từng bước
import { writeFileSync } from 'fs';
const tabs = await (await fetch(`http://localhost:9222/json/new?${encodeURIComponent('http://localhost:8210/index.html?nocache=' + Date.now())}`, { method: 'PUT' })).json();
class CDP {
  constructor(wsUrl) { this.ws = new WebSocket(wsUrl); this.id = 0; this.pending = new Map();
    this.ws.onmessage = (m) => { const d = JSON.parse(m.data);
      if (d.id && this.pending.has(d.id)) { this.pending.get(d.id)(d); this.pending.delete(d.id); } }; }
  open() { return new Promise((res, rej) => { this.ws.onopen = res; this.ws.onerror = rej; }); }
  send(method, params = {}) { const id = ++this.id;
    return new Promise((res) => { this.pending.set(id, res); this.ws.send(JSON.stringify({ id, method, params })); }); }
  async eval(expr) { const r = await this.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    return r.result && r.result.result ? r.result.result.value : undefined; }
}
const c = new CDP(tabs.webSocketDebuggerUrl);
await c.open();
await c.send('Page.enable'); await c.send('Runtime.enable'); await c.send('Network.enable');
await c.send('Network.clearBrowserCache');
await c.send('Page.navigate', { url: 'http://localhost:8210/index.html?nocache=' + Date.now() });
await new Promise(r => setTimeout(r, 3500));
const OUT = '/tmp/9tolife/qa';
async function shot(name) {
  const b64 = await c.eval(`document.getElementById('man-choi') && !document.getElementById('menu').style.display ? document.getElementById('man-choi').toDataURL() : document.getElementById('menu').offsetHeight > 0 ? (() => { const s = document.createElement('canvas'); s.width = 480; s.height = 900; const x = s.getContext('2d'); x.fillStyle = '#0F1226'; x.fillRect(0,0,480,900); return 'MENU_ON'; })() : 'NO_MENU'`);
  console.log(name, b64 === 'MENU_ON' ? 'menu hiển thị' : b64);
}
// chụp menu thật bằng cách screenshot cả page
const shot2 = async (name) => {
  const b64 = await c.eval(`document.getElementById('menu').offsetHeight > 0 ? 'VISIBLE' : 'HIDDEN'`);
  console.log(name, 'menu:', b64);
};
console.log('menu visible:', await shot2('initial'));
// đổi TP qua mũi tên
for (const tp of ['hanoi', 'danang', 'saigon']) {
  const r = await c.eval(`chinhTp(1); document.getElementById('tao-tp').textContent`);
  console.log('TP hiện tại:', r);
}
// bấm start
const started = await c.eval(`batDauTuMenu(); G ? G.thanhPhoKey : 'ERR'`);
console.log('start →', started);
await new Promise(r => setTimeout(r, 1200));
const scene = await c.eval(`typeof SCENE_HIEN !== 'undefined' ? SCENE_HIEN : '?'`);
console.log('scene đầu:', scene);
// chụp canvas đầu game
const b64 = await c.eval(`document.getElementById('man-choi').toDataURL('image/png').split(',')[1]`);
writeFileSync(`${OUT}/menu_start_saigon.png`, Buffer.from(b64, 'base64'));
console.log('shot OK');
process.exit(0);
