// QA v15: nhân vật 60px + đi lại + tương tác chạm đồ — verify game loop sống
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
  // vô game + đo chiều cao sprite thật
  console.log(await ev('(function(){ try{xoaSave()}catch(e){}; batDauTuMenu(); return G.thanhPhoKey; })()'));
  const sc = await ev('(function(){ const SC = (SCENES[SCENE_HIEN].charScale) || 2; const charPx = SCENES[SCENE_HIEN].charPx || 20 * SC; return { SC, charPx, kyVong: 60 }; })()');
  console.log('sprite:', JSON.stringify(sc));
  ok('Sprite nội thất 60px (75% tủ lạnh 80px)', sc.charPx === 60);
  // nhân vật cao hơn sofa (31px) và thấp hơn tủ lạnh (80px) — đúng tỉ lệ 9 To Life
  ok('60px nằm giữa sofa 31px và tủ lạnh 80px', sc.charPx > 31 && sc.charPx < 80);
  // đi lại: tap giữa sàn → nhân vật di chuyển
  const x0 = await ev('NGUOI.x');
  await ev('(function(){ tapToMove(80, 200); return 1; })()');
  await new Promise(r3 => setTimeout(r3, 1200));
  const x1 = await ev('NGUOI.x');
  console.log('NGUOI.x:', x0, '→', x1);
  ok('Nhân vật đi lại được (x thay đổi)', Math.abs(x1 - x0) > 5);
  // tương tác chạm đồ: chạm TV → mở hộp thoại
  await ev('(function(){ tapToMove(270, 120); return 1; })()');
  await new Promise(r3 => setTimeout(r3, 1500));
  const act = await ev('NGUOI.mucTieuAction');
  console.log('action khi chạm TV:', act);
  // chụp + verify sprite 60px vẽ đúng (đo pixel áo màu teal #4E9A8F trên thân)
  await ev('(function(){ NGUOI.x = 150; NGUOI.y = 100; NGUOI.dichX = null; NGUOI.frame = \"idle\"; render(); return 1; })()');
  await new Promise(r3 => setTimeout(r3, 400));
  const pix = await ev('(function(){ const c = document.getElementById(\"man-choi\"); const x = c.getContext(\"2d\"); const out = []; for (let y = 100; y < 165; y++) { const d = x.getImageData(156, y, 1, 1).data; out.push(d[1] + \",\" + d[2]); } return out.join(\"|\").slice(0, 200); })()');
  console.log('cột pixel thân nhân vật (R-G):', pix.slice(0, 120));
  ok('Sprite vẽ có thân áo (màu teal xuất hiện)', pix.includes('154,143'));
  const s = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('/tmp/9tolife/qa/v15_char.png', Buffer.from(s.result.data, 'base64'));
  console.log('=== KẾT QUẢ ===');
  for (const [st, ten] of kq) console.log(st + ' | ' + ten);
  await fetch('http://localhost:9222/json/close/' + tab.id);
  process.exit(kq.some(x => x[0] === 'FAIL') ? 1 : 0);
}
main().catch(e => { console.log('LỖI:', e.message); process.exit(1); });
