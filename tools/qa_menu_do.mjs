// QA v23: (1) sprite 45px nhỏ mảnh, (2) viền trắng nhấp nháy + nhãn khi hover, (3) menu Win95 khi click đồ
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
    if (r2.result && r2.result.exceptionDetails) return 'ERR:' + JSON.stringify(r2.result.exceptionDetails).slice(0, 130);
    return r2.result && r2.result.result ? r2.result.result.value : undefined;
  };
  const kq = [];
  const ok = (ten, dieu) => kq.push([dieu ? 'PASS' : 'FAIL', ten]);
  await send('Page.enable'); await send('Runtime.enable');
  await new Promise(r3 => setTimeout(r3, 3000));
  console.log(await ev('(function(){ try{xoaSave()}catch(e){}; batDauTuMenu(); dongHopThoai(); return G.thanhPhoKey; })()'));

  // 1) sprite 45px
  const sc = await ev('(function(){ const SC = SCENES[SCENE_HIEN].charScale || 2; return { charPx: SCENES[SCENE_HIEN].charPx || 15 * SC, hang: CHAR_FRAMES.idle.length }; })()');
  console.log('sprite:', JSON.stringify(sc));
  ok('Sprite 45px nhỏ mảnh (15 hàng)', sc.charPx === 45 && sc.hang === 15);
  ok('45px < tủ lạnh 66px (nhỏ hơn tủ)', sc.charPx < 66);

  // 2) hover đồ → viền nhấp nháy + nhãn
  const hover = await ev(`(function(){
    const cv = document.getElementById('man-choi');
    const r = cv.getBoundingClientRect();
    // chuột rê vào tủ lạnh (77, 110)
    cv.dispatchEvent(new PointerEvent('pointermove', { clientX: r.left + 77 * r.width / 320, clientY: r.top + 110 * r.height / 240, bubbles: true }));
    return HOVER_DIEM ? { ten: HOVER_DIEM.ten, act: HOVER_DIEM.action } : null;
  })()`);
  console.log('hover:', JSON.stringify(hover));
  ok('Hover tủ lạnh → HOVER_DIEM có + nhãn', hover && hover.ten === 'tu_lanh');
  // chụp 2 frame viền 2 tông
  await ev('(function(){ render(); return 1; })()');
  const s1 = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('/tmp/9tolife/qa/vien_nhay_t1.png', Buffer.from(s1.result.data, 'base64'));
  await new Promise(r3 => setTimeout(r3, 450));
  await ev('(function(){ render(); return 1; })()');
  const s2 = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('/tmp/9tolife/qa/vien_nhay_t2.png', Buffer.from(s2.result.data, 'base64'));

  // 3) click đồ → menu Win95
  await ev(`(function(){
    const cv = document.getElementById('man-choi');
    const r = cv.getBoundingClientRect();
    cv.dispatchEvent(new PointerEvent('pointerdown', { clientX: r.left + 77 * r.width / 320, clientY: r.top + 110 * r.height / 240, bubbles: true }));
    return 'ok';
  })()`);
  await new Promise(r3 => setTimeout(r3, 3500));
  const menu = await ev('(function(){ const m = document.getElementById("menu-do"); return m ? { tieuDe: m.querySelector("div").textContent.slice(0, 20), soNut: m.querySelectorAll(".md-nut").length, coHuy: !!m.querySelector(".md-nut[data-huy]") } : null; })()');
  console.log('menu:', JSON.stringify(menu));
  ok('Click tủ lạnh → menu Win95 mở với nút lựa chọn', menu && menu.soNut >= 2 && menu.coHuy);
  const s3 = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('/tmp/9tolife/qa/menu_win95.png', Buffer.from(s3.result.data, 'base64'));
  // chọn nút đầu → hành động chạy
  await ev('(function(){ const b = document.querySelector(".md-nut[data-act]"); if (b) b.click(); return 1; })()');
  await new Promise(r3 => setTimeout(r3, 1500));
  const dlg = await ev('document.getElementById("hop-thoai").textContent.slice(0, 40)');
  console.log('sau chọn:', dlg);
  ok('Chọn nút → hành động chạy (dialog/hoạt động)', dlg.length > 5);

  console.log('=== KẾT QUẢ QA v23 ===');
  for (const [st, ten] of kq) console.log(st + ' | ' + ten);
  await fetch('http://localhost:9222/json/close/' + tab.id);
  process.exit(kq.some(x => x[0] === 'FAIL') ? 1 : 0);
}
main().catch(e => { console.log('LỖI:', e.message); process.exit(1); });
