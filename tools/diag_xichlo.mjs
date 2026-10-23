// Chẩn đoán: xích lô HN.pho_dem có được vẽ không?
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
    if (r.result && r.result.exceptionDetails) return { err: JSON.stringify(r.result.exceptionDetails).slice(0, 400) };
    return r.result && r.result.result ? r.result.result.value : undefined;
  }
}
const c = new CDP(tab.webSocketDebuggerUrl);
await c.open();

console.log('1. CANH keys:', await c.eval(`typeof CANH !== 'undefined' ? Object.keys(CANH).join(',') : 'UNDEF'`));
console.log('2. G.thanhPhoKey:', await c.eval(`G && G.thanhPhoKey`));
console.log('3. SCENE_HIEN:', await c.eval(`SCENE_HIEN`));
// gọi trực tiếp HN.pho_dem, bắt lỗi
console.log('4. call HN.pho_dem:', await c.eval(`(() => { try { doiSceneImLang('pho_dem'); CANH.hanoi.pho_dem(); return 'OK'; } catch(e) { return 'ERR: ' + e.message; } })()`));
// đọc pixel OFF canvas tại chỗ xích lô (OFF 160x120, game x=206,y=166 → OFF 103,83)
console.log('5. pixel OFF (103,83) [bánh trước]:', await c.eval(`(() => { const d = OFF.getContext('2d').getImageData(103,83,1,1).data; return [...d].join(','); })()`));
// render đầy đủ rồi đọc MAIN canvas tại (206,166)
console.log('6. render:', await c.eval(`(() => { try { render(); return 'OK'; } catch(e) { return 'ERR: ' + e.message; } })()`));
console.log('7. pixel MAIN (206,166):', await c.eval(`(() => { const cv = document.getElementById('man-choi'); const d = cv.getContext('2d').getImageData(206,166,1,1).data; return [...d].join(','); })()`));
console.log('8. pixel MAIN (210,150) [khoang xám]:', await c.eval(`(() => { const cv = document.getElementById('man-choi'); const d = cv.getContext('2d').getImageData(210,150,1,1).data; return [...d].join(','); })()`));
// xuất PNG hiện trạng
const b64 = await c.eval(`document.getElementById('man-choi').toDataURL('image/png').split(',')[1]`);
if (b64 && typeof b64 === 'string') { writeFileSync('/tmp/9tolife/qa/diag_hanoi_pho_dem.png', Buffer.from(b64, 'base64')); console.log('9. diag PNG saved'); }
process.exit(0);
