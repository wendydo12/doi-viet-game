// QA NPC trong scene — CDP: verify napNpcScene, tap NPC → đi tới → moNpc, bubble typewriter
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
await sleep(3000);
// SW cache-first đang phục render8.js CŨ — unregister + xóa cache + reload
await c.eval(`(async () => {
  const rs = await navigator.serviceWorker.getRegistrations();
  for (const r of rs) await r.unregister();
  const ks = await caches.keys();
  for (const k of ks) await caches.delete(k);
  return rs.length + '/' + ks.length;
})()`);
await c.send('Page.navigate', { url: 'http://localhost:8211/index.html?nocache=' + Date.now() });
await sleep(3000);
console.log('0. render8 new?', await c.eval(`typeof NPC_HIENTAI !== 'undefined' ? 'YES' : 'NO — old cached'`));

// start game Sài Gòn
console.log('1. start:', await c.eval(`(() => { try { if (typeof xoaSave==='function') xoaSave(); chonTp=0; batDauTuMenu(); dongHopThoai(); return G.thanhPhoKey + ' npc:' + G.npc.length; } catch(e){ return 'ERR '+e.message; } })()`));

// scene phong_tro có NPC chưa
console.log('2. phong_tro NPC:', await c.eval(`JSON.stringify(NPC_HIENTAI.map(n=>({id:n.id,x:n.x,y:n.y})))`));

// đổi sang van_phong (3 NPC) + đi tới Linh bằng tap
await c.eval(`doiSceneImLang('van_phong')`);
await sleep(300);
console.log('3. van_phong NPC:', await c.eval(`JSON.stringify(NPC_HIENTAI.map(n=>n.id))`));

// tap vào Linh (x=50) — giả lập pointerdown trên canvas
const tap = await c.eval(`(() => {
  const npc = NPC_HIENTAI.find(n=>n.id==='linh');
  tapToMove(npc.x + 5, npc.y + 20);
  return JSON.stringify({action: NGUOI.mucTieuAction, targetX: NGUOI.mucTieuX, npcX: npc.x});
})()`);
console.log('4. tap Linh:', tap);

// chờ nhân vật đi tới (mỗi tick rAF; 300 bước max)
for (let i = 0; i < 60; i++) {
  await c.eval(`buocChuyen()`);
  const done = await c.eval(`NGUOI.dichX === null && NGUOI.mucTieuAction === null ? 'arrived' : 'walking x='+Math.round(NGUOI.x)`);
  if (done === 'arrived') { console.log('5. arrived after', i, 'ticks'); break; }
  if (i === 59) console.log('5. TIMEOUT still:', done);
}
// moNpc được gọi khi tới nơi? kiểm tra panel npc-chi-tiet hiện
console.log('6. npc panel visible:', await c.eval(`document.getElementById('npc-chi-tiet').style.display`));
await c.eval(`document.getElementById('npc-chi-tiet').style.display='none'`);

// ambient chatter: ép bubble rồi render, chụp ảnh
await c.eval(`(() => { const n = NPC_HIENTAI[0]; n.bubble = { text: 'Nghe nói sếp Đức lại tăng chỉ tiêu đó...', progress: 12, until: TG + 400 }; n.icon = { kind: 'gian', until: TG + 400 }; render(); })()`);
await sleep(400);
const shot = await c.send('Page.captureScreenshot', { format: 'png' });
writeFileSync('/tmp/9tolife/qa/npc_bubble.png', Buffer.from(shot.result.data, 'base64'));
console.log('7. bubble screenshot OK');

// typewriter: progress tăng theo render?
const p1 = await c.eval(`NPC_HIENTAI[0].bubble.progress`);
await c.eval(`render(); render();`);
const p2 = await c.eval(`NPC_HIENTAI[0].bubble.progress`);
console.log('8. typewriter:', p1, '->', p2, p2 > p1 ? 'PASS' : 'FAIL');

// người yêu marker: set banGai = linh
console.log('9. marker ny:', await c.eval(`(() => { G.banGai = { npcId: 'linh', ngayChot: 5 }; render(); return 'set'; })()`));
const shot2 = await c.send('Page.captureScreenshot', { format: 'png' });
writeFileSync('/tmp/9tolife/qa/npc_marker.png', Buffer.from(shot2.result.data, 'base64'));
console.log('10. marker screenshot OK');
process.exit(0);
