// QA PWA qua CDP — register SW → emulate offline → reload → game vẫn chạy?
const PORT = 9222;

async function newTab(url) {
  const r = await fetch(`http://localhost:${PORT}/json/new?${url}`, { method: 'PUT' });
  return r.json();
}

class CDP {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.pending = new Map();
    this.ready = new Promise((res, rej) => { this.ws.onopen = res; this.ws.onerror = rej; });
    this.ws.onmessage = (m) => {
      const msg = JSON.parse(m.data);
      if (msg.id && this.pending.has(msg.id)) {
        const p = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? p.reject(new Error(JSON.stringify(msg.error))) : p.resolve(msg.result);
      }
    };
  }
  send(method, params) {
    return new Promise((resolve, reject) => {
      const id = ++this.id;
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params: params || {} }));
    });
  }
  async eval(expr, awaitPromise) {
    const r = await this.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: !!awaitPromise });
    if (r.exceptionDetails) throw new Error('JS: ' + JSON.stringify(r.exceptionDetails).slice(0, 300));
    return r.result.value;
  }
  close() { this.ws.close(); }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const tab = await newTab('http://localhost:8211/index.html');
  const c = new CDP(tab.webSocketDebuggerUrl);
  await c.ready;
  await c.send('Page.enable');
  await c.send('Runtime.enable');
  await c.send('Network.enable');
  await sleep(4000);

  // 1) SW đã register?
  const swState = await c.eval(`(function(){
    if (!('serviceWorker' in navigator)) return 'no-sw';
    return new Promise(function(res){
      navigator.serviceWorker.getRegistration().then(function(r){
        if (!r) return res('not-registered');
        var st = (r.active && r.active.state) || (r.installing && r.installing.state) || (r.waiting && r.waiting.state) || '?';
        res('registered:' + ((r.active && r.active.scriptURL) || '?') + '|state:' + st);
      });
    });
  })()`, true);
  console.log('SW:', swState);

  // 2) Game sống khi online?
  const alive = await c.eval(`(function(){
    return { title: document.title, hasCanvas: !!document.querySelector('canvas'), bodyLen: document.body.innerText.length };
  })()`);
  console.log('LIVE:', JSON.stringify(alive));

  // 3) Đợi SW active
  await c.eval(`(function(){
    return new Promise(function(res){
      var r = navigator.serviceWorker.getRegistration();
      if (!r) return res('none');
      if (r.active) return res('active');
      var done = false;
      function chk(){ if (!done && r.active) { done = true; res('active'); } }
      chk();
      if (r.installing) r.installing.onstatechange = function(){ if (r.active) res('active'); };
      setTimeout(function(){ res('timeout-state:' + (r.installing ? r.installing.state : '?')); }, 8000);
    });
  })()`, true).then(function(s) { console.log('SW state cuối:', s); });

  // 4) Precache bao nhiêu entry?
  const precache = await c.eval(`(function(){
    return new Promise(function(res){ caches.open('com-bui-v1').then(function(c){ return c.keys(); }).then(function(k){ res(k.length + ' entries'); }); });
  })()`, true);
  console.log('Cache precache:', precache);

  // 5) OFFLINE thật
  await c.send('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
  await sleep(300);
  await c.send('Page.reload');
  await sleep(6000);

  // 6) Game offline phải sống từ cache
  const offline = await c.eval(`(function(){
    return { title: document.title, hasCanvas: !!document.querySelector('canvas'), bodyLen: document.body.innerText.length, swCtrl: !!navigator.serviceWorker.controller };
  })()`);
  console.log('OFFLINE:', JSON.stringify(offline));

  // 7) Assets offline
  const assets = await c.eval(`(function(){
    function img(url){ return new Promise(function(r){ var i = new Image(); i.onload = function(){ r(1); }; i.onerror = function(){ r(0); }; setTimeout(function(){ r(0); }, 5000); i.src = url; }); }
    function aud(url){ return new Promise(function(r){ var a = new Audio(); a.oncanplaythrough = function(){ r(1); }; a.onerror = function(){ r(0); }; setTimeout(function(){ r(0); }, 7000); a.src = url; }); }
    return Promise.all([
      img('/assets/bg/phong-tro.png'),
      aud('/assets/sfx/bgm_arcade_melody.mp3'),
      img('/assets/icon-192.png'),
      fetch('/manifest.webmanifest').then(function(r){ return r.status; }, function(){ return 0; })
    ]);
  })()`, true);
  console.log('ASSETS OFFLINE [bg, sfx, icon, manifest]:', JSON.stringify(assets));

  // 8) Save localStorage
  const keys = await c.eval(`(function(){ return Object.keys(localStorage).length + ' keys: ' + Object.keys(localStorage).join(','); })()`);
  console.log('SAVE:', keys);

  await c.send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
  c.close();
  await fetch(`http://localhost:${PORT}/json/close/${tab.id}`);
  console.log('QA-PWA DONE');
  process.exit(0);
})().catch(function(e) { console.error('QA FAIL:', e.message); process.exit(1); });
