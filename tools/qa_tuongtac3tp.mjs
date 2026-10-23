// UNIT TEST tương tác đồ theo 3 THÀNH PHỐ — hit-test đúng đồ đúng chỗ, menu đúng đồ
import { writeFileSync } from 'fs';
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
  const kq = [];
  const ok = (ten, dieu) => kq.push([dieu ? 'PASS' : 'FAIL', ten]);
  await send('Page.enable'); await send('Runtime.enable');
  await new Promise(r3 => setTimeout(r3, 3000));

  const TP_IDX = { saigon: 0, hanoi: 1, danang: 2 };

  // ==== BẢNG TEST: [TP, click canvas x,y, kỳ vọng menu.tieuDe === X hoặc action] ====
  const bangTest = [
    // SÀI GÒN — phòng trọ
    ['saigon', 77, 110, 'Tủ lạnh'],        // tủ lạnh 60-94
    ['saigon', 135, 125, 'Sofa nâu'],      // sofa 96-182 (KHÔNG phải Tivi!)
    ['saigon', 270, 110, 'Tivi CRT'],      // TV 244-304
    ['saigon', 210, 115, 'Máy tính'],      // bàn máy 186-242
    ['saigon', 35, 125, 'Giường'],         // giường 8-62
    // HÀ NỘI — phòng trọ
    ['hanoi', 50, 125, 'Giường'],          // giường 20-104
    ['hanoi', 158, 128, 'Bàn trà'],        // bàn trà 130-186
    ['hanoi', 256, 115, 'Tivi CRT'],       // TV kệ 228-284
    ['hanoi', 45, 45, 'Tủ kính'],          // cửa sổ gỗ (không menu → hopThoai)
    // ĐÀ NẴNG — phòng trọ
    ['danang', 55, 120, 'Giường'],         // giường 16-100
    ['danang', 158, 115, 'Võng mạt ca'],   // võng 114-202
    ['danang', 250, 120, 'Bàn trà'],       // bàn 220-280
    ['danang', 255, 45, 'Cửa sổ nhìn biển'], // cửa sổ biển 220-290
  ];

  for (const [tp, cx, cy, kieuVong] of bangTest) {
    // vào game với đúng TP
    await ev(`(function(){
      try{xoaSave()}catch(e){};
      chonTp = 0;
      for (let i = 0; i < ${TP_IDX[tp]}; i++) chinhTp(1);
      batDauTuMenu(); dongHopThoai();
      return G.thanhPhoKey;
    })()`);
    await new Promise(r3 => setTimeout(r3, 400));
    // CLICK vào đồ
    await ev(`(function(){
      const cv = document.getElementById('man-choi');
      const r = cv.getBoundingClientRect();
      cv.dispatchEvent(new PointerEvent('pointerdown', { clientX: r.left + ${cx} * r.width / 320, clientY: r.top + ${cy} * r.height / 240, bubbles: true }));
      return 'ok';
    })()`);
    await new Promise(r3 => setTimeout(r3, 2800)); // chờ đi tới + mở
    // đọc menu hoặc hộp thoại
    const kq2 = await ev(`(function(){
      const m = document.getElementById('menu-do');
      if (m) return { loai: 'menu', tieuDe: m.querySelector('div').textContent.replace('×','').trim() };
      const h = document.getElementById('hop-thoai');
      if (h && h.style.display === 'block') return { loai: 'thoai', tieuDe: h.querySelector('.nguoi') ? h.querySelector('.nguoi').textContent : '?' };
      return null;
    })()`);
    const okFlag = kq2 && kq2.tieuDe === kieuVong;
    ok(`[${tp}] chạm (${cx},${cy}) → ${kq2 ? kq2.tieuDe : 'KHÔNG MỞ'} (kỳ vọng ${kieuVong})`, okFlag);
    // đóng menu nếu mở
    await ev(`(function(){ const m = document.getElementById('menu-do'); if (m) m.remove(); dongHopThoai(); return 1; })()`);
  }

  // ==== UNIT TEST LỐI RA: chạm radiator KHÔNG đổi scene; chạm cửa sắt MỚI đổi ====
  const kqLoiRa = [];
  const okLR = (ten, dieu) => kqLoiRa.push([dieu ? 'PASS' : 'FAIL', ten]);
  // SG: chạm radiator (305, 125) → scene giữ nguyên phong_tro
  await ev(`(function(){
    try{xoaSave()}catch(e){};
    chonTp = 0; batDauTuMenu(); dongHopThoai();
    const cv = document.getElementById('man-choi');
    const r = cv.getBoundingClientRect();
    cv.dispatchEvent(new PointerEvent('pointerdown', { clientX: r.left + 305 * r.width / 320, clientY: r.top + 125 * r.height / 240, bubbles: true }));
    return 1;
  })()`);
  await new Promise(r3 => setTimeout(r3, 3000));
  const sc1 = await ev('SCENE_HIEN');
  okLR('[SG] chạm radiator (305,125) KHÔNG ra phố (scene = ' + sc1 + ')', sc1 === 'phong_tro');
  // SG: chạm cửa sắt (15, 110) → ĐỔI scene
  await ev(`(function(){
    const cv = document.getElementById('man-choi');
    const r = cv.getBoundingClientRect();
    cv.dispatchEvent(new PointerEvent('pointerdown', { clientX: r.left + 15 * r.width / 320, clientY: r.top + 80 * r.height / 240, bubbles: true }));
    return 1;
  })()`);
  await new Promise(r3 => setTimeout(r3, 3000));
  const sc2 = await ev('SCENE_HIEN');
  okLR('[SG] chạm cửa sắt (15,80) → ra phố (scene = ' + sc2 + ')', sc2 !== 'phong_tro');
  await ev('(function(){ if (SCENE_HIEN !== "phong_tro") doiSceneImLang("phong_tro"); return 1; })()');
  // HN: cửa (305, 100) → ra
  await ev(`(function(){
    try{xoaSave()}catch(e){};
    chonTp = 1; batDauTuMenu(); dongHopThoai();
    const cv = document.getElementById('man-choi');
    const r = cv.getBoundingClientRect();
    cv.dispatchEvent(new PointerEvent('pointerdown', { clientX: r.left + 305 * r.width / 320, clientY: r.top + 100 * r.height / 240, bubbles: true }));
    return 1;
  })()`);
  await new Promise(r3 => setTimeout(r3, 3000));
  const sc3 = await ev('SCENE_HIEN');
  okLR('[HN] chạm cửa (305,100) → ra phố (scene = ' + sc3 + ')', sc3 !== 'phong_tro');
  // ĐN: cửa (305, 110) → ra
  await ev(`(function(){
    try{xoaSave()}catch(e){};
    chonTp = 2; batDauTuMenu(); dongHopThoai();
    const cv = document.getElementById('man-choi');
    const r = cv.getBoundingClientRect();
    cv.dispatchEvent(new PointerEvent('pointerdown', { clientX: r.left + 305 * r.width / 320, clientY: r.top + 110 * r.height / 240, bubbles: true }));
    return 1;
  })()`);
  await new Promise(r3 => setTimeout(r3, 3000));
  const sc4 = await ev('SCENE_HIEN');
  okLR('[ĐN] chạm cửa (305,110) → ra phố (scene = ' + sc4 + ')', sc4 !== 'phong_tro');
  for (const [st, ten] of kqLoiRa) kq.push([st, ten]);

  console.log('=== UNIT TEST TƯƠNG TÁC 3 TP ===');
  for (const [st, ten] of kq) console.log(st + ' | ' + ten);
  const fail = kq.filter(x => x[0] === 'FAIL').length;
  console.log('---');
  console.log((kq.length - fail) + '/' + kq.length + ' PASS');
  await fetch('http://localhost:9222/json/close/' + tab.id);
  process.exit(fail > 0 ? 1 : 0);
}
main().catch(e => { console.log('LỖI:', e.message); process.exit(1); });
