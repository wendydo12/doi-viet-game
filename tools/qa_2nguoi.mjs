// Verify NPC + player không đè nhau khi mới vào
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
  await ev('(function(){ try{xoaSave()}catch(e){}; chonTp=0; batDauTuMenu(); dongHopThoai(); return 1; })()');
  const vtri = await ev('(function(){ const n = NPC_HIENTAI[0]; return { pX: NGUOI.x, nX: n.x, nY: n.y, pY: NGUOI.y, chongX: !(NGUOI.x + 36 < n.x || n.x + 36 < NGUOI.x) }; })()');
  console.log('vị trí:', JSON.stringify(vtri));
  console.log(vtri.chongX ? 'CANH BAO: chồng X' : 'OK: không chồng X — NPC không đè player');
  const s = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('/tmp/9tolife/qa/v37_2nguoi.png', Buffer.from(s.result.data, 'base64'));
  await fetch('http://localhost:9222/json/close/' + tab.id);
  process.exit(0);
}
main().catch(e => { console.log('LỖI:', e.message); process.exit(1); });
