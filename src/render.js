// RENDER v2 — dùng sprite meowa 16-bit (scene + char) thay vẽ tay
const CANVAS = document.getElementById('man-choi');
const CTX = CANVAS.getContext('2d');
CTX.imageSmoothingEnabled = false;

const TILE = 16;
const MAP_W = 20, MAP_H = 15;
const MAP_KICHTHUOC = MAP_W * TILE; // 320

// Asset meowa (preload)
const IMG = {};
const DANHSACH_IMG = [
  ['scene', 'assets/meowa-r1/scene_00.png'],
  ['char',  'assets/meowa-r1/char_00.png'],
  ['food0', 'assets/meowa-r1/food_00.png'],
  ['food1', 'assets/meowa-r1/food_01.png'],
  ['food2', 'assets/meowa-r1/food_02.png'],
  ['food3', 'assets/meowa-r1/food_03.png'],
];
let DA_TAI = 0;
DANHSACH_IMG.forEach(([ten, duong]) => {
  const im = new Image();
  im.onload = () => { DA_TAI++; if (DA_TAI === DANHSACH_IMG.length) render(); };
  im.src = duong;
  IMG[ten] = im;
});

let NGUOI = { x: 140, y: 150, f: 0, huong: 1 }; // pixel coords
const TOCDO = 12;

function render() {
  if (DA_TAI < DANHSACH_IMG.length) return;
  // Scene meowa làm background (crop fit 320x240 từ giữa)
  CTX.drawImage(IMG.scene, 0, 0, 511, 369, 0, 0, 320, 240);
  // Vùng an toàn: vignette nhẹ dưới để nhân vật nổi
  const grad = CTX.createLinearGradient(0, 160, 0, 240);
  grad.addColorStop(0, 'rgba(26,22,38,0)');
  grad.addColorStop(1, 'rgba(26,22,38,0.25)');
  CTX.fillStyle = grad;
  CTX.fillRect(0, 160, 320, 80);
  // Nhân vật 48px → thu về 34px trên canvas (nearest) + outline + rim light đèn
  const px = NGUOI.x - 22, py = NGUOI.y - 38;
  // Bóng dưới chân (trước nhân vật)
  CTX.fillStyle = 'rgba(26,22,38,0.4)';
  CTX.beginPath();
  CTX.ellipse(NGUOI.x, NGUOI.y + 3, 14, 4, 0, 0, Math.PI * 2);
  CTX.fill();
  // Outline: vẽ sprite lệch 4 hướng màu tối (sel-out)
  CTX.globalCompositeOperation = 'source-over';
  for (const [ox, oy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
    CTX.drawImage(IMG.char, 0, 0, 48, 48, px + ox, py + oy, 44, 44);
  }
  // Tối hoá outline: vẽ đè sprite gốc qua filter tối màu
  CTX.save();
  CTX.filter = 'brightness(0) saturate(100%)';
  for (const [ox, oy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
    CTX.drawImage(IMG.char, 0, 0, 48, 48, px + ox, py + oy, 44, 44);
  }
  CTX.restore();
  // Sprite thật
  CTX.drawImage(IMG.char, 0, 0, 48, 48, px, py, 44, 44);
  // Rim light vàng ấm từ đèn trần (phía trên)
  CTX.save();
  CTX.filter = 'brightness(1.25) sepia(0.35) saturate(1.4)';
  CTX.beginPath();
  CTX.rect(px - 2, py - 2, 48, 16);
  CTX.clip();
  CTX.drawImage(IMG.char, 0, 0, 48, 48, px, py, 44, 44);
  CTX.restore();
}

// Di chuyển mượt (phím + chạm) theo pixel
const PHIM = {};
window.addEventListener('keydown', e => { PHIM[e.key] = true; });
window.addEventListener('keyup', e => { PHIM[e.key] = false; });

CANVAS.addEventListener('pointerdown', (ev) => {
  const rect = CANVAS.getBoundingClientRect();
  const mx = (ev.clientX - rect.left) / rect.width * CANVAS.width;
  const my = (ev.clientY - rect.top) / rect.height * CANVAS.height;
  // Nhân vật đi về phía điểm chạm (1 bước 24px)
  const dx = mx - NGUOI.x, dy = my - NGUOI.y;
  const d = Math.hypot(dx, dy);
  if (d > 6) {
    const buoc = Math.min(TOCDO, d);
    NGUOI.x += dx / d * buoc;
    NGUOI.y += dy / d * buoc;
    NGUOI.f = (NGUOI.f + 1) % 8;
    render();
  }
});

function vongLap() {
  let dx = 0, dy = 0;
  if (PHIM['ArrowLeft'] || PHIM['a']) dx = -1;
  if (PHIM['ArrowRight'] || PHIM['d']) dx = 1;
  if (PHIM['ArrowUp'] || PHIM['w']) dy = -1;
  if (PHIM['ArrowDown'] || PHIM['s']) dy = 1;
  if (dx || dy) {
    NGUOI.x = Math.max(20, Math.min(300, NGUOI.x + dx * TOCDO / 2));
    NGUOI.y = Math.max(60, Math.min(230, NGUOI.y + dy * TOCDO / 2));
    NGUOI.f = (NGUOI.f + 1) % 8;
    render();
  }
  requestAnimationFrame(vongLap);
}
requestAnimationFrame(vongLap);
