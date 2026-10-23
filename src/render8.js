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
    '..tttttttt..',
    '..tddddddt..',
    '..tdmddmdt..',
    '..tddddddt..',
    '..ttddddtt..',
    '...dddddd...',
    '...aaaaaa...',
    '..aaaaaaaa..',
    '..aaaaaaaa..',
    '..aaaaaaaa..',
    '..aaaaaaaa..',
    '..aaaaaaaa..',
    '.daaaaaaaad.',
    '..aaaaaaaa..',
    '...qq..qq...',
    '...qq..qq...',
    '...qq..qq...',
    '...qq..qq...',
    '...qq..qq...',
    '...qq..qq...',
    '..ggg..ggg..',
    '..ggg..ggg..',
  ],
  walk1: [
    '....tttt....',
    '...tttttt...',
    '..tttttttt..',
    '..tddddddt..',
    '..tdmddmdt..',
    '..tddddddt..',
    '..ttddddtt..',
    '...dddddd...',
    '...aaaaaa...',
    '..aaaaaaaa..',
    '..aaaaaaaa..',
    '..aaaaaaaa..',
    '..aaaaaaaa..',
    '.daaaaaaaad.',
    '..aaaaaaaa..',
    '..aaaaaaaa..',
    '...qq..qq...',
    '..qq....qq..',
    '..qq....qq..',
    '..qq....qq..',
    '..qq....qq..',
    '..qq....qq..',
    '.ggg....ggg.',
    '.ggg....ggg.',
  ],
  walk2: [
    '....tttt....',
    '...tttttt...',
    '..tttttttt..',
    '..tddddddt..',
    '..tdmddmdt..',
    '..tddddddt..',
    '..ttddddtt..',
    '...dddddd...',
    '...aaaaaa...',
    '..aaaaaaaa..',
    '..aaaaaaaa..',
    '..aaaaaaaa..',
    '..aaaaaaaa..',
    '..aaaaaaaa..',
    '.daaaaaaaad.',
    '..aaaaaaaa..',
    '...qq..qq...',
    '...qq..qq...',
    '....qqqq....',
    '....qqqq....',
    '....qqqq....',
    '....qqqq....',
    '...gggggg...',
    '...gg..gg...',
  ],
};

// Bảng màu nhân vật chuẩn 9 To Life: da peach ấm, tóc nâu, jean xanh, giày nâu đen
const CHAR_COLOR = { t: '#5A3A24', d: '#EFC39A', m: '#202020', a: '#4E9A8F', q: '#3E5A8A', g: '#2E241B', ' ': null, '.': null };

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
  charPx: 72,
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
  charPx: 72, // ~24% chiều cao cảnh — sprite mới 24 hàng
  // vùng đi lại: y là GÓC TRÊN sprite cao 48px → chân ở y+48, trên dải vỉa hè
  vungDi: { x1: 8, x2: 288, y1: 146, y2: 168 },
};

// ===== MÀN TANG LỄ kiểu 9 To Life: đêm sao + bia mộ R.I.P ♥ + NPC đưa tang 2 bên =====
SCENES.tang_le = {
  ten: 'Tiễn đưa',
  ve() {
    // trời đêm đầy sao
    CTX.fillStyle = C.troiDem; CTX.fillRect(0, 0, W, H);
    veSao();
    // trăng
    CTX.fillStyle = '#E8E0C0'; CTX.beginPath(); CTX.arc(270, 36, 12, 0, 7); CTX.fill();
    CTX.fillStyle = C.troiDem; CTX.beginPath(); CTX.arc(275, 32, 10, 0, 7); CTX.fill();
    // cỏ nghĩa trang
    CTX.fillStyle = '#2A4A2E'; CTX.fillRect(0, 160, W, 80);
    CTX.fillStyle = '#223E26'; for (let i = 0; i < 30; i++) CTX.fillRect((i * 47) % W, 164 + ((i * 31) % 70), 3, 2);
    // hàng rào cây xa
    CTX.fillStyle = '#1E3622'; CTX.fillRect(0, 140, W, 20);
    CTX.fillStyle = '#16291A'; for (let i = 0; i < 16; i++) CTX.fillRect(i * 20, 140 + (i % 3) * 2, 12, 6);
    // BIA MỘ giữa
    const d = (typeof G !== 'undefined' && G && G.daChet) || { ten: 'VÔ DANH', tuoi: 23, khachDu: 0, nghe: '' };
    CTX.fillStyle = C.den; CTX.fillRect(131, 71, 58, 92); // outline mộ
    CTX.fillStyle = '#8A8A96'; CTX.fillRect(132, 80, 56, 82); // thân bia
    CTX.beginPath(); CTX.arc(160, 80, 28, Math.PI, 0); CTX.fill(); // vòm bia
    CTX.fillStyle = '#6E6E7A'; CTX.fillRect(138, 76, 44, 4); // gờ
    CTX.fillStyle = '#4A4A56'; CTX.fillRect(128, 158, 64, 6); // đế
    // chữ khắc (pixel font qua fillText nhỏ)
    CTX.textAlign = 'center';
    CTX.fillStyle = '#3A3A46'; CTX.font = 'bold 10px monospace';
    CTX.fillText('R.I.P', 160, 94);
    CTX.fillStyle = '#2A2A34'; CTX.font = 'bold 12px monospace';
    CTX.fillText(String(d.ten).slice(0, 10).toUpperCase(), 160, 112);
    CTX.font = '9px monospace';
    CTX.fillText('22-' + d.tuoi, 160, 128);
    CTX.fillStyle = '#E03838'; CTX.font = '10px monospace';
    CTX.fillText('♥ ' + d.khachDu, 160, 144);
    CTX.textAlign = 'left';
    // hoa quanh mộ
    for (const fx of [112, 122, 198, 208]) {
      CTX.fillStyle = '#3E7A44'; CTX.fillRect(fx, 152, 2, 8);
      CTX.fillStyle = fx % 2 ? '#E05070' : '#E8C040'; CTX.fillRect(fx - 2, 148, 6, 5);
    }
    // NGƯỜI ĐƯA TANG: tối đa 6, chia 2 bên (sprite đen + chấm khăn trắng)
    const SC = 2;
    const khach = Math.min(6, d.khachDu || 0);
    const viTri = [[40, 128], [70, 136], [96, 142], [216, 142], [244, 136], [274, 128]];
    for (let i = 0; i < khach; i++) {
      const [mx, my] = viTri[i];
      const bob = ((TG + i * 13) % 80 < 40) ? 0 : -1;
      // bóng
      CTX.fillStyle = 'rgba(8,6,12,0.5)';
      CTX.beginPath(); CTX.ellipse(mx + 12, my + 37, 9, 3, 0, 0, 7); CTX.fill();
      // sprite đồ đen
      const mauTang = { ...CHAR_COLOR, a: '#2A2A34', q: '#202028', t: '#181820' };
      for (const [ox, oy] of [[-SC,0],[SC,0],[0,-SC],[0,SC]]) {
        veCharRaw(CHAR_FRAMES.idle, mx + ox, my + oy + bob, SC, i < 3, () => null); // không outline đen trùng nền
      }
      veCharRaw(CHAR_FRAMES.idle, mx, my + bob, SC, i < 3, (ch) => mauTang[ch] || null);
      // khăn trắng tang chế trên đầu
      CTX.fillStyle = '#E8E8E8'; CTX.fillRect(mx + 3 * SC, my + bob - 2, 6 * SC - 2 * SC, 3);
      // giọt nước mắt (1px xanh nhạt) cho 2 người gần mộ nhất
      if (i === 2 || i === 3) { CTX.fillStyle = '#8AC8E8'; CTX.fillRect(mx + (i < 3 ? 8 * SC : 3 * SC), my + bob + 5 * SC + ((TG % 40 < 20) ? 0 : 2), 2, 2); }
    }
  },
  diem: {},
  viTriGoc: [150, 200],
  charScale: 2,
  vungDi: { x1: 0, x2: 0, y1: 200, y2: 200 }, // không đi lại được
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
// icon thời tiết pixel bên cạnh giờ trên HUD (kiểu 9 To Life — SVG pixel, không emoji)
const ICON_TT = { nang: 'nang', may: 'may', mua: 'mua', nong: 'nong', ret: 'ret' };
function capNhatIconThoiTiet() {
  const el = document.getElementById('hud-tt');
  if (el && typeof G !== 'undefined' && G) el.innerHTML = pixIcon(ICON_TT[G.thoiTiet] || 'nang', 14);
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
  npcCapNhat();
  veNpcTrongScene();
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
  const charPx = SCENES[SCENE_HIEN].charPx || 24 * SC; // chiều cao sprite thật (px)
  const spriteW = 12 * SC * (charPx / (24 * SC));
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

// ===== NPC TRONG SCENE — "npcs have feelings" kiểu 9 To Life =====
// Mỗi NPC: vị trí theo scene, màu áo/tóc riêng, idle bob, bubble thoại ambient,
// icon cảm xúc trên đầu. Tap NPC → nhân vật TỰ ĐI TỚI → mở menu tương tác.
const NPC_SCENE_MAP = {
  phong_tro: ['ba_tu', 'hoa'],
  quan_pho:  ['chi_dao', 'hung'],
  van_phong: ['linh', 'tuan', 'duc'],
  pho_dem:   ['mai', 'nam', 'hanh'],
  bia_hoi:   ['hung', 'trung', 'thao'],
};
// màu áo/tóc riêng từng NPC (áo: [main, shadow], tóc, quần)
const NPC_LOOK = {
  linh:   { ao: ['#F080A8', '#C05888'], toc: '#3A2A20', quan: '#3A3A58' },
  tuan:   { ao: ['#4A6A9A', '#36507A'], toc: '#20202A', quan: '#2A2A38' },
  ba_tu:  { ao: ['#8A6A9A', '#6A4E7A'], toc: '#C8C8D0', quan: '#4A4A52' },
  hung:   { ao: ['#E0A030', '#B07818'], toc: '#20202A', quan: '#3A5A8A' },
  mai:    { ao: ['#E85880', '#B83860'], toc: '#5A3A28', quan: '#585870' },
  cu_long:{ ao: ['#7A8A6A', '#5A6A4A'], toc: '#D8D8E0', quan: '#4A4A52' },
  thao:   { ao: ['#48B8A0', '#2E8E78'], toc: '#3A2A20', quan: '#E8E8E8' },
  duc:    { ao: ['#3A3A48', '#26262E'], toc: '#20202A', quan: '#2A2A38' },
  hanh:   { ao: ['#C05878', '#983858'], toc: '#2A2028', quan: '#585870' },
  nam:    { ao: ['#58A858', '#3E8A3E'], toc: '#20202A', quan: '#3A5A8A' },
  chi_dao:{ ao: ['#D8B040', '#A88828'], toc: '#2A2028', quan: '#4A4A52' },
  trung:  { ao: ['#5878A8', '#3E5C88'], toc: '#20202A', quan: '#3A3A48' },
  hoa:    { ao: ['#F0C0D0', '#D098B0'], toc: '#3A2A20', quan: '#585870' },
  ong_sang:{ ao: ['#9A8A6A', '#7A6A4A'], toc: '#D0D0D8', quan: '#4A4A52' },
};
// vị trí đứng theo scene (x = góc trên-trái sprite, y tự tính theo vungDi)
const NPC_VI_TRI = {
  phong_tro: { ba_tu: [70, 0], hoa: [230, 0] },
  quan_pho:  { chi_dao: [160, 0], hung: [60, 0] },
  van_phong: { linh: [50, 0], tuan: [140, 0], duc: [240, 0] },
  pho_dem:   { mai: [60, 0], nam: [160, 0], hanh: [250, 0] },
  bia_hoi:   { hung: [120, 0], trung: [200, 0], thao: [270, 0] },
};
// câu ambient chatter theo tính cách (word gets around!)
const NPC_CHATTER = {
  linh:   ['Nghe nói sếp Đức lại tăng chỉ tiêu đó...', 'Trưa nay ăn gì ta? Cơm tấm hông?', 'Ê bộ đồ mới đẹp dữ!'],
  tuan:   ['...Ừ.', 'Cà phê không?', 'Deadline thứ sáu.'],
  ba_tu:  ['Đầu tháng nhớ tiền phòng đó con!', 'Trời ơi rác để trước cửa hoài à?', 'Bà nấu chè, ai ăn hông?'],
  hung:   ['Đơn nổ quá trời luôn anh ơi!', 'Chạy kịp 30 cuốc hôm nay!', 'Xe tui mới thay bình, bốc lắm!'],
  mai:    ['Tối nay rảnh hông? Đi ăn đi!', 'Dạo này trông bạn khác khác nha...', 'Ê ê nghe chuyện này hay lắm!'],
  thao:   ['Nay vẫn như cũ ha anh? Đen không đường!', 'Trời nóng làm ly cà phê muối đi!', 'Em giữ chỗ quen cho anh rồi đó.'],
  duc:    ['Q4 chỉ tiêu +30%.', 'Báo cáo chưa thấy trên mail?', 'Cuối tuần này OT nha mọi người.'],
  hanh:   ['Nghe nói con bà Tư... thôi không nói!', 'Xóm mình sắp có điện mới đó!', 'Cháu ăn cơm chưa?'],
  nam:    ['Tối nay leo rank không bạn?', 'Game mới ra hay lắm!', 'Rủ thêm đứa nữa cho đủ team!'],
  chi_dao:['Xôi nóng đây! Thêm ruốc không con?', 'Nay cô bán đắt lắm nghen!', 'Trời lạnh ăn xôi là đúng bài!'],
  trung:  ['Máy chủ lại sập rồi.', 'Sửa xong rồi, khỏi lo.', '...wifi tầng 3 yếu lắm.'],
  hoa:    ['Con sắp thi cuối kỳ rồi bà ơi!', 'Học bổng kỳ này con được nè!', 'Tối nay con nấu canh chua nghen bà!'],
  cu_long:['Hồi xưa chỗ này là ruộng hết đó con.', 'Giờ tụi bây sướng, có máy lạnh.', 'Trà sáng với tao không?'],
  ong_sang:['Báo mới! Tin nóng đây!', 'Thời buổi này ai còn đọc báo giấy ha?', 'Cho ông tờ Tuổi Trẻ như mọi khi nha!'],
};
let NPC_HIENTAI = []; // { id, x, y, frame, bobOffset, bubble: null|{text, progress, until}, icon: null|{kind, until} }

function napNpcScene() {
  const sc = SCENES[SCENE_HIEN];
  const ids = NPC_SCENE_MAP[SCENE_HIEN] || [];
  NPC_HIENTAI = [];
  for (const id of ids) {
    const vt = (NPC_VI_TRI[SCENE_HIEN] || {})[id];
    if (!vt) continue;
    const sc2 = (SCENES[SCENE_HIEN].charScale) || 2;
    const charPx = SCENES[SCENE_HIEN].charPx || 24 * sc2;
    // đứng trong vùng đi được, y = đáy vungDi trừ chiều cao sprite
    const v = sc.vungDi || { y1: 141, y2: 160 };
    const y = Math.max(v.y1, v.y2) - charPx + 6;
    NPC_HIENTAI.push({ id, x: vt[0], y, frameDem: Math.floor(Math.random() * 60),
      bubble: null, icon: null, di: Math.random() < 0.5 ? -1 : 1 });
  }
}

// bubble thoại + typewriter: mỗi tick render tiến 1 ký tự
function npcCapNhat() {
  const now = TG;
  // ambient chatter ngẫu nhiên: mỗi NPC ~0.4%/tick nói 1 câu
  for (const n of NPC_HIENTAI) {
    if (!n.bubble && Math.random() < 0.004) {
      const arr = NPC_CHATTER[n.id] || ['...'];
      const txt = arr[Math.floor(Math.random() * arr.length)];
      n.bubble = { text: txt, progress: 0, until: now + 180 + txt.length * 6 };
      n.icon = null;
    }
    if (n.bubble) {
      if (n.bubble.progress < n.bubble.text.length) n.bubble.progress++; // typewriter
      if (now > n.bubble.until) n.bubble = null;
    }
    // icon cảm xúc ngẫu nhiên (giận đỏ khi bị nhắc tiền trọ, sao khi vui...)
    if (!n.icon && !n.bubble && Math.random() < 0.0015) {
      const kinds = ['vui', 'gian', 'yeu', 'hoi'];
      n.icon = { kind: kinds[Math.floor(Math.random() * kinds.length)], until: now + 150 };
    }
    if (n.icon && now > n.icon.until) n.icon = null;
    n.frameDem++;
  }
}

function veNpcTrongScene() {
  const SC = (SCENES[SCENE_HIEN].charScale) || 2;
  const charPx = SCENES[SCENE_HIEN].charPx || 24 * SC;
  for (const n of NPC_HIENTAI) {
    const look = NPC_LOOK[n.id] || { ao: ['#8888A0', '#666680'], toc: '#20202A', quan: '#3A3A48' };
    const bob = (n.frameDem % 60 < 30) ? 0 : -1; // idle bob 1px
    const y = n.y + bob;
    // bóng tiếp xúc
    CTX.fillStyle = 'rgba(8,6,12,0.5)';
    CTX.beginPath(); CTX.ellipse(n.x + 6 * SC, n.y + charPx + 1, 6 * SC * 0.4, SC * 1.2, 0, 0, 7); CTX.fill();
    // sprite: dùng CHAR_FRAMES nhưng đổi bảng màu theo NPC
    const frame = (n.frameDem % 120 < 100) ? 'idle' : (n.frameDem % 120 < 110 ? 'walk1' : 'walk2');
    const mauRieng = { ...CHAR_COLOR, a: look.ao[0], q: look.quan, t: look.toc };
    // outline 8 hướng
    for (const [ox, oy] of [[-SC,0],[SC,0],[0,-SC],[0,SC],[-SC,-SC],[SC,-SC],[-SC,SC],[SC,SC]]) {
      veCharRaw(CHAR_FRAMES[frame], n.x + ox, y + oy, SC, n.di > 0, (ch) => mauRieng[ch] ? C.den || '#181420' : null);
    }
    veCharRaw(CHAR_FRAMES[frame], n.x, y, SC, n.di > 0, (ch) => mauRieng[ch] || null);
    // shadow áo 2 tông: phủ nửa phải áo bằng màu tối
    CTX.fillStyle = look.ao[1];
    for (let r = 8; r < 16; r++) {
      const line = CHAR_FRAMES[frame][r];
      for (let cc = 7; cc < 12; cc++) {
        const ch = n.di > 0 ? line[cc] : line[line.length - 1 - cc];
        if (ch === 'a') CTX.fillRect(n.x + cc * SC, y + r * SC, SC, SC);
      }
    }
    // (không vẽ tên trên đầu — 9 To Life không có; pixel-crush làm chữ 7px không đọc được)
    // BUBBLE THOẠI kiểu 9 To Life: hộp trắng viền đen + đuôi + typewriter
    if (n.bubble) {
      const txt = n.bubble.text.slice(0, n.bubble.progress);
      CTX.font = '7px monospace';
      const wTxt = Math.min(CTXT_DO_W(txt), 90);
      const bx = Math.max(4, Math.min(n.x + 6 * SC - wTxt / 2 - 4, W - wTxt - 14));
      const by = Math.max(16, n.y - 26);
      CTX.fillStyle = '#FFFFFF';
      CTX.fillRect(bx, by - 12, wTxt + 8, 16);
      CTX.fillStyle = '#101010'; // viền 1px
      CTX.fillRect(bx - 1, by - 13, wTxt + 10, 1); CTX.fillRect(bx - 1, by + 4, wTxt + 10, 1);
      CTX.fillRect(bx - 1, by - 13, 1, 18); CTX.fillRect(bx + wTxt + 8, by - 13, 1, 18);
      CTX.fillRect(bx + 8, by + 5, 3, 3); CTX.fillRect(bx + 9, by + 8, 2, 2); // đuôi
      CTX.fillStyle = '#141414';
      CTX.fillText(txt, bx + 4, by);
    }
    // ICON CẢM XÚC trên đầu (8x8 rõ — đọc được qua pixel crush)
    if (n.icon) {
      const ix = n.x + 6 * SC - 4, iy = n.y - 14;
      if (n.icon.kind === 'gian') { CTX.fillStyle = '#E03030'; CTX.fillRect(ix, iy, 2, 8); CTX.fillRect(ix + 6, iy, 2, 8); CTX.fillRect(ix - 1, iy + 3, 10, 2); }
      if (n.icon.kind === 'vui')   { CTX.fillStyle = '#FFD040'; CTX.fillRect(ix + 3, iy, 2, 3); CTX.fillRect(ix + 6, iy + 3, 2, 3); CTX.fillRect(ix + 3, iy + 6, 2, 3); CTX.fillRect(ix, iy + 3, 2, 3); CTX.fillRect(ix + 3, iy + 3, 2, 2); }
      if (n.icon.kind === 'yeu')   { CTX.fillStyle = '#FF5FA8'; CTX.fillRect(ix, iy + 1, 3, 3); CTX.fillRect(ix + 5, iy + 1, 3, 3); CTX.fillRect(ix, iy + 4, 8, 2); CTX.fillRect(ix + 1, iy + 6, 6, 1); CTX.fillRect(ix + 3, iy + 7, 2, 1); }
      if (n.icon.kind === 'hoi')   { CTX.fillStyle = '#9AA0B0'; CTX.fillRect(ix, iy + 2, 7, 5); CTX.fillRect(ix + 2, iy + 7, 2, 2); CTX.fillRect(ix + 3, iy + 9, 1, 1); }
    }
    // MARKER sao xanh nếu là người yêu
    if (typeof G !== 'undefined' && G && G.banGai && G.banGai.npcId === n.id) {
      const mx = n.x + 6 * SC - 2, my = n.y - 24 + Math.sin(TG * 0.1) * 2;
      CTX.fillStyle = '#40D850';
      CTX.fillRect(mx + 1, my, 2, 5); CTX.fillRect(mx, my + 1, 4, 2);
    }
  }
}
// đo chiều rộng text (canvas font 7px) — cache
const _wCache = {};
function CTXT_DO_W(t) {
  if (_wCache[t] !== undefined) return _wCache[t];
  CTX.font = '7px monospace';
  return (_wCache[t] = CTX.measureText(t).width);
}

// tap NPC: hit-test trong tapToMove — đi tới rồi mở menu
let NPC_MUC_TIEU = null; // { id, x }
function npcHitTest(mx, my) {
  const SC = (SCENES[SCENE_HIEN].charScale) || 2;
  const charPx = SCENES[SCENE_HIEN].charPx || 24 * SC;
  for (const n of NPC_HIENTAI) {
    if (mx >= n.x - 4 && mx <= n.x + 12 * SC + 4 && my >= n.y - 6 && my <= n.y + charPx + 4) return n;
  }
  return null;
}

function tapToMove(mx, my) {
  const sc = SCENES[SCENE_HIEN];
  NGUOI.dichX = mx - 12;
  NGUOI.mucTieuAction = null;
  NPC_MUC_TIEU = null;
  // ưu tiên NPC: chạm NPC → đi tới cạnh NPC rồi mở menu
  const npcCham = npcHitTest(mx, my);
  if (npcCham) {
    NPC_MUC_TIEU = npcCham;
    const SCt = (sc.charScale) || 2;
    NGUOI.mucTieuAction = 'npc:' + npcCham.id;
    NGUOI.mucTieuX = npcCham.x + (NGUOI.x < npcCham.x ? -14 : 12 * SCt + 2);
    NGUOI.mucTieuY = npcCham.y;
    [NGUOI.mucTieuX, NGUOI.mucTieuY] = gioiHan(sc, NGUOI.mucTieuX, NGUOI.mucTieuY);
    return;
  }
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
  napNpcScene();
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
  napNpcScene();
  const sc = SCENES[ten];
  NGUOI.x = sc.viTriGoc[0]; NGUOI.y = sc.viTriGoc[1];
  NGUOI.dichX = null; NGUOI.mucTieuAction = null;
  NGUOI.frame = 'idle';
  if (typeof sauKhiDoiScene === 'function') sauKhiDoiScene(sc.ten);
  render();
}

function thucHienAction(act) {
  if (typeof G === 'undefined' || !G) { if (typeof hopThoai === 'function') hopThoai('??', 'Chọn thành phố để bắt đầu đã.'); return; }
  if (typeof act === 'string' && act.startsWith('npc:')) {
    const id = act.slice(4);
    NPC_MUC_TIEU = null;
    // NPC quay mặt về phía nhân vật
    const npc = NPC_HIENTAI.find(n => n.id === id);
    if (npc) npc.di = NGUOI.x < npc.x ? -1 : 1;
    if (typeof moNpc === 'function') moNpc(id);
    return;
  }
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