// Debug G.thanhPhoKey + diemHienTai keys theo TP
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
  for (const tp of ['saigon', 'hanoi', 'danang']) {
    await ev(`(function(){
      try{xoaSave()}catch(e){};
      for (let i = 0; i < 3; i++) chinhTp(1);
      for (let i = 0; i < ${TP_IDX[tp]}; i++) chinhTp(1);
      batDauTuMenu(); dongHopThoai();
      return 1;
    })()`);
    await new Promise(r3 => setTimeout(r3, 400));
    const s = await ev('(function(){ return { G: G.thanhPhoKey, chonTp, scene: SCENE_HIEN, keys: Object.keys(diemHienTai()).join(","), canhCoVong: typeof CANH[G.thanhPhoKey].phong_tro === "function" }; })()');
    console.log(`[${tp}]`, JSON.stringify(s));
  }
  await fetch('http://localhost:9222/json/close/' + tab.id);
  process.exit(0);
}
main().catch(e => { console.log('LỖI:', e.message); process.exit(1); });
