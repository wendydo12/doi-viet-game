// Quét OFF canvas ở toạ độ game: tìm mọi pixel KHÁC màu tường trong vùng tường phòng trọ SG
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
const out = await c.eval(`(() => {
  const cv = document.createElement('canvas'); cv.width = 320; cv.height = 240;
  const c2 = cv.getContext('2d');
  c2.imageSmoothingEnabled = false;
  c2.drawImage(document.getElementById('man-choi'), 0, 0, 320, 240);
  const d = c2.getImageData(0, 0, 320, 240).data;
  const wall = [127, 160, 168];
  // vùng tường: y 5..135, x 0..320 — tìm pixel khác tường, gom cụm
  const clusters = [];
  const seen = new Set();
  for (let y = 5; y < 135; y++) {
    for (let x = 0; x < 320; x++) {
      const i = (y * 320 + x) * 4;
      const p = [d[i], d[i+1], d[i+2]];
      if (Math.abs(p[0]-wall[0])+Math.abs(p[1]-wall[1])+Math.abs(p[2]-wall[2]) > 12) {
        const k = x + ',' + y;
        if (seen.has(k)) continue;
        // flood fill nhỏ
        const stack = [[x,y]]; const pts = []; const col = p.join(',');
        while (stack.length && pts.length < 200) {
          const [px, py] = stack.pop();
          const kk = px + ',' + py;
          if (seen.has(kk) || px<0 || px>319 || py<0 || py>134) continue;
          const j = (py*320+px)*4;
          const q = [d[j], d[j+1], d[j+2]];
          if (q.join(',') !== col && Math.abs(q[0]-p[0])+Math.abs(q[1]-p[1])+Math.abs(q[2]-p[2]) > 12) continue;
          seen.add(kk); pts.push([px, py]);
          stack.push([px+1,py],[px-1,py],[px,py+1],[px,py-1]);
        }
        const xs = pts.map(p=>p[0]), ys = pts.map(p=>p[1]);
        const bx = Math.min(...xs), by = Math.min(...ys);
        const bw = Math.max(...xs)-bx+1, bh = Math.max(...ys)-by+1;
        if (pts.length >= 4) clusters.push({ x: bx, y: by, w: bw, h: bh, n: pts.length, c: col });
      }
    }
  }
  return JSON.stringify(clusters);
})()`);
console.log(out);
c.ws.close();