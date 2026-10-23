// Scan canvas tang lễ: tìm cụm màu bia + kiểm tra chữ R.I.P ở đâu
import { writeFileSync } from 'fs';
const PORT = 9222;
const tabs = await (await fetch(`http://localhost:${PORT}/json/list`)).json();
const tab = tabs.find(t => t.type === 'page');
const ws = new WebSocket(tab.webSocketDebuggerUrl);
let id = 0; const pend = new Map();
function send(m, p) { return new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method: m, params: p || {} })); }); }
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m.result); pend.delete(m.id); } };
await new Promise(r => ws.onopen = r);

await send('Page.enable');
await send('Page.navigate', { url: 'http://localhost:8210/index.html?nocache=' + Date.now() });
await new Promise(r => setTimeout(r, 4000));
await send('Runtime.evaluate', { expression: `navigator.serviceWorker.getRegistration().then(r=>r&&r.unregister());'ok'` });
await send('Page.reload');
await new Promise(r => setTimeout(r, 3500));

await send('Runtime.evaluate', { expression: `xoaSave(); chonTp=0; batDauTuMenu(); 'ok'` });
await new Promise(r => setTimeout(r, 1200));
await send('Runtime.evaluate', { expression: `chet(G,'sét đánh khi chạy bộ giữa giông','Sét đánh trúng cây cách hai con phố.'); G.npc.forEach(n=>{if(n.quanHe<40)n.quanHe=50;}); kiemTraChet(); 'ok'` });
await new Promise(r => setTimeout(r, 1000));

const ev = await send('Runtime.evaluate', { expression: `(() => {
  const c = document.getElementById('cv-tang');
  if (!c) return { err: 'no cv-tang' };
  const ctx = c.getContext('2d');
  const d = ctx.getImageData(0, 0, c.width, c.height).data;
  // tìm cụm màu bia (#8A8A96 = 138,138,150)
  let minx = 999, maxx = 0, miny = 999, maxy = 0, n = 0;
  for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
    const i = (y * c.width + x) * 4;
    if (Math.abs(d[i] - 138) < 10 && Math.abs(d[i + 1] - 138) < 10 && Math.abs(d[i + 2] - 150) < 10) {
      n++; if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y;
    }
  }
  return { W: c.width, H: c.height, bia: { minx, maxx, miny, maxy, n }, overlayVisible: document.getElementById('van-bia').style.display };
})()`, returnByValue: true });
console.log(JSON.stringify(ev.result));
ws.close();
