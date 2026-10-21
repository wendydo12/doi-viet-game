// RENDER — vẽ phòng trọ pixel 100% Việt bằng canvas thuần (không ảnh)
// Bảng màu PikLab hoài niệm
const M = {
  vangNge:'#E8C46A', tealCo:'#47857D', nauGo:'#6D4A2E', doDo:'#C0392B',
  kemNga:'#E8D5B0', dem:'#1A1626', trangNge:'#FFF6E0', nai:'#C9B48E',
  nauSac:'#3E2723', xanhBia:'#2E7D32', xanhNhua:'#3498DB', inox:'#9AA5A8',
};

const CANVAS = document.getElementById('man-choi');
const CTX = CANVAS.getContext('2d');
CTX.imageSmoothingEnabled = false;

const TILE = 16;
const MAP_W = 20;  // 320/16
const MAP_H = 15;  // 240/16

// Bản đồ phòng trọ: 0=sàn gạch bông, 1=tường, 2=cửa, 3=cửa sổ, 4=điạ
const BANDO = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// Vị trí đồ vật (tile coords)
const DO_VAT = [
  { x:1, y:1, w:3, h:2, loai:'tukinh',  ten:'Tủ kính gỗ' },
  { x:16, y:1, w:3, h:2, loai:'tivi',   ten:'Tivi CRT' },
  { x:5, y:2, w:2, h:2, loai:'ghe',     ten:'Ghế nhựa cấy' },
  { x:12, y:2, w:2, h:2, loai:'ghe',    ten:'Ghế nhựa cấy' },
  { x:8, y:4, w:2, h:2, loai:'giuong',  ten:'Giường' },
  { x:2, y:11, w:3, h:2, loai:'ban',    ten:'Bàn gỗ' },
  { x:15, y:11, w:3, h:2, loai:'ban',   ten:'Bàn gỗ' },
];

let NGUOI = { tx: 9, ty: 7, f: 0 }; // tile coords + frame
let THANGDC = 'none';

function veGachBong(x, y, w, h) {
  // gạch bông 2x2: hoa 8 cánh kem viền nâu đỏ
  for (let ty = y; ty < y+h; ty++) {
    for (let tx = x; tx < x+w; tx++) {
      const p = (tx + ty) % 2;
      CTX.fillStyle = p === 0 ? '#D8CBB0' : '#C9B48E';
      CTX.fillRect(tx*TILE, ty*TILE, TILE, TILE);
      // hoa văn giữa mỗi viên
      const cx = tx*TILE + 8, cy = ty*TILE + 8;
      CTX.fillStyle = '#B88868';
      CTX.fillRect(cx-3, cy-3, 6, 6);
      CTX.fillStyle = '#E8D5B0';
      CTX.fillRect(cx-1, cy-1, 2, 2);
    }
  }
}

function veTukinh(x, y) {
  CTX.fillStyle = M.nauGo;
  CTX.fillRect(x, y, 3*TILE, 2*TILE);
  CTX.fillStyle = '#5A3A22';
  CTX.fillRect(x+2, y+2, 3*TILE-4, 2*TILE-4);
  // kính
  for (let i = 0; i < 3; i++) {
    CTX.fillStyle = '#A8C4C0';
    CTX.fillRect(x+4+i*(TILE-2), y+4, TILE-6, 2*TILE-8);
    CTX.fillStyle = '#5A3A22';
    CTX.fillRect(x+4+i*(TILE-2), y+4+TILE-3, TILE-6, 1);
  }
}

function veTivi(x, y) {
  CTX.fillStyle = M.doDo;
  CTX.fillRect(x+2, y, 2*TILE, 2*TILE);
  CTX.fillStyle = '#1A1626';
  CTX.fillRect(x+5, y+4, 2*TILE-6, 14);
  CTX.fillStyle = '#4A5A5A';
  CTX.fillRect(x+7, y+6, 2*TILE-10, 10);
  CTX.fillStyle = M.inox;
  CTX.fillRect(x+2, y+2*TILE, 2*TILE, 3); // chân
}

function veGheNhuax(x, y, mau) {
  CTX.fillStyle = mau || M.doDo;
  CTX.fillRect(x+4, y+2, TILE-8, 4); // lưng
  CTX.fillStyle = mau || M.doDo;
  CTX.fillRect(x+3, y+6, TILE-6, 6);
  CTX.fillStyle = '#A03A2A';
  CTX.fillRect(x+4, y+12, 2, 3); // chân
  CTX.fillRect(x+TILE-6, y+12, 2, 3);
}

function veGiuong(x, y) {
  CTX.fillStyle = M.nauGo;
  CTX.fillRect(x, y, 2*TILE, 2*TILE);
  CTX.fillStyle = '#8B5E3C';
  CTX.fillRect(x+2, y+4, 2*TILE-4, 2*TILE-6);
  CTX.fillStyle = M.trangNge;
  CTX.fillRect(x+2, y+6, 2*TILE-4, 6); // chăn
  CTX.fillStyle = M.doDo;
  CTX.fillRect(x+2, y+6, 6, 6); // gối
}

function veBan(x, y) {
  CTX.fillStyle = M.nauGo;
  CTX.fillRect(x, y, 3*TILE, TILE);
  CTX.fillStyle = '#5A3A22';
  CTX.fillRect(x+2, y+TILE, 4, TILE);
  CTX.fillRect(x+3*TILE-6, y+TILE, 4, TILE);
  // cốc nhựa + hộp cơm sáng
  CTX.fillStyle = '#E0E0E0';
  CTX.fillRect(x+6, y+3, 4, 5);
  CTX.fillStyle = M.xanhNhua;
  CTX.fillRect(x+16, y+4, 10, 6);
}

function veNguoi(x, y, frame) {
  const px = x*TILE, py = y*TILE;
  // chân
  CTX.fillStyle = '#1A1626';
  CTX.fillRect(px+5, py+12, 2, 4);
  CTX.fillRect(px+9, py+12, 2, 4);
  // thân áo
  CTX.fillStyle = M.tealCo;
  CTX.fillRect(px+4, py+5, 8, 8);
  // tay
  CTX.fillRect(px+2, py+6, 2, 5);
  CTX.fillRect(px+12, py+6, 2, 5);
  // đầu + tóc
  CTX.fillStyle = '#F0D5B0';
  CTX.fillRect(px+5, py, 6, 6);
  CTX.fillStyle = '#2B2340';
  CTX.fillRect(px+5, py, 6, 3);
  // mắt
  CTX.fillStyle = '#1A1626';
  CTX.fillRect(px+6, py+3, 1, 1);
  CTX.fillRect(px+9, py+3, 1, 1);
}

function veCaNhan(dv) {
  const px = dv.x * TILE, py = dv.y * TILE;
  switch (dv.loai) {
    case 'tukinh': veTukinh(px, py); break;
    case 'tivi': veTivi(px, py); break;
    case 'ghe': veGheNhuax(px, py); break;
    case 'giuong': veGiuong(px, py); break;
    case 'ban': veBan(px, py); break;
  }
}

function render() {
  // nền: sàn gạch bông
  veGachBong(0, 0, MAP_W, MAP_H);
  // tường trên cùng + viền
  CTX.fillStyle = M.vangNge;
  CTX.fillRect(0, 0, CANVAS.width, TILE);
  CTX.fillStyle = M.nauSac;
  for (let x = 0; x < MAP_W; x++) {
    if (BANDO[0][x] === 1) CTX.fillRect(x*TILE, 0, TILE, TILE);
  }
  // cửa
  CTX.fillStyle = '#5A3A22';
  CTX.fillRect(0, 13*TILE, TILE, TILE);
  CTX.fillStyle = M.doDo;
  CTX.fillRect(2, 13*TILE+2, TILE-4, TILE-4);

  // đồ vật
  DO_VAT.forEach(veCaNhan);

  // cửa sổ
  CTX.fillStyle = M.xanhNhua;
  CTX.fillRect(6*TILE, 0, TILE*2, TILE-2);
  CTX.fillStyle = '#FFF';
  CTX.fillRect(6*TILE+2, 1, TILE*2-4, TILE-6);

  // người
  veNguoi(NGUOI.tx, NGUOI.ty, NGUOI.f);
}

// Di chuyển (phím + chạm)
window.addEventListener('keydown', (e) => {
  const map = { ArrowUp: [0,-1], ArrowDown: [0,1], ArrowLeft: [-1,0], ArrowRight: [1,0] };
  if (map[e.key]) { e.preventDefault(); dich(map[e.key]); }
});
CANVAS.addEventListener('pointerdown', (ev) => {
  const rect = CANVAS.getBoundingClientRect();
  const mx = (ev.clientX - rect.left) / rect.width * CANVAS.width;
  const my = (ev.clientY - rect.top) / rect.height * CANVAS.height;
  const dx = Math.round((mx/TILE) - NGUOI.tx), dy = Math.round((my/TILE) - NGUOI.ty);
  dich([Math.sign(dx), Math.sign(dy)]);
});

function dich([dx, dy]) {
  const nx = NGUOI.tx + dx, ny = NGUOI.ty + dy;
  if (nx >= 1 && nx < MAP_W-1 && ny >= 1 && ny < MAP_H-1) {
    NGUOI.tx = nx; NGUOI.ty = ny;
    render();
  }
}
