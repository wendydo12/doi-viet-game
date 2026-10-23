// Chụp 4 ảnh QA theo nghề — chạy nền, không chặn
import { writeFileSync } from 'fs';
const PORT = 9222;
async function main() {
  const t0 = Date.now();
  const log = (m) => console.log('[' + Math.round((Date.now() - t0) / 1000) + 's] ' + m);
  const r = await fetch('http://localhost:' + PORT + '/json/new?http://localhost:8210/index.html?nocache=' + Date.now(), { method: 'PUT' });
  const tab = await r.json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  log('ws ok');
  let id = 0; const pending = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
  const send = (method, params = {}) => { const i = ++id; return new Promise(res => { pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); }); };
  const ev = async (expr) => {
    const r2 = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
    if (r2.result && r2.result.exceptionDetails) return 'ERR:' + JSON.stringify(r2.result.exceptionDetails).slice(0, 150);
    return r2.result && r2.result.result ? r2.result.result.value : undefined;
  };
  const shot = async (file) => {
    const s = await send('Page.captureScreenshot', { format: 'png' });
    if (s && s.result && s.result.data) { writeFileSync(file, Buffer.from(s.result.data, 'base64')); return 'ok'; }
    return 'NO DATA';
  };
  await send('Page.enable'); await send('Runtime.enable');
  await new Promise(r3 => setTimeout(r3, 2500));
  log('load xong — shipper');
  console.log(await ev('(function(){ try{xoaSave()}catch(e){}; chinhNghe(-1); chinhNghe(-1); chinhNghe(1); batDauTuMenu(); return G ? G.ngheKey : "x"; })()'));
  console.log(await ev('(function(){ G.thoiGian.gio=9; doiSceneImLang("pho_dem"); capNhatTatCa(); chuyenTab("lam"); return "scene " + SCENE_HIEN; })()'));
  log('shot shipper');
  console.log(await shot('/tmp/9tolife/qa/nghe_shipper.png'));
  log('menu → phụ quán');
  console.log(await ev('(function(){ hoiLaiChoi(); chinhNghe(1); batDauTuMenu(); return G ? G.ngheKey : "x"; })()'));
  console.log(await ev('(function(){ G.thoiGian.gio=7; doiSceneImLang("quan_pho"); capNhatTatCa(); chuyenTab("lam"); return "scene " + SCENE_HIEN; })()'));
  log('shot quan');
  console.log(await shot('/tmp/9tolife/qa/nghe_quan.png'));
  log('thăng chức');
  console.log(await ev('(function(){ G.kyNang.nauAn=3; capNhatTatCa(); chuyenTab("song"); return "ok"; })()'));
  console.log(await shot('/tmp/9tolife/qa/nghe_thang.png'));
  log('Tết');
  console.log(await ev('(function(){ G.thoiGian={ngay:6,thu:7,gio:8,phut:0,tuan:20,thang:2,nam:2027}; chaySuKien(); capNhatTatCa(); chuyenTab("song"); return "ok"; })()'));
  await new Promise(r4 => setTimeout(r4, 1200));
  console.log(await shot('/tmp/9tolife/qa/nghe_tet.png'));
  log('XONG');
  await fetch('http://localhost:' + PORT + '/json/close/' + tab.id);
  process.exit(0);
}
main().catch(e => { console.log('LỖI:', e.message); process.exit(1); });
