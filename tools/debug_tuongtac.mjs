// DEBUG: log chi tiết từng click 3 TP
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
    if (r2.result && r2.result.exceptionDetails) return 'ERR:' + JSON.stringify(r2.result.exceptionDetails).slice(0, 150);
    return r2.result && r2.result.result ? r2.result.result.value : undefined;
  };
  await send('Page.enable'); await send('Runtime.enable');
  await new Promise(r3 => setTimeout(r3, 3000));
  const TP_IDX = { saigon: 0, hanoi: 1, danang: 2 };
  const bang = [
    ['saigon', 35, 125, 'Giường'],
    ['hanoi', 50, 125, 'Giường'],
    ['hanoi', 158, 128, 'Bàn trà'],
    ['danang', 55, 120, 'Giường'],
    ['danang', 250, 120, 'Bàn trà'],
    ['danang', 255, 45, 'Cửa sổ'],
  ];
  for (const [tp, cx, cy, ten] of bang) {
    await ev(`(function(){
      try{xoaSave()}catch(e){};
      for (let i = 0; i < 3; i++) chinhTp(1);
      for (let i = 0; i < ${TP_IDX[tp]}; i++) chinhTp(1);
      batDauTuMenu(); dongHopThoai();
      return 1;
    })()`);
    await new Promise(r3 => setTimeout(r3, 400));
    const hit = await ev(`(function(){
      const diem = diemHienTai();
      let hitTen = null, hitAct = null;
      for (const [t, [px, py, pw, ph, a]] of Object.entries(diem)) {
        if (${cx} >= px && ${cx} <= px+pw && ${cy} >= py && ${cy} <= py+ph) { hitTen = t; hitAct = a; break; }
      }
      return { hitTen, hitAct, keys: Object.keys(diem).join(',') };
    })()`);
    console.log(`[${tp}] (${cx},${cy}) hit:`, JSON.stringify(hit));
    await ev(`(function(){
      const cv = document.getElementById('man-choi');
      const r = cv.getBoundingClientRect();
      cv.dispatchEvent(new PointerEvent('pointerdown', { clientX: r.left + ${cx} * r.width / 320, clientY: r.top + ${cy} * r.height / 240, bubbles: true }));
      return 1;
    })()`);
    for (let i = 0; i < 12; i++) {
      await new Promise(r3 => setTimeout(r3, 500));
      const m = await ev(`(function(){
        const m = document.getElementById('menu-do');
        if (m) return 'MENU:' + m.querySelector('div').textContent.replace('×','').trim();
        const h = document.getElementById('hop-thoai');
        if (h && h.style.display === 'block') return 'THOAI:' + (h.querySelector('.nguoi') ? h.querySelector('.nguoi').textContent : '?') + ' / ' + h.textContent.slice(0, 40);
        return null;
      })()`);
      if (m) { console.log('  sau', (i + 1) * 0.5 + 's →', m); break; }
    }
    await ev(`(function(){ const m = document.getElementById('menu-do'); if (m) m.remove(); dongHopThoai(); return 1; })()`);
  }
  await fetch('http://localhost:9222/json/close/' + tab.id);
  process.exit(0);
}
main().catch(e => { console.log('LỖI:', e.message); process.exit(1); });
