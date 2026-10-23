// Mở tab meowa.ai qua CDP + check login/balance
async function main() {
  const r = await fetch('http://localhost:9222/json/new?https://meowa.ai', { method: 'PUT' });
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
  await send('Page.enable');
  await new Promise(r3 => setTimeout(r3, 8000));
  const bal = await ev(`(async () => {
    try {
      const r = await fetch('https://api.meowa.ai/api/credits/balance', { credentials: 'include' });
      if (!r.ok) return 'HTTP ' + r.status;
      const d = await r.json();
      return JSON.stringify(d);
    } catch (e) { return 'LOI: ' + e.message; }
  })()`);
  console.log('balance:', bal);
  // đếm tab meowa để đóng sạch sau
  const tabs = await (await fetch('http://localhost:9222/json/list')).json();
  const meowaTabs = tabs.filter(t => t.url.includes('meowa'));
  console.log('tabs meowa:', meowaTabs.length);
  for (const t of meowaTabs.slice(0, -0)) await fetch('http://localhost:9222/json/close/' + t.id);
  process.exit(0);
}
main().catch(e => { console.log('ERR', e.message); process.exit(1); });
