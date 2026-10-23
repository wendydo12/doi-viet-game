// Pixel scan sofa + giường — verify từng màu trên canvas OFF (không qua MAIN)
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
    if (r2.result && r2.result.exceptionDetails) return 'ERR:' + JSON.stringify(r2.result.exceptionDetails).slice(0, 120);
    return r2.result && r2.result.result ? r2.result.result.value : undefined;
  };
  await send('Page.enable');
  await new Promise(r3 => setTimeout(r3, 3000));
  console.log('start:', await ev('(function(){ try{xoaSave()}catch(e){}; batDauTuMenu(); return G.thanhPhoKey; })()'));
  const diem = [[101,110,'tay_vin_trai'],[100,100,'dinh_tay_vin'],[118,113,'dem_lung_1'],[145,113,'dem_lung_2'],[120,130,'dem_ngoi_1'],[147,130,'dem_ngoi_2'],[137,120,'khe_giua'],[20,126,'giuong_nem'],[22,118,'goi'],[28,137,'men_xanh'],[5,120,'dau_giuong_go']];
  for (const [x, y, ten] of diem) {
    const v = await ev('(function(){ try { const d = document.getElementById("man-choi").getContext("2d").getImageData(' + x + ',' + y + ',1,1).data; return [d[0],d[1],d[2]].join(","); } catch(e) { return "ERR:" + e.message; } })()');
    console.log(ten, '=', v);
  }
  await fetch('http://localhost:9222/json/close/' + tab.id);
  process.exit(0);
}
main().catch(e => { console.log('LỖI:', e.message); process.exit(1); });
