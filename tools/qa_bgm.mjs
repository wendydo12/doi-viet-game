// QA nhạc mới: bấm nút trong game → BGM lofi 16bit phát thật + verify src
import { writeFileSync } from 'fs';
async function main() {
  const r = await fetch('http://localhost:9222/json/new?http://localhost:8210/index.html?nocache=' + Date.now(), { method: 'PUT' });
  const tab = await r.json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0; const pending = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
  const send = (method, params = {}) => { const i = ++id; return new Promise(res => { pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); }); };
  const ev = async (expr) => { const r2 = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r2.result && r2.result.exceptionDetails) return 'ERR:' + JSON.stringify(r2.result.exceptionDetails).slice(0, 150);
    return r2.result && r2.result.result ? r2.result.result.value : undefined; };
  await send('Page.enable'); await send('Runtime.enable');
  await new Promise(r3 => setTimeout(r3, 3000));
  // unregister SW + cache để nạp v9 sạch
  await ev('(async()=>{ const rs = await navigator.serviceWorker.getRegistrations(); for (const r of rs) await r.unregister(); const ks = await caches.keys(); for (const k of ks) await caches.delete(k); return true; })()');
  await send('Page.navigate', { url: 'http://localhost:8210/index.html?nocache=' + Date.now() });
  await new Promise(r3 => setTimeout(r3, 3000));
  console.log('src core:', await ev('(async()=>{ const t = await (await fetch("/src/core.js?v=9")).text(); return t.length; })()'));
  // vào game
  console.log('start:', await ev('(function(){ try{xoaSave()}catch(e){}; batDauTuMenu(); return G ? "OK" : "KHONG"; })()'));
  // BGM phải là file mới + đang phát
  const bgm = await ev('(function(){ const a = bgmAudio || (function(){ bgmBat(); return bgmAudio; })(); return a ? { src: a.src.split("/").pop(), playing: !a.paused, vol: a.volume, loop: a.loop, dur: a.duration } : "KHONG CO BGM"; })()');
  console.log('BGM:', JSON.stringify(bgm));
  await new Promise(r3 => setTimeout(r3, 1500));
  const bgm2 = await ev('(function(){ return bgmAudio ? { playing: !bgmAudio.paused, time: bgmAudio.currentTime.toFixed(1) } : "x"; })()');
  console.log('BGM sau 1.5s (đang trôi):', JSON.stringify(bgm2));
  // chụp 1 ảnh xác nhận game sống
  const s = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('/tmp/9tolife/qa/bgm_lofi.png', Buffer.from(s.result.data, 'base64'));
  console.log('shot ok');
  await fetch('http://localhost:9222/json/close/' + tab.id);
  process.exit(0);
}
main().catch(e => { console.log('LỖI:', e.message); process.exit(1); });
