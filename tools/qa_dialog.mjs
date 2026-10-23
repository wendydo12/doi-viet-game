// QA dialog mới — mở hopThoai + chụp screenshot qua CDP
import { writeFileSync } from 'fs';
const PORT = 9222;
const tabs = await (await fetch(`http://localhost:${PORT}/json/list`)).json();
const tab = tabs.find((t) => t.type === 'page' && t.url.includes('8210'));
class CDP {
  constructor(wsUrl) { this.ws = new WebSocket(wsUrl); this.id = 0; this.pending = new Map();
    this.ws.onmessage = (m) => { const d = JSON.parse(m.data);
      if (d.id && this.pending.has(d.id)) { this.pending.get(d.id)(d); this.pending.delete(d.id); } }; }
  async open() { await new Promise((res, rej) => { this.ws.onopen = res; this.ws.onerror = rej; }); }
  send(method, params = {}) { const id = ++this.id;
    return new Promise((res) => { this.pending.set(id, res); this.ws.send(JSON.stringify({ id, method, params })); }); }
  async eval(expr) {
    const r = await this.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.result && r.result.exceptionDetails) return { err: JSON.stringify(r.result.exceptionDetails).slice(0, 300) };
    return r.result && r.result.result ? r.result.result.value : undefined;
  }
}
const c = new CDP(tab.webSocketDebuggerUrl);
await c.open();
await c.send('Page.enable');
await c.send('Page.reload');
await new Promise((r) => setTimeout(r, 3000));
// mở dialog mẫu đúng style 9 To Life — PHẢI start game trước (menu đè z-index 60)
await c.eval(`(() => {
  if (typeof xoaSave === 'function') xoaSave();
  chonTp = 0; // Sài Gòn
  batDauTuMenu();
  return G && G.thanhPhoKey;
})()`);
await new Promise((r) => setTimeout(r, 1200));
// đóng dialog chào của Bà Tư nếu có, rồi mở dialog test
await c.eval(`dongHopThoai()`);
await c.eval(`(() => {
  hopThoai('Bà Tư chủ trọ', 'Con chạy giữa trời giông làm gì vậy hả?\\nSét đánh cái cây cách hai con phố đó.\\nBà chưa thấy ai gan vậy luôn. (Lần sau đừng làm vậy nữa nha con.)');
  return 'opened';
})()`);
await new Promise((r) => setTimeout(r, 500));
const shot = await c.send('Page.captureScreenshot', { format: 'png' });
writeFileSync('/tmp/9tolife/qa/dialog_moi.png', Buffer.from(shot.result.data, 'base64'));
console.log('dialog screenshot OK');
process.exit(0);
