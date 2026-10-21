// RENDER v5 — 8bit THUẦN kiểu 9 To Life: tile-based, nhân vật 24px outline, tap-to-move
// 4 bối cảnh VN: phòng trọ / quán phở / văn phòng / phố đêm + bloom + dithering
const CANVAS = document.getElementById('man-choi');
const CTX = CANVAS.getContext('2d');
CTX.imageSmoothingEnabled = false;

const W = 320, H = 240, T = 16;

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
    '....q..q....',
    '....q..q....',
    '....q..q....',
    '...gg..gg...',
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
    '...qqqq.....',
    '...qq..q....',
    '..qq....q...',
    '..q......q..',
    '.gg......gg.',
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
    '.....qqqq...',
    '....q..qq...',
    '...q....qq..',
    '..q......q..',
    '.gg.....gg..',
  ],
};
const CHAR_COLOR = { t: P.toc, d: P.da, m: P.den, a: P.teal, q: P.nau2, g: P.den, ' ': null, '.': null };

function veCharRaw(rows, x, y, sc, flip, mauFn) {
  for (let r = 0; r < rows.length; r++) {
    const line = rows[r];
    for (let c = 0; c < line.length; c++) {
      const ch = flip ? line[line.length-1-c] : line[c];
      const mau = mauFn(ch);
      if (!mau) continue;
      CTX.fillStyle = mau;
      CTX.fillRect(x + c*sc, y + r*sc, sc, sc);
    }
  }
}

function veChar(frame, x, y, flip) {
  const rows = CHAR_FRAMES[frame];
  const SC = 2; // 24x36 — nhân vật nhỏ chuẩn 9 To Life
  // Outline đen quanh silhouette
  for (const [ox, oy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
    veCharRaw(rows, x + ox, y + oy, SC, flip, (ch) => CHAR_COLOR[ch] ? P.den : null);
  }
  veCharRaw(rows, x, y, SC, flip, (ch) => CHAR_COLOR[ch]);
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
    giuong: [16, 120, 84, 34, 'ngu'],
    ban_an: [128, 150, 64, 28, 'an'],
    cua: [8, 196, 30, 44, 'ra_pho'],
    tivi: [248, 46, 56, 50, 'tivi'],
    tu_kinh: [20, 52, 52, 44, 'tu_kinh'],
  },
  viTriGoc: [150, 130],
};

// --- SCENE 2: QUÁN PHỞ ---
SCENES.quan_pho = {
  ten: 'Quán phở Bà Hạnh',
  ve() {
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
    ban: [30, 144, 220, 40, 'an_pho'],
    noi: [180, 76, 60, 40, 'noi_pho'],
    cua: [4, 190, 28, 50, 've_phong'],
  },
  viTriGoc: [120, 180],
};

// --- SCENE 3: VĂN PHÒNG ---
SCENES.van_phong = {
  ten: 'Văn phòng',
  ve() {
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
    ban_lam: [16, 106, 300, 56, 'lam'],
    bang: [96, 14, 128, 34, 'bang_hop'],
    cua: [284, 180, 30, 60, 've_phong'],
  },
  viTriGoc: [160, 200],
};

// --- SCENE 4: PHỐ ĐÊM ---
SCENES.pho_dem = {
  ten: 'Phố đêm',
  ve() {
    CTX.fillStyle = P.dem; CTX.fillRect(0, 0, W, H);
    dither(0, 0, W, 115, 'rgba(58,47,82,0.35)', 6);
    for (let i = 0; i < 40; i++) {
      CTX.fillStyle = i % 3 ? P.kem : P.vang;
      CTX.fillRect(((i*61) % W), ((i*37) % 110), 1, 1);
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
    for (const [sx, mau] of [[20, P.do], [50, P.vang], [230, P.vang], [270, P.cam]]) {
      CTX.fillStyle = 'rgba(232,196,106,0.08)';
      CTX.fillRect(sx-14, 76, 62, 66);
      CTX.fillStyle = 'rgba(232,196,106,0.14)';
      CTX.fillRect(sx-6, 80, 46, 58);
      CTX.fillStyle = mau; CTX.fillRect(sx, 84, 34, 30);
      CTX.fillStyle = 'rgba(255,246,224,0.3)';
      CTX.fillRect(sx-2, 82, 38, 4);
      CTX.fillStyle = 'rgba(232,196,106,0.1)';
      CTX.fillRect(sx, 114, 34, 24);
    }
    CTX.fillStyle = P.do2; CTX.fillRect(96, 70, 100, 20);
    CTX.fillStyle = P.do; CTX.fillRect(99, 73, 94, 14);
    CTX.fillStyle = P.vang;
    CTX.fillRect(110, 77, 3, 7); CTX.fillRect(110, 77, 7, 2);
    CTX.fillRect(126, 77, 3, 8); CTX.fillRect(124, 77, 6, 2);
    CTX.fillRect(124, 74, 6, 2);
    CTX.fillRect(140, 77, 8, 2); CTX.fillRect(140, 77, 2, 8); CTX.fillRect(146, 77, 2, 8); CTX.fillRect(140, 83, 8, 2);
    CTX.fillRect(158, 77, 3, 8); CTX.fillRect(156, 77, 6, 2);
    CTX.fillStyle = P.nau2; CTX.fillRect(158, 96, 4, 74);
    CTX.fillStyle = P.vang; CTX.fillRect(150, 92, 20, 5);
    for (const [bk, alpha] of [[26, 0.1], [16, 0.18]]) {
      CTX.fillStyle = `rgba(232,196,106,${alpha})`;
      CTX.beginPath(); CTX.arc(160, 100, bk, 0, 7); CTX.fill();
    }
    CTX.fillStyle = 'rgba(232,196,106,0.35)';
    CTX.fillRect(146, 110, 28, 3);
    CTX.strokeStyle = P.den; CTX.lineWidth = 1;
    CTX.beginPath(); CTX.moveTo(0, 58); CTX.quadraticCurveTo(80, 72, 160, 56); CTX.stroke();
    CTX.beginPath(); CTX.moveTo(160, 56); CTX.quadraticCurveTo(240, 70, 320, 56); CTX.stroke();
    CTX.fillStyle = P.nau2; CTX.fillRect(0, 54, 4, 60);
    CTX.fillStyle = '#3A3A48'; CTX.fillRect(0, 170, W, 30);
    CTX.fillStyle = '#5A5A6A'; CTX.fillRect(0, 170, W, 3);
    CTX.fillStyle = '#2E2E3A';
    for (let i = 0; i < 10; i++) CTX.fillRect(i*34, 173, 1, 27);
    CTX.fillStyle = '#241B30'; CTX.fillRect(0, 200, W, 40);
    CTX.fillStyle = P.vang;
    for (let i = 0; i < 8; i++) CTX.fillRect(i*44, 218, 18, 3);
    CTX.fillStyle = P.xanh; CTX.fillRect(240, 176, 30, 8);
    CTX.fillStyle = '#2456A0'; CTX.fillRect(240, 176, 30, 3);
    CTX.fillStyle = P.den; CTX.beginPath(); CTX.arc(244, 186, 4, 0, 7); CTX.fill();
    CTX.beginPath(); CTX.arc(266, 186, 4, 0, 7); CTX.fill();
    CTX.fillStyle = P.den; CTX.fillRect(252, 168, 10, 10);
    CTX.fillStyle = P.vang; CTX.fillRect(268, 180, 4, 3);
    CTX.fillStyle = P.nau; CTX.fillRect(60, 180, 26, 10);
    CTX.fillStyle = P.do2; CTX.fillRect(64, 172, 18, 8);
    CTX.fillStyle = P.vang; CTX.fillRect(66, 174, 4, 2);
    CTX.fillStyle = 'rgba(255,246,224,0.5)'; CTX.fillRect(70, 166, 3, 6); CTX.fillRect(76, 162, 3, 8);
    CTX.fillStyle = P.do; CTX.fillRect(96, 184, 12, 12); CTX.fillRect(98, 178, 8, 6);
    CTX.fillStyle = P.xanh; CTX.fillRect(116, 184, 12, 12); CTX.fillRect(118, 178, 8, 6);
    CTX.fillStyle = 'rgba(232,196,106,0.15)';
    CTX.fillRect(-4, 112, 48, 62);
    CTX.fillStyle = P.vat; CTX.fillRect(0, 120, 36, 50);
    CTX.fillStyle = P.vang; CTX.fillRect(6, 126, 24, 6);
    CTX.fillStyle = '#5A4A22'; CTX.fillRect(6, 132, 24, 38);
  },
  diem: {
    quan: [20, 76, 280, 46, 'quan_bar'],
    ve_phong: [0, 120, 36, 50, 've_phong'],
    do_an: [60, 162, 68, 36, 'an_via_he'],
  },
  viTriGoc: [160, 196],
};

let SCENE_HIEN = 'phong_tro';
function render() {
  const sc = SCENES[SCENE_HIEN];
  sc.ve();
  veNguoiHien();
}

function veNguoiHien() {
  const { x, y, di, frame } = NGUOI;
  CTX.fillStyle = 'rgba(13,10,20,0.4)';
  CTX.beginPath(); CTX.ellipse(x+12, y+37, 9, 2.5, 0, 0, 7); CTX.fill();
  CTX.strokeStyle = 'rgba(232,196,106,0.5)'; CTX.lineWidth = 1;
  CTX.beginPath(); CTX.ellipse(x+12, y+36, 13, 4, 0, 0, 7); CTX.stroke();
  veChar(frame, x, y, di < 0);
}

// NGUOI: x,y là góc trên-trái sprite 24x36
let NGUOI = { x: 150, y: 130, di: 1, frame: 'idle', dichX: null, mucTieuAction: null, mucTieuX: 0, mucTieuY: 0, vanToc: 1.6, frameDem: 0 };

function tapToMove(mx, my) {
  NGUOI.dichX = mx - 12;
  const sc = SCENES[SCENE_HIEN];
  for (const [ten, [px, py, pw, ph, action]] of Object.entries(sc.diem)) {
    if (mx >= px && mx <= px+pw && my >= py && my <= py+ph) {
      NGUOI.mucTieuAction = action;
      NGUOI.mucTieuX = Math.min(Math.max(px + pw/2 - 12, 10), W-26);
      NGUOI.mucTieuY = Math.min(Math.max(py + ph - 30, 50), H-42);
      break;
    }
  }
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

function buocChuyen() {
  let dx = 0, dy = 0;
  if (PHIM1['ArrowLeft'] || PHIM1['a']) dx = -1;
  if (PHIM1['ArrowRight'] || PHIM1['d']) dx = 1;
  if (PHIM1['ArrowUp'] || PHIM1['w']) dy = -1;
  if (PHIM1['ArrowDown'] || PHIM1['s']) dy = 1;
  if (dx || dy) {
    NGUOI.x = Math.max(4, Math.min(W-28, NGUOI.x + dx*NGUOI.vanToc));
    NGUOI.y = Math.max(50, Math.min(H-42, NGUOI.y + dy*NGUOI.vanToc));
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
  if (typeof hopThoai === 'function') hopThoai(sc.ten, 'Bạn đến: ' + sc.ten + '. Chạm vào đồ vật để tương tác, chạm sàn để đi.');
  render();
}

function thucHienAction(act) {
  if (typeof G === 'undefined' || !G) { if (typeof hopThoai === 'function') hopThoai('??', 'Chọn thành phố để bắt đầu đã.'); return; }
  switch (act) {
    case 'ngu':     ngu(); break;
    case 'an':      anUong(); break;
    case 'an_pho':  anUong(); break;
    case 'an_via_he': anUong(); break;
    case 'lam':     diLam(); break;
    case 'tivi':    apDung({tamTrang:+6}); hopThoai('Tivi', 'Chương trình hài cũ chiếu lại — cười một mình cũng đỡ.'); break;
    case 'tu_kinh': hopThoai('Tủ kính', 'Chén đĩa sáng bóng, trên cùng là hộp bánh Trung thu để dành. Mẹ gọi điện chưa?'); break;
    case 'noi_pho': hopThoai('Nồi nước lèo', 'Hương xương sôi 6 tiếng. Bà Hạnh: "Cháu hớt tay không, đỡ hơn uống cà phê."'); break;
    case 'bang_hop': hopThoai('Bảng họp', 'Sếp gạch đầu dòng: "Q4 chỉ tiêu +30%". Không ai dám hỏi lại.'); break;
    case 'quan_bar': hopThoai('Quán', 'Vài người quen gật đầu. ❤️+10 — hẹn gặp lại.'); apDung({tamTrang:+10, nangLuong:-10}); break;
    case 'ra_pho':  doiScene('pho_dem'); return;
    case 've_phong': doiScene('phong_tro'); return;
  }
  render();
}

function vongLap() { buocChuyen(); requestAnimationFrame(vongLap); }
requestAnimationFrame(vongLap);
// Fallback khi tab ẩn (Chrome throttle rAF)
setInterval(() => { if (document.hidden && NGUOI.dichX !== null) buocChuyen(); }, 250);