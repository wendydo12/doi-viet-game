// Kiểm tra trình duyệt nạp đúng bản canh3tp mới: clear HTTP cache + typeof veChu
import { writeFileSync } from 'fs';
const PORT = 9222;
const tabs = await (await fetch(`http://localhost:${PORT}/json/new?${encodeURIComponent('http://localhost:8210/index.html?nocache=' + Date.now())}`, { method: 'PUT' })).json();
class CDP {
  constructor(wsUrl) { this.ws = new WebSocket(wsUrl); this.id = 0; this.pending = new Map();
    this.ws.onmessage = (m) => { const d = JSON.parse(m.data);
      if (d.id && this.pending.has(d.id)) { this.pending.get(d.id)(d); this.pending.delete(d.id); } }; }
  open() { return new Promise((res, rej) => { this.ws.onopen = res; this.ws.onerror = rej; }); }
  send(method, params = {}) { const id = ++this.id;
    return new Promise((res) => { this.pending.set(id, res); this.ws.send(JSON.stringify({ id, method, params })); }); }
  async eval(expr) { const r = await this.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    return r.result && r.result.result ? r.result.result.value : undefined; }
}
const c = new CDP(tabs.webSocketDebuggerUrl);
await c.open();
await c.send('Page.enable'); await c.send('Runtime.enable'); await c.send('Network.enable');
await c.send('Network.clearBrowserCache');
await c.send('Page.navigate', { url: 'http://localhost:8210/index.html?nocache=' + Date.now() });
await new Promise(r => setTimeout(r, 3500));
console.log('veChu:', await c.eval(`typeof veChu !== 'undefined' ? 'CÓ' : 'KHÔNG'`));
console.log('cửa sắt:', await c.eval(`canh3tpSrc = fetch('src/canh3tp.js?nocache=' + Date.now()).then(r=>r.text()).then(t => t.includes('280, 58, 34, 84') ? 'BẢN MỚI' : 'BẢN CŨ'); return null;`) || 'xem dưới');
const src = await c.eval(`fetch('src/canh3tp.js?nocache=' + Date.now()).then(r=>r.text()).then(t => t.includes('280, 58, 34, 84') ? 'BẢN MỚI' : 'BẢN CŨ')`);
console.log('server trả file:', src);
process.exit(0);
