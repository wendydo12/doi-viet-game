// Crop CHÍNH XÁC canvas (bằng CDP lấy bounding box) rồi zoom vùng nhân vật
import { writeFileSync } from 'fs';
const PORT = 9222;
const tabs = await (await fetch(`http://localhost:${PORT}/json/list`)).json();
const tab = tabs.find((t) => t.type === 'page' && t.url.includes('8210'));
if (!tab) { console.log('no tab'); process.exit(0); }
class CDP {
  constructor(wsUrl) { this.ws = new WebSocket(wsUrl); this.id = 0; this.pending = new Map();
    this.ws.onmessage = (m) => { const d = JSON.parse(m.data);
      if (d.id && this.pending.has(d.id)) { this.pending.get(d.id)(d); this.pending.delete(d.id); } }; }
  async open() { await new Promise((res, rej) => { this.ws.onopen = res; this.ws.onerror = rej; }); }
  send(method, params = {}) { const id = ++this.id;
    return new Promise((res) => { this.pending.set(id, res); this.ws.send(JSON.stringify({ id, method, params })); }); }
  async eval(expr) {
    const r = await this.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.result && r.result.exceptionDetails) return { err: JSON.stringify(r.result.exceptionDetails).slice(0, 200) };
    return r.result && r.result.result ? r.result.result.value : undefined;
  }
}
const c = new CDP(tab.webSocketDebuggerUrl);
await c.open();
await c.send('Page.enable');
const bbox = await c.eval(`(() => {
  const el = document.getElementById('man-choi');
  const r = el.getBoundingClientRect();
  const n = NGUOI;
  return JSON.stringify({ l: r.left, t: r.top, w: r.width, h: r.height, nx: n.x, ny: n.y, dpr: window.devicePixelRatio });
})()`);
console.log('bbox:', bbox);
const r = await c.send('Page.captureScreenshot', { format: 'png' });
writeFileSync('/tmp/9tolife/qa/page_crop.png', Buffer.from(r.result.data, 'base64'));
// crop + zoom bằng PIL
const { execSync } = await import('child_process');
const bb = JSON.parse(bbox);
const dpr = bb.dpr || 1;
const L = Math.max(0, Math.round((bb.l + (bb.nx - 20) / 320 * bb.w) * dpr));
const T = Math.max(0, Math.round((bb.t + (bb.ny - 30) / 240 * bb.h) * dpr));
const CW = Math.round(44 / 320 * bb.w * dpr);
const CH = Math.round(56 / 240 * bb.h * dpr);
execSync(`python3 -c "
from PIL import Image
im = Image.open('/tmp/9tolife/qa/page_crop.png')
c = im.crop(${L}, ${T}, ${L + CW}, ${T + CH})
c = c.resize((c.width*6, c.height*6), Image.NEAREST)
c.save('/tmp/9tolife/qa/char_final2.png')
print('ok', c.size)
"`);
c.ws.close();