// RENDER v5 — 8bit THUẦN kiểu 9 To Life: tile-based, nhân vật 24px outline, tap-to-move
// 4 bối cảnh VN: phòng trọ / quán phở / văn phòng / phố đêm + bloom + dithering
const CANVAS = document.getElementById('man-choi');
const MAIN_CTX = CANVAS.getContext('2d');
MAIN_CTX.imageSmoothingEnabled = false;

const W = 320, H = 240, T = 16;
// ===== PIXEL CRUSH 8-BIT =====
// 9 To Life thật đo được: scene chỉ ~135x81 px game, pixel CỤC TO.
// Ta vẽ hệ tọa độ 320x240 vào offscreen 160x120 (scale 0.5) rồi phóng
// ngược NEAREST lên canvas → mọi thứ thành khối 2x2, đúng chất 8-bit.
const OFF = document.createElement('canvas');
OFF.width = 160; OFF.height = 120;
const CTX = OFF.getContext('2d');
CTX.imageSmoothingEnabled = false;
CTX.scale(0.5, 0.5);

// ===== BẢNG MÀU 8BIT HOÀI NIỆM VN =====
const P = {
  dem:'#1A1626', dem2:'#241B3A', vat:'#3A2F52',
  vang:'#E8C46A', vang2:'#C9A227', teal:'#47857D', teal2:'#2E6B64',
  nau:'#6D4A2E', nau2:'#4A2F1F', do:'#C0392B', do2:'#8E2418',
  kem:'#E8D5B0', kem2:'#C9B48E', trang:'#FFF6E0', den:'#0D0A14',
  xanh:'#3498DB', xanh2:'#2471A3', bia:'#2E7D32', cam:'#E67E22', hong:'#E2585E',
  da:'#F0D5B0', da2:'#D8B38C', toc:'#2B2340',
};

// ===== NHÂN VẬT V2 — 12x18: tóc gọn, 2 mắt, 2 tay nối, quần riêng, giày =====
const CHAR_FRAMES = {
  idle: [
    '....tttt....',
    '...tttttt...',
    '...tttttt...',
    '...dddddd...',
    '...dmdmdq...',
    '...dddddd...',
    '....dddd....',
    '...aaaaaa...',
    '..aaaaaaaa..',
    '.a.aaaaaa.a.',
    '.a.aaaaaa.a.',
    '.a..aaaa..a.',
    '....aaaa....',
    '....qqqq....',
    '...qq...qq..',
    '...q.....q..',
    '...q.....q..',
    '..gg.....gg.',
  ],
  walk1: [
    '....tttt....',
    '...tttttt...',
    '...tttttt...',
    '...dddddd...',
    '...dmdmdq...',
    '...dddddd...',
    '....dddd....',
    '...aaaaaa...',
    '..aaaaaaaa..',
    '.a.aaaaaa.a.',
    '.a.aaaaaa.a.',
    '.aa.aaaa.aa.',
    '....aaaa....',
    '....qqqq....',
    '...qq...qq..',
    '..qq.....q..',
    '..q.......q.',
    '.gg.......gg',
  ],
  walk2: [
    '....tttt....',
    '...tttttt...',
    '...tttttt...',
    '...dddddd...',
    '...dmdmdq...',
    '...dddddd...',
    '....dddd....',
    '...aaaaaa...',
    '..aaaaaaaa..',
    '.aa.aaaa.aa.',
    '.a.aaaaaa.a.',
    '.a.aaaaaa.a.',
    '....aaaa....',
    '....qqqq....',
    '...qq...qq..',
    '...q.....qq.',
    '.q.......q..',
    'gg.......gg.',
  ],
};

const CHAR_COLOR = { t: P.toc, d: P.da, m: P.den, a: '#4E9A8F', q: '#3A2A1C', g: '#16121E', ' ': null, '.': null };

function veCharRaw(rows, x, y, sx, flip, mauFn, sy) {
  sy = sy || sx;
  for (let r = 0; r < rows.length; r++) {
    const line = rows[r];
    for (let c = 0; c < line.length; c++) {
      const ch = flip ? line[line.length-1-c] : line[c];
      const mau = mauFn(ch);
      if (!mau) continue;
      CTX.fillStyle = mau;
      CTX.fillRect(x + c*sx, y + r*sy, sx, sy);
    }
  }
}

function veChar(frame, x, y, flip, SC) {
  SC = SC || 2; // scale theo cảnh: 2 = phố (24x36), 3 = nội thất (36x54)
  // Outline đen dày đúng 1 pixel-art (bằng 1 ô sprite), ôm sát silhouette
  for (const [ox, oy] of [[-SC,0],[SC,0],[0,-SC],[0,SC],[-SC,-SC],[SC,-SC],[-SC,SC],[SC,SC]]) {
    veCharRaw(CHAR_FRAMES[frame], x + ox, y + oy, SC, flip, (ch) => CHAR_COLOR[ch] ? P.den : null);
  }
  veCharRaw(CHAR_FRAMES[frame], x, y, SC, flip, (ch) => CHAR_COLOR[ch]);
}

// ===== TIỆN ÍCH VẼ =====
function veTuongVang(x, y, w, h) {
  CTX.fillStyle = P.kem;
  CTX.fillRect(x, y, w, h);
  CTX.fillStyle = P.kem2;
  for (let i = 0; i < 6; i++) {
    CTX.fillRect(x + ((i*37) % w), y + ((i*23) % h), 2, 1);
  }
  CTX.fillStyle = P.teal2;
  CTX.fillRect(x, y + h - 4, w, 4);
}

function veGachBong(x, y, w, h) {
  for (let ty = y; ty < y+h; ty += T) {
    for (let tx = x; tx < x+w; tx += T) {
      const p = ((tx/T) + (ty/T)) % 2;
      CTX.fillStyle = p ? P.kem : P.kem2;
      CTX.fillRect(tx, ty, T, T);
      CTX.fillStyle = '#C4A48A';
      CTX.fillRect(tx+6, ty+6, 4, 4);
      CTX.fillStyle = P.kem;
      CTX.fillRect(tx+7, ty+7, 2, 2);
    }
  }
}

function veDenTre(x, y) {
  CTX.fillStyle = P.den;
  CTX.fillRect(x, y, 1, 8);
  // bloom 3 lớp giảm dần
  for (const [bk, alpha] of [[34, 0.08], [24, 0.12], [14, 0.2]]) {
    CTX.fillStyle = `rgba(232,196,106,${alpha})`;
    CTX.beginPath(); CTX.arc(x, y+11, bk, 0, 7); CTX.fill();
  }
  CTX.fillStyle = P.vang;
  CTX.fillRect(x-3, y+8, 7, 5);
  CTX.fillStyle = P.trang;
  CTX.fillRect(x-1, y+9, 3, 2);
  CTX.fillStyle = 'rgba(232,196,106,0.12)';
  CTX.fillRect(x-16, y+13, 32, 30);
}

function dither(x, y, w, h, mau, buoc = 4) {
  CTX.fillStyle = mau;
  for (let ty = y; ty < y+h; ty += buoc) {
    for (let tx = x + ((ty/buoc) % 2) * (buoc/2); tx < x+w; tx += buoc) {
      CTX.fillRect(tx, ty, 1, 1);
    }
  }
}

// ===== CẢNH =====
const SCENES = {};

// --- SCENE 1: PHÒNG TRỌ ---
SCENES.phong_tro = {
  ten: 'Phòng trọ',
  ve() {
    const bg = BG_ANH.phong_tro;
    if (bg) { CTX.drawImage(bg, 0, 0, W, H); return; }
    veTuongVang(0, 0, W, 96);
    veGachBong(0, 96, W, H-96);
    // cửa sổ + trăng
    CTX.fillStyle = P.den; CTX.fillRect(216, 12, 72, 52);
    CTX.fillStyle = P.vat; CTX.fillRect(220, 16, 64, 44);
    CTX.fillStyle = P.kem; CTX.beginPath(); CTX.arc(262, 34, 10, 0, 7); CTX.fill();
    CTX.fillStyle = P.den;
    for (let i = 0; i < 4; i++) CTX.fillRect(230 + i*16, 16, 2, 44);
    CTX.fillStyle = P.do; CTX.fillRect(208, 10, 10, 56);
    CTX.fillRect(286, 10, 10, 56);
    CTX.fillStyle = P.cam;
    CTX.fillRect(210, 18, 6, 4); CTX.fillRect(212, 30, 5, 4); CTX.fillRect(288, 24, 6, 4);
    // tủ kính
    CTX.fillStyle = P.nau; CTX.fillRect(20, 52, 52, 44);
    CTX.fillStyle = '#5A3A22'; CTX.fillRect(24, 56, 44, 36);
    for (let i = 0; i < 3; i++) {
      CTX.fillStyle = '#A8C4C0'; CTX.fillRect(26+i*14, 58, 11, 32);
    }
    CTX.fillStyle = P.xanh; CTX.fillRect(30, 62, 5, 8);
    CTX.fillStyle = P.do; CTX.fillRect(52, 66, 4, 6);
    // tivi CRT trên tủ gỗ
    CTX.fillStyle = P.nau2; CTX.fillRect(248, 72, 56, 24);
    CTX.fillStyle = P.do; CTX.fillRect(256, 46, 40, 26);
    CTX.fillStyle = P.den; CTX.fillRect(262, 52, 28, 14);
    CTX.fillStyle = '#3A4A4A'; CTX.fillRect(264, 54, 24, 10);
    CTX.fillStyle = P.do2; CTX.fillRect(258, 66, 4, 4);
    // giường
    CTX.fillStyle = P.nau; CTX.fillRect(16, 120, 84, 34);
    CTX.fillStyle = '#8B5E3C'; CTX.fillRect(20, 126, 76, 24);
    CTX.fillStyle = P.trang; CTX.fillRect(24, 130, 66, 10);
    CTX.fillStyle = P.do; CTX.fillRect(24, 130, 12, 10);
    // võng cam
    CTX.strokeStyle = P.cam; CTX.lineWidth = 2;
    CTX.beginPath(); CTX.moveTo(108, 88); CTX.quadraticCurveTo(132, 106, 156, 88); CTX.stroke();
    CTX.fillStyle = P.den; CTX.fillRect(108, 84, 1, 4); CTX.fillRect(155, 84, 1, 4);
    // bàn nhỏ + ấm chén
    CTX.fillStyle = P.nau; CTX.fillRect(128, 150, 64, 14);
    CTX.fillStyle = '#5A3A22'; CTX.fillRect(132, 164, 6, 14); CTX.fillRect(182, 164, 6, 14);
    CTX.fillStyle = P.trang; CTX.fillRect(144, 144, 10, 6);
    CTX.fillStyle = P.xanh; CTX.fillRect(166, 146, 6, 4);
    // ghế nhựa đỏ + xanh
    CTX.fillStyle = P.do; CTX.fillRect(110, 162, 12, 12); CTX.fillRect(112, 156, 8, 6);
    CTX.fillStyle = P.xanh; CTX.fillRect(192, 162, 12, 12); CTX.fillRect(194, 156, 8, 6);
    // đèn treo
    veDenTre(160, 0);
    // lịch tường
    CTX.fillStyle = P.trang; CTX.fillRect(80, 16, 22, 28);
    CTX.fillStyle = P.do; CTX.fillRect(80, 16, 22, 6);
    CTX.fillStyle = P.nau2;
    for (let i = 0; i < 4; i++) CTX.fillRect(83, 26+i*4, 16, 1);
    // dây điện
    CTX.strokeStyle = P.den; CTX.lineWidth = 1;
    CTX.beginPath(); CTX.moveTo(0, 6); CTX.quadraticCurveTo(80, 16, 160, 6); CTX.stroke();
    CTX.beginPath(); CTX.moveTo(160, 6); CTX.quadraticCurveTo(240, 18, 320, 8); CTX.stroke();
    // cửa ra
    CTX.fillStyle = P.nau2; CTX.fillRect(8, 196, 30, 44);
    CTX.fillStyle = P.nau; CTX.fillRect(11, 200, 24, 40);
    CTX.fillStyle = P.vang; CTX.fillRect(28, 218, 4, 4);
    // quạt treo
    CTX.fillStyle = P.bia; CTX.fillRect(180, 24, 14, 10);
    CTX.fillStyle = P.den; CTX.fillRect(186, 34, 2, 4);
  },
  diem: {
    giuong: [20, 95, 95, 65, 'ngu'],
    ban_an: [110, 95, 60, 55, 'tivi'],
    cua: [285, 85, 32, 85, 'ra_pho'],
    tu_kinh: [190, 100, 50, 55, 'tu_kinh'],
  },
  viTriGoc: [150, 148],
  charScale: 3,
  vungDi: { x1: 8, x2: 280, y1: 141, y2: 160 },
};

// --- SCENE 2: QUÁN PHỞ ---
SCENES.quan_pho = {
  ten: 'Quán phở Bà Hạnh',
  ve() {
    const bg = BG_ANH.quan_pho;
    if (bg) { CTX.drawImage(bg, 0, 0, W, H); return; }
    veTuongVang(0, 0, W, 88);
    veGachBong(0, 88, W, H-88);
    CTX.fillStyle = P.do2; CTX.fillRect(88, 8, 144, 24);
    CTX.fillStyle = P.do; CTX.fillRect(92, 11, 136, 18);
    CTX.fillStyle = P.vang;
    CTX.fillRect(104, 15, 3, 12); CTX.fillRect(104, 15, 8, 3); CTX.fillRect(104, 20, 6, 3); CTX.fillRect(109, 15, 3, 5);
    CTX.fillRect(122, 15, 3, 12); CTX.fillRect(122, 20, 7, 2); CTX.fillRect(128, 15, 3, 5);
    CTX.fillRect(140, 20, 10, 3); CTX.fillRect(140, 15, 3, 3); CTX.fillRect(147, 15, 3, 3); CTX.fillRect(140, 15, 3, 12); CTX.fillRect(147, 15, 3, 12);
    for (const lx of [40, 264]) {
      CTX.fillStyle = P.den; CTX.fillRect(lx, 0, 1, 6);
      CTX.fillStyle = P.do; CTX.fillRect(lx-6, 6, 13, 10);
      CTX.fillStyle = P.cam; CTX.fillRect(lx-4, 8, 9, 6);
      CTX.fillStyle = P.vang; CTX.fillRect(lx-2, 10, 5, 2);
    }
    CTX.fillStyle = '#9AA5A8'; CTX.fillRect(180, 96, 120, 30);
    CTX.fillStyle = '#8A8F92'; CTX.fillRect(184, 92, 44, 12);
    CTX.fillStyle = P.trang; CTX.fillRect(190, 88, 32, 6);
    CTX.fillStyle = 'rgba(255,246,224,0.7)';
    CTX.fillRect(196, 78, 3, 8); CTX.fillRect(202, 72, 3, 10); CTX.fillRect(208, 76, 3, 6);
    CTX.fillStyle = P.nau; CTX.fillRect(20, 60, 60, 8);
    for (let i = 0; i < 5; i++) { CTX.fillStyle = P.trang; CTX.fillRect(24+i*11, 52, 8, 8); }
    for (const bx of [30, 110, 190]) {
      CTX.fillStyle = P.nau; CTX.fillRect(bx, 150, 60, 12);
      CTX.fillStyle = '#5A3A22'; CTX.fillRect(bx+4, 162, 5, 14); CTX.fillRect(bx+51, 162, 5, 14);
      CTX.fillStyle = P.xanh; CTX.fillRect(bx+22, 168, 12, 12); CTX.fillRect(bx+24, 162, 8, 6);
      CTX.fillStyle = P.trang; CTX.fillRect(bx+12, 144, 14, 7);
      CTX.fillStyle = P.cam; CTX.fillRect(bx+14, 145, 10, 4);
      CTX.fillStyle = P.bia; CTX.fillRect(bx+16, 144, 3, 2);
    }
    veDenTre(70, 0); veDenTre(250, 0);
    CTX.fillStyle = P.nau2; CTX.fillRect(4, 190, 28, 50);
    CTX.fillStyle = P.do2; CTX.fillRect(7, 194, 22, 46);
  },
  diem: {
    ban: [110, 120, 90, 50, 'an_pho'],
    noi: [230, 95, 75, 85, 'noi_pho'],
    cua: [10, 90, 60, 90, 'ra_pho'],
  },
  viTriGoc: [80, 148],
  charScale: 3,
  vungDi: { x1: 8, x2: 280, y1: 141, y2: 160 },
};

// --- SCENE 3: VĂN PHÒNG ---
SCENES.van_phong = {
  ten: 'Văn phòng',
  ve() {
    const bg = BG_ANH.van_phong;
    if (bg) { CTX.drawImage(bg, 0, 0, W, H); return; }
    CTX.fillStyle = P.kem2; CTX.fillRect(0, 0, W, 92);
    CTX.fillStyle = '#B8B0A0';
    for (let i = 0; i < 10; i++) CTX.fillRect((i*67)%W, (i*29)%80, 2, 1);
    CTX.fillStyle = '#9A9488'; CTX.fillRect(0, 92, W, 4);
    veGachBong(0, 96, W, H-96);
    for (let i = 0; i < 4; i++) {
      const bx = 16 + i*76;
      CTX.fillStyle = '#8A7A5A'; CTX.fillRect(bx, 128, 60, 12);
      CTX.fillStyle = '#6A5A42'; CTX.fillRect(bx+4, 140, 5, 14); CTX.fillRect(bx+51, 140, 5, 14);
      CTX.fillStyle = P.den; CTX.fillRect(bx+16, 106, 28, 20);
      CTX.fillStyle = '#2A3A4A'; CTX.fillRect(bx+18, 108, 24, 14);
      CTX.fillStyle = P.vang; CTX.fillRect(bx+20, 110, 6, 2); CTX.fillRect(bx+20, 114, 10, 1);
      CTX.fillStyle = '#444'; CTX.fillRect(bx+27, 126, 6, 2);
      CTX.fillStyle = P.den; CTX.fillRect(bx+22, 150, 16, 10);
      CTX.fillRect(bx+24, 158, 2, 8); CTX.fillRect(bx+34, 158, 2, 8);
    }
    CTX.fillStyle = P.trang; CTX.fillRect(96, 14, 128, 34);
    CTX.fillStyle = P.nau; CTX.fillRect(96, 14, 128, 3);
    CTX.fillStyle = P.do; CTX.fillRect(102, 22, 30, 3); CTX.fillRect(140, 22, 22, 3);
    CTX.fillStyle = P.teal; CTX.fillRect(102, 30, 40, 3); CTX.fillRect(150, 30, 26, 3);
    CTX.fillStyle = P.trang; CTX.fillRect(250, 16, 44, 14);
    CTX.fillStyle = '#CCC'; CTX.fillRect(252, 26, 40, 2);
    CTX.fillStyle = P.trang; CTX.beginPath(); CTX.arc(60, 28, 10, 0, 7); CTX.fill();
    CTX.fillStyle = P.den; CTX.fillRect(59, 22, 2, 7); CTX.fillRect(59, 28, 6, 2);
    CTX.fillStyle = P.trang; CTX.fillRect(40, 4, 60, 4); CTX.fillRect(220, 4, 60, 4);
    CTX.fillStyle = 'rgba(255,255,255,0.15)';
    CTX.fillRect(20, 8, 280, 60);
    CTX.fillStyle = P.nau2; CTX.fillRect(284, 180, 30, 60);
    CTX.fillStyle = '#5A3A22'; CTX.fillRect(287, 184, 24, 56);
  },
  diem: {
    ban_lam: [20, 110, 120, 60, 'lam'],
    nuoc: [160, 100, 30, 60, 'ca_phe'],
    cua: [280, 80, 36, 90, 'ra_pho'],
  },
  viTriGoc: [160, 148],
  charScale: 3,
  vungDi: { x1: 8, x2: 280, y1: 141, y2: 160 },
};

// --- SCENE 4: PHỐ ĐÊM ---
// ===== ẢNH NỀN MEOWA — pixel art phố Việt, chuẩn 9 To Life =====
// ẢNH NỀN MEOWA đã LOẠI BỎ (style painterly — phu quân không muốn).
// Mọi cảnh giờ vẽ code thuần flat side-view theo thành phố trong canh3tp.js.
const BG_ANH = {};

// ===== QUÁN BIA HƠI (kiểu Bar 9 To Life) =====
SCENES.bia_hoi = {
  ten: 'Quán bia hơi',
  ve() {
    const bg = BG_ANH.bia_hoi;
    if (bg) { CTX.drawImage(bg, 0, 0, W, H); return; }
    CTX.fillStyle = P.dem; CTX.fillRect(0, 0, W, H);
  },
  diem: {
    quan: [180, 100, 90, 60, 'nghe_gossip_act'],
    ban_nhau: [60, 150, 90, 50, 'nhom_bia_act'],
    ra_pho: [10, 120, 50, 90, 'ra_pho'],
  },
  viTriGoc: [150, 158],
  charScale: 3,
  charPx: 48,
  vungDi: { x1: 8, x2: 288, y1: 140, y2: 168 },
};

// WALK SHEET MEOWA đã bỏ — sprite code-drawn flat, đúng style 9 To Life
const WALK_ANH = {};
function veWalkFrame() { return false; }

// ---- hiệu ứng sống động phủ lên ảnh nền ----
let TG = 0;
const BUI = Array.from({ length: 9 }, (_, i) => ({
  x: (i * 73) % 320, y: 158 + ((i * 41) % 66),
  v: 0.05 + (i % 5) * 0.015, l: 1 + (i % 2),
}));

function hieuUngPhoDem() {
  const nhap = 0.5 + 0.5 * Math.sin(TG * 0.05);   // nhịp thở của đèn
  // quầng ấm từ đèn đường / quán (cộng sáng rất nhẹ, giữ nguyên pixel gốc)
  CTX.save();
  CTX.globalCompositeOperation = 'lighter';
  const quang = [
    [148, 168, 46, 0.030], [206, 150, 54, 0.036], [58, 176, 30, 0.022],
  ];
  for (const [qx, qy, bk, a] of quang) {
    const g = CTX.createRadialGradient(qx, qy, 2, qx, qy, bk);
    g.addColorStop(0, 'rgba(244,230,178,' + (a * (0.85 + 0.3 * nhap)).toFixed(3) + ')');
    g.addColorStop(1, 'rgba(244,230,178,0)');
    CTX.fillStyle = g;
    CTX.fillRect(qx - bk, qy - bk, bk * 2, bk * 2);
  }
  CTX.restore();
  // bụi bay trong quầng đèn
  for (const b of BUI) {
    b.y -= b.v;
    b.x += Math.sin((TG + b.y) * 0.02) * 0.12;
    if (b.y < 130) { b.y = 224; b.x = (b.x * 7 + 33) % 320; }
    CTX.fillStyle = 'rgba(244,230,178,0.30)';
    CTX.fillRect(Math.round(b.x), Math.round(b.y), b.l, b.l);
  }
}

// ---- mèo ngồi trên vỉa hè (chi tiết life-sim) ----
function veMeo(x, y) {
  const nhay = Math.sin(TG * 0.04) > 0.96 ? 1 : 0;
  CTX.fillStyle = '#2A2233'; CTX.fillRect(x + 1, y + 4 - nhay, 7, 6);
  CTX.fillStyle = '#2A2233'; CTX.fillRect(x + 2, y + 1 - nhay, 2, 3);
  CTX.fillStyle = '#2A2233'; CTX.fillRect(x + 5, y + 1 - nhay, 2, 3);
  CTX.fillStyle = '#3A3044'; CTX.fillRect(x + 2, y + 5 - nhay, 5, 2);
  CTX.fillStyle = '#E8C46A'; CTX.fillRect(x + 2, y + 4 - nhay, 1, 1);
  CTX.fillStyle = '#E8C46A'; CTX.fillRect(x + 5, y + 4 - nhay, 1, 1);
  CTX.fillStyle = '#2A2233'; CTX.fillRect(x + 8, y + 6 - nhay, 3, 1);
  CTX.fillRect(x + 10, y + 5 - nhay, 1, 2);
}

SCENES.pho_dem = {
  ten: 'Phố đêm',
  ve() {
    const bg = BG_ANH.pho_dem;
    if (bg) {
      CTX.drawImage(bg, 0, 0, W, H);
      hieuUngPhoDem();
      veMeo(52, 196);
      return;
    }
    // ---- dự phòng khi chưa nạp được ảnh ----
    CTX.fillStyle = P.dem; CTX.fillRect(0, 0, W, H);
    dither(0, 0, W, 115, 'rgba(58,47,82,0.35)', 6);
    for (let i = 0; i < 40; i++) {
      CTX.fillStyle = i % 3 ? P.kem : P.vang;
      CTX.fillRect(((i * 61) % W), ((i * 37) % 110), 1, 1);
    }
    for (const [bk, alpha] of [[26, 0.1], [16, 0.18]]) {
      CTX.fillStyle = `rgba(232,196,106,${alpha})`;
      CTX.beginPath(); CTX.arc(272, 28, bk, 0, 7); CTX.fill();
    }
    CTX.fillStyle = P.kem; CTX.beginPath(); CTX.arc(272, 28, 12, 0, 7); CTX.fill();
    CTX.fillStyle = P.dem; CTX.beginPath(); CTX.arc(276, 24, 10, 0, 7); CTX.fill();
    CTX.fillStyle = P.nau2; CTX.fillRect(0, 60, 120, 110);
    CTX.fillStyle = '#4A2F1F'; CTX.fillRect(0, 160, 120, 10);
    CTX.fillStyle = P.vat; CTX.fillRect(200, 50, 120, 120);
    CTX.fillStyle = '#2A2138'; CTX.fillRect(200, 160, 120, 10);
    CTX.fillStyle = '#3A3A48'; CTX.fillRect(0, 170, W, 30);
    CTX.fillStyle = '#5A5A6A'; CTX.fillRect(0, 170, W, 3);
    CTX.fillStyle = '#241B30'; CTX.fillRect(0, 200, W, 40);
    CTX.fillStyle = P.vang;
    for (let i = 0; i < 8; i++) CTX.fillRect(i * 44, 218, 18, 3);
  },
  diem: {
    // toạ độ bám theo bố cục ảnh nền Meowa: sạp bún giữa, cửa cuốn trái, ghế đẩu vỉa hè
    quan: [136, 132, 80, 42, 'quan_bar'],
    ve_phong: [0, 128, 40, 64, 've_phong'],
    do_an: [96, 166, 52, 22, 'an_via_he'],
    quan_pho: [224, 120, 90, 60, 'quan_pho'],
    toa_van_phong: [48, 90, 60, 60, 'van_phong'],
  },
  viTriGoc: [172, 164],
  charScale: 3,
  charPx: 48, // ~20% chiều cao cảnh — chuẩn 9 To Life cho phố rộng
  // vùng đi lại: y là GÓC TRÊN sprite cao 48px → chân ở y+48, trên dải vỉa hè
  vungDi: { x1: 8, x2: 288, y1: 146, y2: 168 },
};

let SCENE_HIEN = 'phong_tro';

// ===== MƯA RƠI ĐỘNG (kiểu 9 To Life — vệt mưa chéo + icon mây trên HUD) =====
const GIO_MUA = []; // { x, y, spd }
for (let i = 0; i < 46; i++) GIO_MUA.push({ x: Math.random() * W, y: Math.random() * H, spd: 3 + Math.random() * 3 });
const NGOAI_TROI = { pho_dem: 1, bia_hoi: 0.4 }; // hệ số mưa hiển thị theo cảnh (nội thất: nhìn mưa ngoài cửa)
function veMua() {
  const tt = (typeof G !== 'undefined' && G && G.thoiTiet) || 'nang';
  if (tt !== 'mua') return;
  const he = NGOAI_TROI[SCENE_HIEN];
  if (he === undefined) return; // trong nhà kín: không vẽ mưa
  CTX.save();
  CTX.globalAlpha = 0.55 * he;
  CTX.strokeStyle = '#BFD8E8';
  CTX.lineWidth = 1;
  for (const g of GIO_MUA) {
    CTX.beginPath();
    CTX.moveTo(g.x, g.y);
    CTX.lineTo(g.x - 2, g.y + 7); // vệt chéo
    CTX.stroke();
    g.y += g.spd; g.x -= 0.9;
    if (g.y > H) { g.y = -8; g.x = Math.random() * (W + 40); }
    if (g.x < -10) g.x = W + 5;
  }
  CTX.restore();
  // phủ hơi ướt tím nhẹ cả cảnh khi mưa
  CTX.fillStyle = 'rgba(40,60,90,0.12)';
  CTX.fillRect(0, 0, W, H);
}
// icon thời tiết pixel bên cạnh giờ trên HUD (kiểu 9 To Life)
const ICON_TT = { nang: '☀️', may: '☁️', mua: '🌧️', nong: '🔥', ret: '🥶' };
function capNhatIconThoiTiet() {
  const el = document.getElementById('hud-tt');
  if (el && typeof G !== 'undefined' && G) el.textContent = ICON_TT[G.thoiTiet] || '☀️';
}

// ===== ĐỒNG BỘ TÔNG MÀU (Phase 1) =====
// 3 cảnh vẽ code được phủ grade ấm + vignette để cùng tông với phố đêm Meowa
function dongBoTong(ten) {
  if (BG_ANH[ten]) return; // ảnh Meowa đã chuẩn tông — không phủ gì thêm
  CTX.save();
  // ánh sáng ấm nhẹ toàn cảnh (đèn vàng hoài niệm)
  CTX.globalCompositeOperation = 'lighter';
  const g = CTX.createRadialGradient(160, 90, 30, 160, 120, 260);
  g.addColorStop(0, 'rgba(244,230,178,0.07)');
  g.addColorStop(1, 'rgba(244,230,178,0.015)');
  CTX.fillStyle = g;
  CTX.fillRect(0, 0, W, H);
  CTX.globalCompositeOperation = 'source-over';
  // vignette tối 4 góc — kéo mood về gần phố đêm
  const v = CTX.createRadialGradient(160, 120, 120, 160, 120, 240);
  v.addColorStop(0, 'rgba(19,17,30,0)');
  v.addColorStop(1, 'rgba(19,17,30,0.30)');
  CTX.fillStyle = v;
  CTX.fillRect(0, 0, W, H);
  // grain dithering rất nhẹ
  CTX.fillStyle = 'rgba(244,230,178,0.03)';
  for (let ty = 0; ty < H; ty += 4) {
    for (let tx = (ty % 8 ? 2 : 0); tx < W; tx += 4) CTX.fillRect(tx, ty, 1, 1);
  }
  CTX.restore();
}

function render() {
  // cảnh theo THÀNH PHỐ (canh3tp.js) — flat side-view chuẩn 9 To Life, không Meowa
  const tpKey = (typeof G !== 'undefined' && G && G.thanhPhoKey) || 'saigon';
  const cityFn = window.CANH && window.CANH[tpKey] && window.CANH[tpKey][SCENE_HIEN];
  if (cityFn) {
    cityFn();
  } else {
    const sc = SCENES[SCENE_HIEN];
    sc.ve();
  }
  veNguoiHien();
  veMua();
  // crush ra canvas chính: 160x120 → 320x240 NEAREST (pixel cục 8-bit)
  MAIN_CTX.imageSmoothingEnabled = false;
  MAIN_CTX.clearRect(0, 0, W, H);
  MAIN_CTX.drawImage(OFF, 0, 0, 160, 120, 0, 0, W, H);
  capNhatIconThoiTiet();
}

// rim light ĐÃ TẮT — flat style chuẩn 9 To Life không dùng glow/lighter
function veRimSang() { return; }

function veNguoiHien() {
  const { x, y, di, frame } = NGUOI;
  const SC = (SCENES[SCENE_HIEN].charScale) || 2;
  const charPx = SCENES[SCENE_HIEN].charPx || 18 * SC; // chiều cao sprite thật (px)
  const spriteW = 12 * SC * (charPx / (18 * SC));
  const spriteH = charPx;
  const chanY = y + spriteH;
  // bóng đổ tiếp xúc (contact shadow) — neo nhân vật xuống sàn
  CTX.fillStyle = 'rgba(8,6,12,0.5)';
  CTX.beginPath(); CTX.ellipse(x+spriteW/2, chanY+1, spriteW*0.38, SC*1.3, 0, 0, 7); CTX.fill();
  // nhấp nhô nhẹ theo nhịp bước cho đỡ cứng
  const nhun = frame === 'walk2' ? -SC : 0;
  // sprite bitmap code-drawn: flat + outline 1px — ĐÚNG chất 9 To Life
  // (walk sheet Meowa đã bỏ: style painterly không hợp)
  veChar(frame, x, y + nhun, di < 0, SC);
}

// NGUOI: x,y là góc trên-trái sprite 24x36
let NGUOI = { x: 150, y: 130, di: 1, frame: 'idle', dichX: null, mucTieuAction: null, mucTieuX: 0, mucTieuY: 0, vanToc: 1.6, frameDem: 0 };

function tapToMove(mx, my) {
  const sc = SCENES[SCENE_HIEN];
  NGUOI.dichX = mx - 12;
  NGUOI.mucTieuAction = null;
  for (const [ten, [px, py, pw, ph, action]] of Object.entries(sc.diem)) {
    if (mx >= px && mx <= px+pw && my >= py && my <= py+ph) {
      NGUOI.mucTieuAction = action;
      NGUOI.mucTieuX = Math.min(Math.max(px + pw/2 - 12, 10), W-26);
      NGUOI.mucTieuY = Math.min(Math.max(py + ph - 30, 50), H-42);
      break;
    }
  }
  // kẹp đích vào vùng đi được, tránh nhân vật đi mãi không tới
  [NGUOI.mucTieuX, NGUOI.mucTieuY] = gioiHan(sc, NGUOI.mucTieuX, NGUOI.mucTieuY);
  const [dx, dy] = gioiHan(sc, NGUOI.dichX, NGUOI.y);
  NGUOI.dichX = dx; NGUOI.mucTieuY = NGUOI.mucTieuAction ? NGUOI.mucTieuY : dy;
}

CANVAS.addEventListener('pointerdown', (ev) => {
  const rect = CANVAS.getBoundingClientRect();
  const mx = (ev.clientX - rect.left) / rect.width * W;
  const my = (ev.clientY - rect.top) / rect.height * H;
  tapToMove(mx, my);
});

const PHIM1 = {};
window.addEventListener('keydown', e => { PHIM1[e.key] = true; });
window.addEventListener('keyup', e => { PHIM1[e.key] = false; });

function gioiHan(sc, x, y) {
  const v = sc.vungDi;
  if (!v) return [Math.max(4, Math.min(W-28, x)), Math.max(50, Math.min(H-42, y))];
  return [Math.max(v.x1, Math.min(v.x2, x)), Math.max(v.y1, Math.min(v.y2, y))];
}

function buocChuyen() {
  TG++;
  let dx = 0, dy = 0;
  if (PHIM1['ArrowLeft'] || PHIM1['a']) dx = -1;
  if (PHIM1['ArrowRight'] || PHIM1['d']) dx = 1;
  if (PHIM1['ArrowUp'] || PHIM1['w']) dy = -1;
  if (PHIM1['ArrowDown'] || PHIM1['s']) dy = 1;
  if (dx || dy) {
    const sc0 = SCENES[SCENE_HIEN];
    [NGUOI.x, NGUOI.y] = gioiHan(sc0, NGUOI.x + dx*NGUOI.vanToc, NGUOI.y + dy*NGUOI.vanToc);
    if (dx) NGUOI.di = dx;
    NGUOI.frameDem++;
    NGUOI.frame = NGUOI.frameDem % 12 < 6 ? 'walk1' : 'walk2';
    render();
    return;
  }
  if (NGUOI.dichX !== null) {
    const tx = NGUOI.mucTieuAction ? NGUOI.mucTieuX : NGUOI.dichX;
    const ty = NGUOI.mucTieuAction ? NGUOI.mucTieuY : NGUOI.y;
    const ddx = tx - NGUOI.x, ddy = ty - NGUOI.y;
    const d = Math.hypot(ddx, ddy);
    if (d < NGUOI.vanToc * 1.2) {
      NGUOI.dichX = null;
      const act = NGUOI.mucTieuAction;
      NGUOI.mucTieuAction = null;
      NGUOI.frame = 'idle';
      render();
      if (act) thucHienAction(act);
      return;
    }
    NGUOI.x += ddx/d * NGUOI.vanToc;
    NGUOI.y += ddy/d * NGUOI.vanToc;
    [NGUOI.x, NGUOI.y] = gioiHan(SCENES[SCENE_HIEN], NGUOI.x, NGUOI.y);
    NGUOI.x = Math.round(NGUOI.x); NGUOI.y = Math.round(NGUOI.y);
    if (Math.abs(ddx) > 2) NGUOI.di = ddx;
    NGUOI.frameDem++;
    NGUOI.frame = NGUOI.frameDem % 12 < 6 ? 'walk1' : 'walk2';
    render();
    return;
  }
  NGUOI.frameDem++;
  if (NGUOI.frameDem % 60 < 2) { NGUOI.frame = 'idle'; render(); }
}

// ===== ACTION =====
function doiScene(ten) {
  SCENE_HIEN = ten;
  const sc = SCENES[ten];
  NGUOI.x = sc.viTriGoc[0]; NGUOI.y = sc.viTriGoc[1];
  NGUOI.dichX = null; NGUOI.mucTieuAction = null;
  NGUOI.frame = 'idle';
  if (typeof sauKhiDoiScene === 'function') sauKhiDoiScene(sc.ten);
  if (typeof hopThoai === 'function') hopThoai(sc.ten, 'Bạn đến: ' + sc.ten + '. Chạm vào đồ vật để tương tác, chạm sàn để đi.');
  render();
}
function doiSceneImLang(ten) {
  SCENE_HIEN = ten;
  const sc = SCENES[ten];
  NGUOI.x = sc.viTriGoc[0]; NGUOI.y = sc.viTriGoc[1];
  NGUOI.dichX = null; NGUOI.mucTieuAction = null;
  NGUOI.frame = 'idle';
  if (typeof sauKhiDoiScene === 'function') sauKhiDoiScene(sc.ten);
  render();
}

function thucHienAction(act) {
  if (typeof G === 'undefined' || !G) { if (typeof hopThoai === 'function') hopThoai('??', 'Chọn thành phố để bắt đầu đã.'); return; }
  switch (act) {
    case 'ngu':     bamHoatDong('ngu_dem'); break;
    case 'an':      bamHoatDong('an_com_bui'); break;
    case 'an_pho':  bamHoatDong('an_quan_pho'); break;
    case 'an_via_he': bamHoatDong('tra_da_via_he'); break;
    case 'lam':     bamHoatDong('di_lam'); break;
    case 'tivi':    bamHoatDong('xem_tivi'); break;
    case 'ca_phe':  bamHoatDong('ca_phe_sua'); break;
    case 'tu_kinh': hopThoai('Tủ kính', 'Chén đĩa sáng bóng, trên cùng là hộp bánh Trung thu để dành. Má gọi điện chưa?'); break;
    case 'noi_pho': hopThoai('Nồi nước lèo', 'Hương xương sôi 6 tiếng. Bà Hạnh: "Cháu ăn tô tái nạm ha, cô bớt hành cho".'); break;
    case 'bang_hop': hopThoai('Bảng họp', 'Sếp Đức gạch đầu dòng: "Q4 chỉ tiêu +30%". Không ai dám hỏi lại.'); break;
    case 'quan_bar': bamHoatDong('tam_su_ban'); break;
    case 'ra_pho':  doiScene('pho_dem'); return;
    case 've_phong': doiScene('phong_tro'); return;
    case 'quan_pho': doiScene('quan_pho'); return;
    case 'van_phong': doiScene('van_phong'); return;
    case 'bia_hoi': doiScene('bia_hoi'); return;
    case 'nhom_bia_act': bamHoatDong('nhom_bia'); break;
    case 'nghe_gossip_act': bamHoatDong('nghe_gossip'); break;
  }
  render();
}

function vongLap() { buocChuyen(); requestAnimationFrame(vongLap); }
requestAnimationFrame(vongLap);
// Fallback khi tab ẩn (Chrome throttle rAF)
setInterval(() => { if (document.hidden && NGUOI.dichX !== null) buocChuyen(); }, 250);