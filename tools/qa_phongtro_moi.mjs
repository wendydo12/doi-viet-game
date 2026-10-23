// QA视觉 phòng trọ mới — chụp canvas 3 TP (phong_tro) phóng to để soi từng chi tiết
import { writeFileSync } from 'fs';
async function main() {
  const r = await fetch('http://localhost:9222/json/new?http://localhost:8211/index.html?nocache=' + Date.now(), { method: 'PUT' });
  const tab = await r.json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0; const pending = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
  const send = (method, params = {}) => { const i = ++id; return new Promise(res => { pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); }); };
  const ev = async (expr) => { const r2 = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r2.result && r2.result.exceptionDetails) return 'ERR:' + JSON.stringify(r2.result.exceptionDetails).slice(0, 150);
    return r2.result && r2.result.result ? r2.result.result.value : undefined; };
  const shotData = async (expr) => {
    const r2 = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    return r2.result && r2.result.result ? r2.result.result.value : null;
  };
  await send('Page.enable'); await send('Runtime.enable');
  await new Promise(r3 => setTimeout(r3, 3000));
  await ev('(async()=>{ const rs = await navigator.serviceWorker.getRegistrations(); for (const r of rs) await r.unregister(); const ks = await caches.keys(); for (const k of ks) await caches.delete(k); return 1; })()');
  await send('Page.navigate', { url: 'http://localhost:8211/index.html?nocache=' + Date.now() });
  await new Promise(r3 => setTimeout(r3, 3000));
  for (const tp of ['saigon', 'hanoi', 'danang']) {
    await ev(`(function(){ try{xoaSave()}catch(e){}; localStorage.setItem('cb-chon-tp','${tp}'); chonTp=${{saigon:0,hanoi:1,danang:2}[tp]}; batDauTuMenu(); doiSceneImLang('phong_tro'); return SCENE_HIEN + '/' + G.thanhPhoKey; })()`);
    await new Promise(r3 => setTimeout(r3, 600));
    const data = await shotData(`(function(){ const c = document.getElementById('man-choi'); const z = document.createElement('canvas'); z.width = 640; z.height = 480; const x = z.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(c, 0, 0, 640, 480); return z.toDataURL('image/png'); })()`);
    if (data) {
      writeFileSync(`/tmp/9tolife/qa/pt_${tp}_zoom.png`, Buffer.from(data.split(',')[1], 'base64'));
      console.log('shot', tp);
    }
  }
  await fetch('http://localhost:9222/json/close/' + tab.id);
  process.exit(0);
}
main().catch(e => { console.log('LỖI:', e.message); process.exit(1); });
