// Verify tương tác chạm đồ vật thật qua PointerEvent
async function main() {
  const r = await fetch('http://localhost:9222/json/new?http://localhost:8211/index.html?nocache=' + Date.now(), { method: 'PUT' });
  const tab = await r.json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0; const pending = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
  const send = (method, params = {}) => { const i = ++id; return new Promise(res => { pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); }); };
  const ev = async (expr) => {
    const r2 = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r2.result && r2.result.exceptionDetails) return 'ERR:' + JSON.stringify(r2.result.exceptionDetails).slice(0, 130);
    return r2.result && r2.result.result ? r2.result.result.value : undefined;
  };
  await send('Page.enable');
  await new Promise(r3 => setTimeout(r3, 3000));
  console.log('start:', await ev('(function(){ try{xoaSave()}catch(e){}; batDauTuMenu(); dongHopThoai(); return SCENE_HIEN; })()'));
  // CLICK THẬT bằng PointerEvent như người chơi: chạm TỦ LẠNH canvas (77,110)
  const click = await ev(`(function(){
    const cv = document.getElementById('man-choi');
    const r = cv.getBoundingClientRect();
    const cx = r.left + 77 * r.width / 320, cy = r.top + 110 * r.height / 240;
    cv.dispatchEvent(new PointerEvent('pointerdown', { clientX: cx, clientY: cy, bubbles: true }));
    return 'clicked';
  })()`);
  console.log(click);
  for (let i = 0; i < 10; i++) {
    await new Promise(r3 => setTimeout(r3, 500));
    const a = await ev('NGUOI.mucTieuAction');
    if (a) { console.log('sau', (i + 1) * 0.5 + 's action =', a); break; }
  }
  await new Promise(r3 => setTimeout(r3, 2500));
  console.log('NGUOI:', JSON.stringify(await ev('({x: NGUOI.x, y: NGUOI.y})')));
  console.log('dialog:', await ev('document.getElementById("hop-thoai").textContent.slice(0, 70)'));
  // thử chạm SOFA (130, 125)
  await ev(`(function(){
    const cv = document.getElementById('man-choi');
    const r = cv.getBoundingClientRect();
    cv.dispatchEvent(new PointerEvent('pointerdown', { clientX: r.left + 130 * r.width / 320, clientY: r.top + 125 * r.height / 240, bubbles: true }));
    return 'ok';
  })()`);
  for (let i = 0; i < 10; i++) {
    await new Promise(r3 => setTimeout(r3, 500));
    const a = await ev('NGUOI.mucTieuAction');
    if (a) { console.log('sofa action =', a); break; }
  }
  await new Promise(r3 => setTimeout(r3, 2500));
  console.log('dialog sofa:', await ev('document.getElementById("hop-thoai").textContent.slice(0, 70)'));
  await fetch('http://localhost:9222/json/close/' + tab.id);
  process.exit(0);
}
main().catch(e => { console.log('LỖI:', e.message); process.exit(1); });
