// Zoom chụp shift-note + panel SỐNG ở scale 2 (không nhúng code dài trong CLI)
import { writeFileSync } from 'fs';
async function main() {
  const r = await fetch('http://localhost:9222/json/new?http://localhost:8210/index.html?nocache=' + Date.now(), { method: 'PUT' });
  const tab = await r.json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0; const pending = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
  const send = (method, params = {}) => { const i = ++id; return new Promise(res => { pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); }); };
  const ev = async (expr) => { const r2 = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
    return r2.result && r2.result.result ? r2.result.result.value : undefined; };
  await send('Page.enable');
  await new Promise(r3 => setTimeout(r3, 3000));
  console.log(await ev('(function(){ try{xoaSave()}catch(e){}; batDauTuMenu(); G.kyNang.vanPhong=2.5; G.npc.find(n=>n.id==="duc").quanHe=40; document.querySelector("#nghe-thang .btn").click(); G.thoiGian={ngay:6,thu:7,gio:8,phut:0,tuan:20,thang:2,nam:2027}; chaySuKien(); capNhatTatCa(); chuyenTab("song"); dongHopThoai(); return "ok"; })()'));
  const rect = await ev('(function(){ const r = document.getElementById("shift-note").getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, text: document.getElementById("shift-note").textContent }; })()');
  console.log('SHIFT NOTE TEXT:', rect.text);
  const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: rect.x, y: rect.y, width: rect.w, height: rect.h, scale: 2 } });
  writeFileSync('/tmp/9tolife/qa/shift_zoom.png', Buffer.from(shot.result.data, 'base64'));
  const rect2 = await ev('(function(){ const r = document.getElementById("ky-nang-list").getBoundingClientRect(); const r2 = document.getElementById("nghe-thang").getBoundingClientRect(); return { x: r.x, y: r.y, w: Math.max(r.width, r2.width), h: r.height + r2.height + 20 }; })()');
  const shot2 = await send('Page.captureScreenshot', { format: 'png', clip: { x: rect2.x, y: rect2.y, width: rect2.w, height: rect2.h, scale: 2 } });
  writeFileSync('/tmp/9tolife/qa/so_ng_zoom.png', Buffer.from(shot2.result.data, 'base64'));
  console.log('zoom shots ok');
  await fetch('http://localhost:9222/json/close/' + tab.id);
  process.exit(0);
}
main().catch(e => { console.log('ERR', e.message); process.exit(1); });
