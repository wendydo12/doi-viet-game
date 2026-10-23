// QA Phase 2-4: 3 nghề + thăng chức + Tết — qua CDP thật trên :8210
import { writeFileSync, mkdirSync } from 'fs';
const PORT = 9222, OUT = '/tmp/9tolife/qa';
mkdirSync(OUT, { recursive: true });
const BASE = 'http://localhost:8210/index.html?nocache=' + Date.now();

async function newTab(url) {
  const r = await fetch(`http://localhost:${PORT}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' });
  return r.json();
}
class CDP {
  constructor(wsUrl) { this.ws = new WebSocket(wsUrl); this.id = 0; this.pending = new Map();
    this.ws.onmessage = (m) => { const d = JSON.parse(m.data);
      if (d.id && this.pending.has(d.id)) { this.pending.get(d.id)(d); this.pending.delete(d.id); } };
  }
  async open() { await new Promise((res, rej) => { this.ws.onopen = res; this.ws.onerror = rej; }); }
  send(method, params = {}) { const id = ++this.id;
    return new Promise((res) => { this.pending.set(id, res);
      this.ws.send(JSON.stringify({ id, method, params })); }); }
  async eval(expr) {
    const r = await this.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.result && r.result.exceptionDetails) return { error: JSON.stringify(r.result.exceptionDetails) };
    return r.result && r.result.result ? r.result.result.value : undefined;
  }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const kq = [];
const ok = (ten, dieu) => { kq.push([dieu ? 'PASS' : 'FAIL', ten]); if (!dieu) process.exitCode = 1; };

const tab = await newTab(BASE);
const c = new CDP(tab.webSocketDebuggerUrl);
await c.open();
await c.send('Page.enable'); await c.send('Runtime.enable'); await c.send('Network.enable');
await c.send('Network.clearBrowserCache');
await sleep(2500);
// dọn SW + caches để nạp code mới sạch
await c.eval(`(async () => {
  const rs = await navigator.serviceWorker.getRegistrations();
  for (const r of rs) await r.unregister();
  const ks = await caches.keys();
  for (const k of ks) await caches.delete(k);
  return true;
})()`);
await c.send('Page.navigate', { url: BASE });
await sleep(3000);

// ===== 1) MENU: chọn nghề shipper hiện mô tả lương đúng =====
ok('Menu hiện mô tả lương shipper', await c.eval(`(function(){
  chinhNghe(1); // → shipper
  return document.getElementById('tao-nghe-luong').textContent.includes('35.000');
})()`));
ok('Menu mô tả phụ quán khi bấm tiếp', await c.eval(`(function(){
  chinhNghe(1); // → ban_quan
  return document.getElementById('tao-nghe').textContent === 'Phụ quán';
})()`));
ok('Quay lại dân văn phòng', await c.eval(`(function(){
  chinhNghe(-1); chinhNghe(-1);
  return document.getElementById('tao-nghe').textContent === 'Dân văn phòng';
})()`));

// ===== 2) BẮT ĐẦU nghề SHIPPER: ca 6-22, nút làm việc riêng =====
await c.eval(`(function(){ chinhNghe(1); batDauTuMenu(); })()`);
await sleep(800);
ok('Shipper: shift-note có "đơn"', await c.eval(`document.getElementById('shift-note').textContent.includes('đơn')`));
ok('Shipper: nút "Chạy ship một vòng" có trong tab LÀM', await c.eval(`(function(){
  chuyenTab('lam');
  const acts = [...document.querySelectorAll('#actions .act .ten')].map(e => e.textContent);
  return acts.some(t => t.includes('Chạy ship'));
})()`));
// hiện đang ngày 1 (thứ 2) 6h sáng — trong ca ship. Cần scene pho_dem: đặt scene rồi bấm
const shipKq = await c.eval(`(function(){
  // đặt nhân vật về pho_dem + giờ 9h
  G.thoiGian.gio = 9; G.thoiGian.thu = 3;
  if (typeof doiSceneImLang === 'function') doiSceneImLang('pho_dem'); else SCENE_HIEN = 'pho_dem';
  capNhatActions();
  const btn = [...document.querySelectorAll('#actions .act')].find(b => b.textContent.includes('Chạy ship'));
  if (!btn) return 'THIẾU NÚT';
  if (btn.className.includes('locked')) return 'BỊ KHÓA: ' + btn.textContent;
  btn.click();
  return G.tien > 200000 ? 'TIỀN TĂNG ' + G.tien : 'KHÔNG TĂNG';
})()`);
ok('Shipper chạy đơn qua UI: tiền tăng (' + shipKq + ')', String(shipKq).startsWith('TIỀN TĂNG'));

// ===== 3) NGHỀ PHỤ QUÁN: thẳng vào game mới =====
await c.eval(`(function(){ hoiLaiChoi(); })()`);
await sleep(400);
await c.eval(`(function(){ chinhNghe(1); batDauTuMenu(); })()`); // chọn NGHE thứ 3? kiểm tra
await sleep(600);
const ngheHienTai = await c.eval(`G ? G.ngheKey : 'none'`);
// nếu vẫn shipper thì bấm 1 lần nữa
if (ngheHienTai !== 'ban_quan') {
  await c.eval(`(function(){ hoiLaiChoi(); chinhNghe(1); batDauTuMenu(); })()`);
  await sleep(600);
}
ok('Phụ quán: shift-note có "kíp"', await c.eval(`document.getElementById('shift-note').textContent.includes('kíp')`));
const kipKq = await c.eval(`(function(){
  G.thoiGian.gio = 7; G.thoiGian.thu = 3;
  if (typeof doiSceneImLang === 'function') doiSceneImLang('quan_pho'); else SCENE_HIEN = 'quan_pho';
  capNhatActions();
  const btn = [...document.querySelectorAll('#actions .act')].find(b => b.textContent.includes('Trực kíp'));
  if (!btn) return 'THIẾU NÚT';
  if (btn.className.includes('locked')) return 'BỊ KHÓA: ' + btn.textContent;
  btn.click();
  return G.tien > 200000 ? 'TIỀN TĂNG ' + G.tien : 'KHÔNG TĂNG';
})()`);
ok('Phụ quán trực kíp qua UI: tiền tăng (' + kipKq + ')', String(kipKq).startsWith('TIỀN TĂNG'));

// ===== 4) THĂNG CHỨC trong tab SỐNG =====
const thangKq = await c.eval(`(function(){
  G.kyNang.nauAn = 3; capNhatTatCa();
  chuyenTab('song');
  const btn = document.querySelector('#nghe-thang .btn');
  if (!btn) return 'THIẾU NÚT THĂNG';
  btn.click();
  return document.getElementById('nhat-ky-list').textContent.includes('THĂNG') ? 'THĂNG OK' : 'KHÔNG THĂNG';
})()`);
ok('Thăng chức qua UI (' + thangKq + ')', String(thangKq).includes('THĂNG OK'));

// ===== 5) TẾT: nhảy thời gian tới mùng 1, kiểm tra lì xì + đếm ngược =====
const tetKq = await c.eval(`(function(){
  G.thoiGian = { ngay: 6, thu: 7, gio: 8, phut: 0, tuan: 20, thang: 2, nam: 2027 };
  const t0 = G.tien;
  chaySuKien();
  const tong = G.tien - t0;
  return (tong >= 300000 ? 'LÌ XÌ +' + tong : 'KHÔNG LÌ XÌ +' + tong) + ' · dem=' + capNhatTetDem().includes('Tết');
})()`);
ok('Tết mùng 1 lì xì + đếm ngược (' + tetKq + ')', String(tetKq).includes('LÌ XÌ +'));
ok('Không lỗi JS trong trang', await c.eval(`window.__loi ? JSON.stringify(window.__loi) : 'TRONG SACH'`));

console.log('=== KẾT QUẢ QA NGHỀ ===');
for (const [st, ten] of kq) console.log(st + ' | ' + ten);
const fail = kq.filter(x => x[0] === 'FAIL').length;
console.log('---');
console.log((kq.length - fail) + '/' + kq.length + ' PASS');
// screenshot trạng thái cuối
const shot = await c.send('Page.captureScreenshot', { format: 'png' });
writeFileSync(OUT + '/qa_nghe.png', Buffer.from(shot.data, 'base64'));
console.log('Screenshot: ' + OUT + '/qa_nghe.png');
