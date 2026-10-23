// ===== CẢNH 3 THÀNH PHỐ — flat side-view pixel chuẩn 9 To Life =====
// Luật style (CẤM vi phạm): 2D phẳng side-view, outline 1px quanh mọi vật,
// shading 2-3 tông phẳng, dither checkerboard cho texture, KHÔNG gradient mềm,
// KHÔNG bloom/glow/lighter, KHÔNG phối cảnh sâu, KHÔNG filter.
// Mỗi thành phố 5 cảnh KHÁC NHAU rõ: Sài Gòn / Hà Nội / Đà Nẵng.

const C = {
  den: '#181420', den2: '#241B30',
  // tường + gỗ
  vNha: '#D8B45A', vNha2: '#B8923E', vNha3: '#8A6A28',
  xTuong: '#7FA0A8', xTuong2: '#5E7E86',
  kTuong: '#E8DCC0', kTuong2: '#C8BC9C',
  olTuong: '#7C8C5C', olTuong2: '#5E6E42',
  go: '#8A5A30', go2: '#6A4220', go3: '#4A2C14',
  sat: '#9AA0A8', sat2: '#6E747C',
  kinh: '#6E8EA8', kinh2: '#4E6E88',
  trang: '#F0F0EC', trang2: '#C4C4C0',
  xam: '#8A8A92', xam2: '#5E5E66',
  // accent
  do: '#C83838', do2: '#8E2418',
  vang: '#FFD040', vang2: '#D2A21C',
  hong: '#FF5FA8', hong2: '#C83878',
  xanhLa: '#3E8E4E', xanhLa2: '#2C6A38',
  xanhDuong: '#3868C8', xanhNc: '#3E7EA8', xanhNc2: '#2C5E84',
  cam: '#E08020', cam2: '#A85C14',
  // thiên nhiên
  troi: '#2E2848', troi2: '#221C38', troiDem: '#1C1630',
  cat: '#E0C890', cat2: '#BCA46E',
  bien: '#3E7EA8', bien2: '#5E9EC8', bot: '#DCEEF8',
  co: '#6E8E46', co2: '#547036',
  than: '#7A4A28', la: '#2E6B34', la2: '#3F8A43',
  laMua: '#C86820', laMua2: '#E08830',
  da: '#E8C098', da2: '#C49A72',
};

// --- helper khối: outline 1px + fill phẳng ---
function K(x, y, w, h, f, o) {
  CTX.fillStyle = o || C.den;
  CTX.fillRect(x - 1, y - 1, w + 2, h + 2);
  CTX.fillStyle = f;
  CTX.fillRect(x, y, w, h);
}
// khối + bóng 1 tông (phải/dưới) — shading 2 tông phẳng
function KB(x, y, w, h, f, bong, o) {
  K(x, y, w, h, f, o);
  CTX.fillStyle = bong;
  CTX.fillRect(x + w - 3, y, 3, h);
  CTX.fillRect(x, y + h - 2, w, 2);
}
function veTuongPhang(x, y, w, h, m1, m2) {
  CTX.fillStyle = m1; CTX.fillRect(x, y, w, h);
  CTX.fillStyle = m2; // đốm texture thưa kiểu tường cũ
  for (let i = 0; i < 24; i++) CTX.fillRect(x + ((i * 61) % w), y + ((i * 37) % h), 3, 2);
}
function veSanGo(y0) {
  CTX.fillStyle = C.go; CTX.fillRect(0, y0, 320, 240 - y0);
  CTX.fillStyle = C.go2;
  for (let yy = y0; yy < 240; yy += 12) CTX.fillRect(0, yy, 320, 2);
  CTX.fillStyle = C.go3;
  for (let yy = y0, i = 0; yy < 240; yy += 12, i++) CTX.fillRect((i * 97) % 300, yy, 2, 12);
  CTX.fillStyle = C.den; CTX.fillRect(0, y0, 320, 2);
}
function veSanGach(y0, m1, m2) {
  CTX.fillStyle = m1; CTX.fillRect(0, y0, 320, 240 - y0);
  CTX.fillStyle = m2;
  for (let yy = y0; yy < 240; yy += 16)
    for (let xx = ((yy / 16) % 2) * 16; xx < 320; xx += 32) CTX.fillRect(xx, yy, 15, 15);
  CTX.fillStyle = C.den; CTX.fillRect(0, y0, 320, 2);
}
function veNhuaGhe(x, y, mau, mau2) { // ghế nhựa thấp VN
  K(x, y, 14, 4, mau); K(x + 1, y - 8, 12, 8, mau);
  CTX.fillStyle = mau2; CTX.fillRect(x + 1, y + 4, 3, 6); CTX.fillRect(x + 10, y + 4, 3, 6);
}
function veXeMay(x, y, mauXe) { // xe máy flat side-view 30x16: bánh, thân, yên, tay lái, đèn pha
  CTX.fillStyle = C.den; CTX.beginPath(); CTX.arc(x + 5, y + 11, 5, 0, 7); CTX.fill(); // bánh trước
  CTX.beginPath(); CTX.arc(x + 23, y + 11, 5, 0, 7); CTX.fill(); // bánh sau
  CTX.fillStyle = C.xam; CTX.fillRect(x + 4, y + 10, 3, 3); CTX.fillRect(x + 22, y + 10, 3, 3); // trục
  CTX.fillStyle = C.den2; CTX.fillRect(x + 4, y + 5, 2, 6); // phuộc trước
  K(x + 3, y + 1, 18, 8, mauXe); // thân + yếm
  CTX.fillStyle = C.vang; CTX.fillRect(x + 2, y + 2, 2, 3); // đèn pha
  K(x + 10, y - 2, 10, 4, C.den2); // yên
  K(x + 17, y - 6, 3, 6, C.den2); // tay lái dựng
  CTX.fillStyle = C.xam; CTX.fillRect(x + 15, y - 7, 8, 2); // ghi-đông ngang
  CTX.fillStyle = C.xam2; CTX.fillRect(x + 21, y + 1, 7, 3); // baga sau
  CTX.fillStyle = C.den2; CTX.fillRect(x + 2, y + 16, 26, 2); // bóng tiếp xúc
}
function veDayDien(y) { // dây điện chằng chịt đặc trưng VN
  CTX.fillStyle = C.den;
  for (let i = 0; i < 4; i++) {
    const yy = y + i * 5;
    for (let x = 0; x < 320; x += 4) {
      const v = Math.sin(x * 0.03 + i) * 3;
      CTX.fillRect(x, yy + v, 4, 1);
    }
  }
}
function veQuatTreo(x, y) {
  CTX.fillStyle = C.den2; CTX.fillRect(0, y, 320, 3); // đường trần nhà
  K(x, y + 3, 3, 8, C.xam2); // ti quạt từ trần xuống
  K(x - 8, y + 11, 19, 4, C.xam);
  CTX.fillStyle = C.xam2; CTX.fillRect(x - 6, y + 12, 15, 2);
}
function veTV(x, y) { // TV CRT đỏ 24x18 + CHÂN ĐẾ (đáy = y+22 chạm mặt kệ)
  KB(x, y, 24, 16, C.do, C.do2);
  K(x + 3, y + 3, 14, 10, C.den2);
  CTX.fillStyle = '#3A4A4A'; CTX.fillRect(x + 4, y + 4, 12, 8); // màn tĩnh
  CTX.fillStyle = C.xam; CTX.fillRect(x + 19, y + 4, 2, 2); CTX.fillRect(x + 19, y + 8, 2, 2);
  K(x + 8, y - 5, 2, 5, C.xam2); K(x + 14, y - 6, 2, 6, C.xam2); // anten
  CTX.fillStyle = C.den2; CTX.fillRect(x + 8, y + 16, 3, 4); CTX.fillRect(x + 14, y + 16, 3, 4); // chân đế
  CTX.fillRect(x + 6, y + 20, 13, 2);
}
function veDenLong(x, y) { // lồng đèn — dây treo DÀI từ mép trần/mái xuống
  K(x, 0, 1, y + 6, C.den2); // dây từ y=0 (trần) xuống đèn
  K(x - 4, y + 6, 9, 12, C.do, C.do2);
  CTX.fillStyle = C.vang; CTX.fillRect(x - 2, y + 9, 5, 6);
  K(x - 1, y + 18, 3, 4, C.vang2);
}
function veCuaSat(x, y, w, h) { // cửa sắt kéo VN
  K(x, y, w, h, C.sat2);
  CTX.fillStyle = C.sat;
  for (let yy = y + 2; yy < y + h - 2; yy += 5) CTX.fillRect(x + 2, yy, w - 4, 3);
}
function veCuaGo(x, y, w, h, mau) { // cửa gỗ phố cổ
  KB(x, y, w, h, mau, C.go3);
  CTX.fillStyle = C.den2;
  for (let xx = x + 3; xx < x + w - 3; xx += 6) CTX.fillRect(xx, y + 3, 2, h - 6);
  CTX.fillStyle = C.vang2; CTX.fillRect(x + w - 6, y + h / 2, 2, 3);
}
function veCay(x, y, kieu) { // cây: kieu='la' xanh | 'mua' lá cam thu HN | 'dua' dừa ĐN
  if (kieu === 'dua') {
    K(x, y - 40, 4, 40, C.than);
    CTX.fillStyle = C.go2;
    for (let i = 0; i < 6; i++) { // tàu dừa tỏa 2 bên
      CTX.fillRect(x + 2 - (i < 3 ? 2 + i * 6 : 0), y - 42 + (i % 3) * 3, i < 3 ? 2 + i * 6 : 8, 2);
    }
    K(x - 14, y - 44, 16, 3, C.la); K(x + 4, y - 44, 16, 3, C.la);
    K(x - 10, y - 48, 10, 3, C.la2); K(x + 6, y - 48, 10, 3, C.la2);
    K(x + 1, y - 38, 4, 4, C.go3); // quả
  } else {
    const m1 = kieu === 'mua' ? C.laMua : C.la, m2 = kieu === 'mua' ? C.laMua2 : C.la2;
    K(x, y - 22, 5, 22, C.than, C.go3);
    K(x - 14, y - 44, 33, 24, m1); // tán tròn khối
    CTX.fillStyle = m2; CTX.fillRect(x - 10, y - 40, 12, 8); CTX.fillRect(x + 6, y - 34, 8, 6);
    CTX.fillStyle = C.den; // viền tán chấm
    for (let i = 0; i < 8; i++) CTX.fillRect(x - 14 + i * 4, y - 45 + (i % 2), 2, 1);
  }
}
function veNhaPho(x, y, w, h, mau, mau2, cuaMau) { // nhà ống mặt phố flat
  KB(x, y, w, h, mau, mau2);
  const cw = Math.max(8, w / 3 - 4);
  for (let t = 0; t < 2; t++) { // 2 tầng cửa sổ
    const wy = y + 8 + t * (h / 2 - 2);
    K(x + 4, wy, cw, 12, C.kinh, C.den2);
    CTX.fillStyle = C.kinh2; CTX.fillRect(x + 5, wy + 6, cw - 2, 5);
    if (w > 30) { K(x + w - cw - 4, wy, cw, 12, C.kinh, C.den2); CTX.fillStyle = C.kinh2; CTX.fillRect(x + w - cw - 3, wy + 6, cw - 2, 5); }
  }
  // cửa chính TẦNG TRỆT — cao ~36px để đúng tỉ lệ với nhân vật 48px
  K(x + w / 2 - 9, y + h - 36, 18, 36, cuaMau, C.den);
  CTX.fillStyle = C.vang2; CTX.fillRect(x + w / 2 + 4, y + h - 18, 2, 3); // tay nắm
}
function veSao() {
  CTX.fillStyle = C.vang;
  for (let i = 0; i < 26; i++) CTX.fillRect((i * 71) % 320, (i * 29) % 90, 1, 1);
  CTX.fillStyle = C.trang;
  for (let i = 0; i < 14; i++) CTX.fillRect((i * 53 + 17) % 320, (i * 41 + 7) % 100, 1, 1);
}
function veKhoi(x, y, m1, m2, n) { // khối đặc: nồi/ly/bát có highlight
  K(x, y, 8, 7, m1); CTX.fillStyle = m2; CTX.fillRect(x + 1, y + 1, 2, 4);
}
function veMayBay(x, y, w) { // mây phẳng
  K(x, y, w, 6, C.xam, C.den2);
  K(x + 4, y - 4, w - 8, 5, C.xam, C.den2);
  CTX.fillStyle = C.trang2; CTX.fillRect(x + 2, y + 1, w - 4, 2);
}

// ============ SÀI GÒN ============
const SG = {};
SG.phong_tro = function () { // phòng trọ hẻm: tường xanh bạc, cửa sắt, gác lửng
  veTuongPhang(0, 0, 320, 142, C.xTuong, C.xTuong2);
  veSanGach(142, '#C8B490', '#B09A78');
  K(250, 20, 54, 40, C.kinh, C.den); // cửa sổ chấn song sắt
  CTX.fillStyle = C.den2; for (let i = 0; i < 4; i++) CTX.fillRect(254 + i * 13, 22, 3, 36);
  CTX.fillStyle = C.troi; CTX.fillRect(252, 22, 50, 8);
  K(0, 16, 68, 8, C.go2, C.den); // gác lửng gỗ — dính sát mép trái
  CTX.fillStyle = C.go; CTX.fillRect(0, 24, 66, 4); // mặt ván sàn gác
  CTX.fillStyle = C.go3; CTX.fillRect(0, 14, 68, 2); CTX.fillRect(0, 10, 3, 6); CTX.fillRect(20, 10, 3, 6); CTX.fillRect(40, 10, 3, 6); CTX.fillRect(64, 10, 3, 6); // lan can
  // đồ trên gác: thùng carton + gối
  CTX.fillStyle = C.den; CTX.fillRect(8, 4, 16, 11); CTX.fillStyle = '#C8A878'; CTX.fillRect(9, 5, 14, 9);
  CTX.fillStyle = C.go3; CTX.fillRect(9, 9, 14, 1);
  K(34, 8, 14, 7, C.trang, C.trang2); CTX.fillStyle = C.xanhNc; CTX.fillRect(34, 8, 4, 7); // gối
  K(56, 28, 6, 114, C.go, C.go3); // thang chạm HẲN xuống sàn
  CTX.fillStyle = C.go2; for (let i = 0; i < 12; i++) CTX.fillRect(57, 32 + i * 9, 4, 2);
  veCuaSat(280, 96, 34, 88); // cửa sắt kéo
  veXeMay(200, 160, C.do); // xe máy dựng trong nhà — rất SG
  K(16, 112, 32, 10, C.go, C.go3); // kệ gỗ trước
  veTV(20, 92); // TV chân đế chạm mặt kệ 112
  CTX.fillStyle = C.go3; CTX.fillRect(16, 120, 32, 2); // bóng tiếp xúc kệ
  K(96, 128, 52, 14, C.go, C.go3); // bàn thấp
  CTX.fillStyle = C.go3; CTX.fillRect(96, 140, 52, 2);
  CTX.fillStyle = C.vang2; CTX.fillRect(100, 122, 10, 6); // nồi cơm
  veQuatTreo(150, 0);
  K(96, 60, 26, 18, C.trang, C.xam2); // ảnh treo tường
  CTX.fillStyle = C.hong2; CTX.fillRect(100, 66, 8, 6);
  CTX.fillStyle = C.den; CTX.fillRect(0, 141, 320, 1); // chân tường mảnh 1px
  // tủ quần áo thấp hơn (đúng tỉ lệ ~1.2x nhân vật)
  CTX.fillStyle = C.den; CTX.fillRect(155, 90, 42, 54);
  CTX.fillStyle = C.sat; CTX.fillRect(156, 91, 40, 52);
  CTX.fillStyle = C.sat2; CTX.fillRect(175, 91, 2, 52); CTX.fillRect(158, 96, 36, 2); CTX.fillRect(158, 120, 36, 2);
  CTX.fillStyle = C.vang2; CTX.fillRect(170, 112, 3, 6); CTX.fillRect(179, 112, 3, 6); // tay nắm
  CTX.fillStyle = C.den2; CTX.fillRect(154, 142, 44, 3); // bóng tiếp xúc
};
SG.quan_pho = function () { // quán cơm tấm vỉa hè: tủ kính thịt nướng, ghế nhựa đỏ
  veTuongPhang(0, 0, 320, 130, C.kTuong, C.kTuong2);
  veSanGach(130, '#A8A094', '#8E867A');
  // biển hiệu GẮN TƯỜNG bằng 2 móc sắt
  CTX.fillStyle = C.xam2; CTX.fillRect(132, 4, 2, 6); CTX.fillRect(186, 4, 2, 6); // móc treo
  K(120, 10, 80, 22, C.do, C.do2);
  CTX.fillStyle = C.vang; CTX.fillRect(128, 18, 64, 6);
  // TỦ KÍNH thịt nướng ĐỨNG TRÊN QUẦY, quầy chạm sàn
  K(170, 100, 110, 30, C.sat, C.sat2); // thân quầy inox chạm sàn y=130
  CTX.fillStyle = C.xam2; CTX.fillRect(174, 110, 102, 3);
  K(166, 92, 118, 10, C.xam, C.xam2); // mặt quầy
  CTX.fillStyle = C.den2; CTX.fillRect(170, 128, 110, 4); // bóng chân quầy
  K(180, 46, 90, 46, C.kinh, C.sat2); // tủ kính trên quầy
  CTX.fillStyle = C.trang2; CTX.fillRect(184, 50, 82, 3); // nóc sáng
  K(190, 62, 22, 14, C.cam, C.go3); // miếng thịt nướng 1
  K(218, 62, 22, 14, C.cam2, C.go3); // miếng thịt nướng 2
  CTX.fillStyle = C.den2; CTX.fillRect(194, 68, 14, 2); CTX.fillRect(222, 68, 14, 2); // vệt nướng
  CTX.fillStyle = C.trang; CTX.fillRect(246, 66, 18, 10); // đĩa cơm trắng
  CTX.fillStyle = C.xanhLa; CTX.fillRect(248, 62, 7, 4); // rau dưa
  CTX.fillStyle = C.do; CTX.fillRect(256, 63, 5, 3); // cà chua
  CTX.fillStyle = C.kinh2; CTX.fillRect(184, 80, 82, 2); // đợt kính ngang
  K(192, 84, 8, 8, C.trang, C.xam); // chén nước mắm
  // nồi cơm lớn trên BÀN NHỎ chạm sàn + khói
  K(14, 108, 38, 6, C.go, C.go3); // mặt bàn nhỏ
  CTX.fillStyle = C.go2; CTX.fillRect(18, 114, 4, 16); CTX.fillRect(44, 114, 4, 16); // chân bàn
  CTX.fillStyle = C.den2; CTX.fillRect(14, 128, 38, 3); // bóng
  K(20, 88, 26, 20, C.trang, C.xam); // nồi cơm trên bàn
  CTX.fillStyle = C.do; CTX.fillRect(24, 82, 18, 6); // nắp đỏ
  CTX.fillStyle = C.trang2; CTX.fillRect(30, 74, 3, 6); CTX.fillRect(38, 70, 3, 8); // hơi
  // bàn ghế nhựa vỉa hè — chân bàn chạm đất + bóng
  K(60, 150, 46, 6, C.go, C.go3);
  CTX.fillStyle = C.go2; CTX.fillRect(64, 156, 5, 16); CTX.fillRect(96, 156, 5, 16);
  CTX.fillStyle = C.den2; CTX.fillRect(58, 172, 50, 3);
  veNhuaGhe(38, 158, C.do, C.do2); veNhuaGhe(112, 158, C.do, C.do2);
  K(70, 140, 10, 8, C.trang, C.xam); // đĩa cơm trên bàn
  CTX.fillStyle = C.cam; CTX.fillRect(72, 138, 6, 3); // sườn
  K(86, 142, 5, 6, C.kinh, C.xam); // ly trà đá
  CTX.fillStyle = C.bot; CTX.fillRect(87, 143, 3, 2);
  veXeMay(252, 150, C.xanhDuong); // xe máy lớn rõ dưới biển
  K(2, 40, 10, 90, C.sat2, C.den); // cột biển trái
  CTX.fillStyle = C.vang; CTX.fillRect(4, 46, 6, 10);
  CTX.fillStyle = C.den2; CTX.fillRect(0, 128, 320, 2);
};
SG.van_phong = function () { // văn phòng Q1: vách kính, bàn dài, monitor phẳng
  veTuongPhang(0, 0, 320, 142, '#D8D8DC', '#B8B8BE');
  veSanGach(142, '#C4C4CC', '#ACACB6');
  K(10, 14, 300, 56, C.kinh, C.sat2); // vách kính nhìn ra phố
  CTX.fillStyle = C.kinh2; CTX.fillRect(14, 48, 292, 18); // bóng thành phố xa
  CTX.fillStyle = C.xam; CTX.fillRect(40, 30, 18, 34); CTX.fillRect(120, 24, 14, 40); CTX.fillRect(220, 32, 22, 32);
  CTX.fillStyle = C.sat2; for (let i = 0; i < 5; i++) CTX.fillRect(14 + i * 62, 16, 4, 52); // đố kính
  for (let i = 0; i < 3; i++) { // 3 bàn làm việc
    const bx = 16 + i * 100;
    K(bx, 120, 84, 8, C.trang, C.xam2);
    CTX.fillStyle = C.xam2; CTX.fillRect(bx + 6, 128, 5, 20); CTX.fillRect(bx + 72, 128, 5, 20);
    K(bx + 24, 96, 34, 22, C.den2); // monitor
    CTX.fillStyle = '#3A5A6A'; CTX.fillRect(bx + 27, 99, 28, 15);
    CTX.fillStyle = C.vang; CTX.fillRect(bx + 30, 102, 14, 2); CTX.fillRect(bx + 30, 106, 20, 2);
    K(bx + 36, 118, 10, 3, C.xam);
    K(bx + 62, 112, 12, 8, C.xanhDuong, C.den2); // ly cà phê
  }
  veQuatTreo(280, 0);
  K(4, 96, 8, 46, C.xanhLa, C.go3); // cây cảnh
  CTX.fillStyle = C.xanhLa2; CTX.fillRect(2, 84, 12, 12);
  CTX.fillStyle = C.den; CTX.fillRect(0, 140, 320, 2);
};
SG.pho_dem = function () { // phố đêm kiểu Bùi Viện: nhà ống cao, neon phẳng, dây điện
  CTX.fillStyle = C.troiDem; CTX.fillRect(0, 0, 320, 160);
  veSao();
  veDayDien(36);
  // dãy nhà ống liền mạch — không khe hở (mọi nhà chạm chân y=160)
  veNhaPho(-6, 50, 52, 110, '#7A4A6A', '#5E3852', C.go2);
  veNhaPho(46, 42, 50, 118, '#4A5A8A', '#38466E', C.sat2);
  veNhaPho(96, 54, 48, 106, '#8A5A3A', '#6E4428', C.do2);
  veNhaPho(144, 46, 52, 114, '#5A5A7A', '#424260', C.go2); // nhà giữa — đỡ biển neon
  veNhaPho(196, 56, 48, 104, '#5A7A5A', '#446044', C.sat2);
  veNhaPho(244, 44, 42, 116, '#7A5A8A', '#5E426E', C.go2);
  veNhaPho(286, 52, 40, 108, '#6A4A5A', '#503844', C.do2);
  // biển neon phẳng GẮN LÊN TƯỜNG nhà (không lơ lửng)
  K(150, 66, 40, 12, C.hong, C.hong2);
  K(152, 82, 32, 9, C.vang, C.vang2);
  K(200, 72, 38, 12, '#48E0C0', '#28A888');
  K(14, 88, 26, 10, C.hong, C.hong2);
  K(292, 78, 24, 10, C.vang, C.vang2);
  // cửa sổ sáng ấm cho phố sống
  CTX.fillStyle = C.vang; CTX.fillRect(58, 70, 14, 10); CTX.fillRect(254, 66, 14, 10); CTX.fillRect(108, 84, 12, 10);
  CTX.fillStyle = C.vang2; CTX.fillRect(64, 70, 2, 10); CTX.fillRect(260, 66, 2, 10); CTX.fillRect(113, 84, 2, 10);
  // mặt đường + vỉa hè — đường nền thống nhất y=196 (vỉa hè), lòng đường dưới
  CTX.fillStyle = '#3A3A48'; CTX.fillRect(0, 160, 320, 80);
  CTX.fillStyle = '#2C2C38'; CTX.fillRect(0, 160, 320, 3);
  CTX.fillStyle = '#52525E'; CTX.fillRect(0, 178, 320, 20); // vỉa hè rộng
  CTX.fillStyle = '#464652'; CTX.fillRect(0, 196, 320, 2); // bó vỉa
  CTX.fillStyle = C.vang2; for (let i = 0; i < 8; i++) CTX.fillRect(8 + i * 42, 224, 20, 3); // vạch đường
  // quán vỉa hè trên vỉa hè (y 178-198): bàn CÓ CHÂN + ghế nhựa
  K(30, 172, 40, 5, C.go, C.go3);
  CTX.fillStyle = C.go2; CTX.fillRect(34, 177, 4, 16); CTX.fillRect(62, 177, 4, 16); // chân bàn
  veNhuaGhe(14, 184, C.do, C.do2); veNhuaGhe(76, 184, C.xanhDuong, '#28508E');
  K(36, 166, 8, 6, C.trang, C.xam); // ly trên bàn
  CTX.fillStyle = C.vang; CTX.fillRect(37, 167, 6, 4);
  K(96, 170, 16, 14, C.vang2, C.go3); // thùng bia
  CTX.fillStyle = C.do; CTX.fillRect(98, 173, 12, 3);
  K(226, 172, 40, 5, C.go, C.go3); // bàn 2 + chân
  CTX.fillStyle = C.go2; CTX.fillRect(230, 177, 4, 16); CTX.fillRect(258, 177, 4, 16);
  veNhuaGhe(210, 184, C.do, C.do2); veNhuaGhe(272, 184, C.do, C.do2);
  K(240, 166, 8, 6, C.trang, C.xam); CTX.fillStyle = C.vang; CTX.fillRect(241, 167, 6, 4);
  // xe máy dựng mép vỉa hè — cùng đường nền y=196
  veXeMay(120, 180, C.trang2);
  veXeMay(280, 180, C.do);
  // mèo trên vỉa hè phải
  veMeoFlat(188, 190);
};
SG.bia_hoi = function () { // quán nhậu SG: quầy lẩu chạm sàn, bàn inox có chân, ghế nhựa
  veTuongPhang(0, 0, 320, 142, C.olTuong, C.olTuong2);
  veSanGach(142, '#B0A898', '#968E7E');
  K(100, 12, 120, 26, C.do, C.do2); // biển hiệu
  CTX.fillStyle = C.vang; CTX.fillRect(110, 20, 100, 10);
  CTX.fillStyle = C.do2; CTX.fillRect(140, 22, 40, 6); // vạch trang trí biển
  // QUẦY chạm sàn: thân quầy từ y=60 xuống 150, nồi lẩu TRÊN MẶT quầy
  K(20, 78, 64, 66, C.sat, C.sat2); // thân quầy inox
  CTX.fillStyle = C.xam2; CTX.fillRect(24, 90, 56, 3); CTX.fillRect(24, 118, 56, 3); // đường panel
  K(16, 70, 72, 10, C.xam, C.xam2); // mặt quầy
  CTX.fillStyle = C.den2; CTX.fillRect(20, 144, 64, 3); // bóng chân quầy
  K(34, 50, 26, 18, C.xam, C.xam2); // nồi lẩu ngồi trên mặt quầy
  CTX.fillStyle = C.trang; CTX.fillRect(36, 52, 22, 4); // nắp hé
  CTX.fillStyle = C.do; CTX.fillRect(44, 46, 8, 4); // núm nắp
  CTX.fillStyle = C.trang2; CTX.fillRect(38, 40, 3, 6); CTX.fillRect(46, 36, 3, 8); CTX.fillRect(54, 40, 3, 6); // hơi nước
  // kệ chai sau quầy
  K(90, 60, 44, 6, C.go, C.go3); K(90, 92, 44, 6, C.go, C.go3);
  CTX.fillStyle = C.go2; CTX.fillRect(94, 66, 3, 26); CTX.fillRect(128, 66, 3, 26); // cột đỡ
  const chaiMau = [C.xanhLa, C.do, C.vang2, C.xanhDuong, C.hong2, C.xanhLa];
  for (let i = 0; i < 6; i++) { K(94 + i * 7, 52, 4, 8, chaiMau[i], C.den2); K(94 + i * 7, 84, 4, 8, chaiMau[5 - i], C.den2); }
  // 3 BÀN INOX CÓ CHÂN trên sàn
  for (let i = 0; i < 3; i++) {
    const bx = 146 + i * 58;
    K(bx, 152, 46, 6, C.sat, C.sat2); // mặt bàn
    CTX.fillStyle = C.xam2; CTX.fillRect(bx + 5, 158, 4, 22); CTX.fillRect(bx + 37, 158, 4, 22); // CHÂN bàn
    CTX.fillStyle = C.den2; CTX.fillRect(bx + 2, 180, 42, 3); // bóng tiếp xúc
    K(bx + 8, 142, 8, 10, C.kinh, C.xam); // ly bia
    CTX.fillStyle = C.vang; CTX.fillRect(bx + 9, 145, 6, 6);
    CTX.fillStyle = C.trang; CTX.fillRect(bx + 9, 143, 6, 2); // bọt
    K(bx + 24, 146, 12, 6, C.trang, C.xam); // đĩa mồi
    CTX.fillStyle = C.cam; CTX.fillRect(bx + 26, 144, 4, 3); CTX.fillStyle = C.xanhLa; CTX.fillRect(bx + 31, 144, 3, 2);
    veNhuaGhe(bx - 12, 170, C.do, C.do2); veNhuaGhe(bx + 44, 170, C.do, C.do2); // ghế 2 bên
  }
  K(288, 90, 26, 54, C.go, C.go3); // tủ ly gỗ góc — CAO hơn, có nóc
  CTX.fillStyle = C.go2; CTX.fillRect(288, 88, 26, 4); // nóc tủ
  CTX.fillStyle = C.kinh2; CTX.fillRect(292, 98, 18, 22); CTX.fillRect(292, 124, 18, 14); // 2 khoang kính
  CTX.fillStyle = C.trang2; CTX.fillRect(294, 102, 4, 6); CTX.fillRect(300, 102, 4, 6); CTX.fillRect(306, 102, 4, 6); // ly úp tầng 1
  CTX.fillStyle = C.vang; CTX.fillRect(294, 128, 4, 6); CTX.fillRect(300, 128, 4, 6); // chai tầng 2
  CTX.fillStyle = C.vang2; CTX.fillRect(300, 120, 3, 2); // tay nắm
  CTX.fillStyle = C.den2; CTX.fillRect(288, 144, 26, 3); // bóng tủ
  CTX.fillStyle = C.den; CTX.fillRect(0, 140, 320, 2);
};
function veMeoFlat(x, y) { // mèo phẳng 10x7
  K(x, y, 8, 5, '#2A2233'); K(x + 1, y - 3, 3, 3, '#2A2233'); K(x + 5, y - 3, 3, 3, '#2A2233');
  CTX.fillStyle = C.vang; CTX.fillRect(x + 2, y - 2, 1, 1); CTX.fillRect(x + 6, y - 2, 1, 1);
  CTX.fillStyle = '#2A2233'; CTX.fillRect(x + 8, y + 1, 4, 1); CTX.fillRect(x + 11, y, 1, 2);
}

// ============ HÀ NỘI ============
const HN = {};
HN.phong_tro = function () { // phòng trọ phố cổ: tường vàng, cửa chớp gỗ, gạch hoa
  veTuongPhang(0, 0, 320, 142, C.vNha, C.vNha2);
  veSanGach(142, '#C8A878', '#AE9060'); // gạch hoa cũ
  CTX.fillStyle = C.do2;
  for (let xx = 16; xx < 320; xx += 64) for (let yy = 158; yy < 240; yy += 32) CTX.fillRect(xx + 6, yy + 6, 4, 4);
  veCuaGo(240, 30, 60, 70, '#2E5E4A'); // cửa chớp xanh kiểu HN
  CTX.fillStyle = C.go3; for (let yy = 36; yy < 94; yy += 6) CTX.fillRect(246, yy, 48, 2);
  // CỬA RA VÀO bên phải — phòng trọ phải có lối thoát
  K(296, 66, 22, 76, C.go2, C.den);
  CTX.fillStyle = C.go3; CTX.fillRect(300, 70, 14, 68);
  CTX.fillStyle = C.vang2; CTX.fillRect(302, 104, 3, 4); // tay nắm
  K(20, 26, 50, 38, C.kinh, C.go3); // cửa sổ gỗ
  CTX.fillStyle = C.go2; CTX.fillRect(44, 28, 3, 34); CTX.fillRect(22, 44, 46, 3);
  // lịch bloc đầu đỏ — có gáy + lò xo + dòng kẻ
  K(96, 20, 30, 40, C.trang, C.xam2);
  CTX.fillStyle = C.do; CTX.fillRect(97, 21, 28, 8); // đầu đỏ
  CTX.fillStyle = C.den2; CTX.fillRect(100, 17, 3, 5); CTX.fillRect(118, 17, 3, 5); // móc treo
  CTX.fillStyle = C.xam; for (let i = 0; i < 4; i++) CTX.fillRect(100, 34 + i * 6, 22, 1);
  CTX.fillStyle = C.den2; CTX.fillRect(104, 36, 12, 4); // số ngày
  K(150, 30, 44, 30, C.go2, C.den); // ảnh Bác-style khung (trơn)
  CTX.fillStyle = C.vang2; CTX.fillRect(156, 36, 32, 18);
  // GIƯỜNG chạm sàn: chân giường + bóng tiếp xúc, đệm thấp ngang gối người
  K(20, 110, 84, 26, C.go, C.go3); // thân giường
  CTX.fillStyle = C.go2; CTX.fillRect(22, 136, 6, 8); CTX.fillRect(96, 136, 6, 8); // CHÂN giường
  CTX.fillStyle = C.den2; CTX.fillRect(20, 144, 84, 3); // bóng tiếp xúc
  K(24, 104, 76, 12, C.trang, C.trang2); // đệm trắng NỔI LÊN thân giường
  CTX.fillStyle = C.do; CTX.fillRect(26, 100, 20, 10); // gối đỏ trên đệm
  CTX.fillStyle = C.do2; CTX.fillRect(26, 108, 20, 2);
  // bàn thấp + ấm chén RÕ (ấm có vòi + quai)
  K(130, 126, 56, 10, C.go, C.go3);
  CTX.fillStyle = C.go2; CTX.fillRect(134, 136, 5, 10); CTX.fillRect(176, 136, 5, 10); // chân bàn
  CTX.fillStyle = C.den2; CTX.fillRect(130, 146, 56, 2); // bóng
  K(142, 114, 12, 10, C.trang, C.xam); // ấm trà
  CTX.fillStyle = C.xam; CTX.fillRect(154, 116, 5, 2); // vòi
  CTX.fillStyle = C.do; CTX.fillRect(145, 111, 6, 3); // nắp + núm đỏ
  K(162, 118, 6, 7, C.trang, C.xam); K(170, 118, 6, 7, C.trang, C.xam); // 2 chén
  veQuatTreo(210, 0);
  // TV đặt TRÊN KỆ GỖ chạm sàn
  K(228, 120, 56, 24, C.go, C.go3); // kệ
  CTX.fillStyle = C.go2; CTX.fillRect(232, 144, 5, 6); CTX.fillRect(274, 144, 5, 6); // chân kệ
  CTX.fillStyle = C.den2; CTX.fillRect(228, 150, 56, 3); // bóng kệ
  veTV(244, 98); // TV trên kệ: chân đế 120 = mặt kệ
  CTX.fillStyle = C.den; CTX.fillRect(0, 140, 320, 2); // chân tường
};
HN.quan_pho = function () { // quán phở gánh: nồi hơi nghi ngút, bát sứ, bàn gỗ
  veTuongPhang(0, 0, 320, 130, C.vNha, C.vNha2);
  veSanGach(130, '#B8A488', '#9E8A6E');
  K(90, 8, 140, 26, C.do2, C.den); // biển hiệu đỏ gold viền
  CTX.fillStyle = C.vang; CTX.fillRect(100, 16, 120, 10);
  CTX.fillStyle = C.do; CTX.fillRect(140, 18, 40, 6); // vạch trang trí
  // quầy phở CHẠM SÀN: thân xuống y=130 + chân + bóng
  K(200, 70, 100, 54, C.go, C.go3);
  CTX.fillStyle = C.go2; CTX.fillRect(204, 80, 92, 3); CTX.fillRect(204, 100, 92, 3); // panel ngang
  K(196, 64, 108, 8, C.go2, C.den); // mặt quầy nhô
  CTX.fillStyle = C.den2; CTX.fillRect(200, 124, 100, 4); // bóng chân quầy
  K(214, 34, 40, 30, C.sat, C.xam2); // nồi nước dùng trên mặt quầy
  CTX.fillStyle = C.trang; CTX.fillRect(218, 38, 32, 4); // nắp
  CTX.fillStyle = C.do; CTX.fillRect(232, 30, 10, 4); // núm nắp
  CTX.fillStyle = C.trang2; // hơi nước — 3 cụm so le bốc cao
  CTX.fillRect(220, 22, 3, 8); CTX.fillRect(228, 16, 3, 12); CTX.fillRect(236, 22, 3, 8);
  CTX.fillStyle = C.trang; CTX.fillRect(230, 10, 3, 6); CTX.fillRect(242, 14, 2, 6); CTX.fillRect(216, 16, 2, 5);
  K(264, 52, 8, 7, C.trang); K(274, 52, 8, 7, C.trang); K(264, 60, 8, 7, C.trang); K(274, 60, 8, 7, C.trang); // chồng bát
  CTX.fillStyle = C.xanhDuong; CTX.fillRect(265, 54, 6, 1); CTX.fillRect(275, 54, 6, 1); // họa tiết bát
  K(204, 82, 20, 10, C.cam, C.go3); // rổ bánh phở
  CTX.fillStyle = C.trang; CTX.fillRect(206, 84, 16, 3);
  // bàn gỗ + GHẾ BĂNG CÓ CHÂN
  K(40, 148, 70, 7, C.go, C.go3);
  CTX.fillStyle = C.go2; CTX.fillRect(46, 155, 6, 18); CTX.fillRect(98, 155, 6, 18); // chân bàn
  CTX.fillStyle = C.den2; CTX.fillRect(38, 173, 74, 3); // bóng bàn
  K(30, 158, 40, 5, C.go2, C.go3); // ghế băng
  CTX.fillStyle = C.go3; CTX.fillRect(34, 163, 4, 10); CTX.fillRect(62, 163, 4, 10); // CHÂN ghế
  K(52, 138, 10, 8, C.trang, C.xam); // bát phở
  CTX.fillStyle = C.xanhLa; CTX.fillRect(54, 136, 3, 2); CTX.fillRect(58, 137, 2, 2); // hành
  K(66, 134, 5, 12, C.xanhNc, C.den2); // ống đũa xanh cao
  CTX.fillStyle = C.go2; CTX.fillRect(67, 130, 1, 5); CTX.fillRect(69, 129, 1, 6); // đũa thò ra
  K(130, 152, 70, 7, C.go, C.go3); // bàn 2
  CTX.fillStyle = C.go2; CTX.fillRect(136, 159, 6, 16); CTX.fillRect(188, 159, 6, 16);
  CTX.fillStyle = C.den2; CTX.fillRect(128, 175, 74, 3); // bóng
  K(150, 142, 10, 8, C.trang, C.xam); // bát phở 2 + hành
  CTX.fillStyle = C.xanhLa; CTX.fillRect(152, 140, 3, 2); CTX.fillRect(156, 141, 2, 2);
  K(118, 160, 40, 5, C.go2, C.go3); // ghế băng bàn 2
  CTX.fillStyle = C.go3; CTX.fillRect(122, 165, 4, 10); CTX.fillRect(150, 165, 4, 10);
  veDenLong(70, 44); veDenLong(250, 40);
  CTX.fillStyle = C.den; CTX.fillRect(0, 128, 320, 2);
};
HN.van_phong = function () { // VP nhà nước cũ: tường vàng, quạt trần, bàn gỗ
  veTuongPhang(0, 0, 320, 142, C.vNha, C.vNha2);
  veSanGach(142, '#C0B090', '#A69676');
  K(230, 24, 60, 50, C.kinh, C.go3); // cửa sổ gỗ kính
  CTX.fillStyle = C.go2; CTX.fillRect(258, 26, 4, 46); CTX.fillRect(232, 48, 56, 4);
  CTX.fillStyle = C.kinh2; CTX.fillRect(234, 52, 22, 18); CTX.fillRect(264, 52, 22, 18);
  K(20, 30, 46, 34, C.trang, C.xam2); // bảng tin
  CTX.fillStyle = C.do; CTX.fillRect(26, 36, 14, 8); CTX.fillRect(44, 36, 14, 8);
  CTX.fillStyle = C.xam; CTX.fillRect(26, 48, 32, 2); CTX.fillRect(26, 53, 26, 2);
  for (let i = 0; i < 2; i++) { // 2 bàn gỗ to
    const bx = 30 + i * 150;
    K(bx, 118, 120, 8, C.go, C.go3);
    CTX.fillStyle = C.go2; CTX.fillRect(bx + 8, 126, 8, 22); CTX.fillRect(bx + 104, 126, 8, 22);
    K(bx + 30, 94, 30, 20, '#C8C0A8', C.xam2); // monitor CRT be
    CTX.fillStyle = '#3A4A3A'; CTX.fillRect(bx + 34, 98, 22, 12);
    K(bx + 70, 108, 16, 8, C.go2, C.den); // cặp tài liệu
    K(bx + 94, 110, 6, 7, C.trang, C.xam); // cốc trà
  }
  veQuatTreo(160, 0);
  K(8, 100, 10, 42, C.xanhLa, C.go3); CTX.fillStyle = C.xanhLa2; CTX.fillRect(4, 86, 18, 14);
  CTX.fillStyle = C.den; CTX.fillRect(0, 140, 320, 2);
};
HN.pho_dem = function () { // phố cổ đêm: nhà vàng cửa gỗ, lồng đèn đỏ, xích lô
  CTX.fillStyle = C.troi; CTX.fillRect(0, 0, 320, 150);
  veSao();
  veDayDien(28);
  // dãy phố cổ nhà vàng thấp tầng
  veNhaPho(-8, 60, 60, 100, C.vNha, C.vNha2, '#2E5E4A');
  veNhaPho(56, 52, 54, 108, '#C8A848', '#A68A34', C.go2);
  veNhaPho(114, 64, 48, 96, C.vNha, C.vNha2, '#2E5E4A');
  veNhaPho(166, 56, 56, 104, '#B89838', '#967C28', C.do2);
  veNhaPho(226, 62, 46, 98, C.vNha, C.vNha2, '#2E5E4A');
  veNhaPho(276, 54, 52, 106, '#C8A848', '#A68A34', C.go2);
  veDenLong(48, 96); veDenLong(140, 92); veDenLong(252, 94);
  // 2 cửa sổ thắp đèn vàng ấm cho phố "sống"
  CTX.fillStyle = C.vang; CTX.fillRect(70, 70, 16, 10); CTX.fillRect(240, 76, 14, 10);
  CTX.fillStyle = C.vang2; CTX.fillRect(77, 70, 2, 10); CTX.fillRect(246, 76, 2, 10);
  // đường
  CTX.fillStyle = '#3E3A46'; CTX.fillRect(0, 150, 320, 90);
  CTX.fillStyle = '#2E2A36'; CTX.fillRect(0, 150, 320, 3);
  CTX.fillStyle = '#565060'; CTX.fillRect(0, 188, 320, 10);
  CTX.fillStyle = C.vang2; for (let i = 0; i < 8; i++) CTX.fillRect(10 + i * 42, 222, 18, 3);
  // xích lô parked — bánh TRƯỚC TO lộ rõ dưới khoang, người đạp nón lá đủ lớn
  const xx = 200, xy = 158; // xy = mặt đường chỗ bánh chạm
  // bánh trước TO (r=12) nằm NGAY DƯỚI KHOANG khách
  CTX.fillStyle = C.den; CTX.beginPath(); CTX.arc(xx + 12, xy + 4, 12, 0, 7); CTX.fill();
  CTX.fillStyle = C.xam; CTX.beginPath(); CTX.arc(xx + 12, xy + 4, 7, 0, 7); CTX.fill();
  CTX.fillStyle = C.den2; CTX.fillRect(xx + 11, xy - 3, 2, 14); CTX.fillRect(xx + 5, xy + 3, 14, 2); // nan hoa
  // khoang khách (lui về sau bánh trước)
  K(xx + 4, xy - 14, 22, 16, C.sat, C.sat2);
  CTX.fillStyle = C.do; CTX.fillRect(xx + 6, xy - 12, 18, 8); // đệm đỏ
  CTX.fillStyle = C.den; CTX.fillRect(xx + 4, xy - 20, 22, 6); // mui che
  // bánh sau NHỎ (r=7)
  CTX.fillStyle = C.den; CTX.beginPath(); CTX.arc(xx + 42, xy + 8, 7, 0, 7); CTX.fill();
  CTX.fillStyle = C.xam; CTX.beginPath(); CTX.arc(xx + 42, xy + 8, 3, 0, 7); CTX.fill();
  CTX.fillStyle = C.xam2; CTX.fillRect(xx + 26, xy + 2, 12, 2); // khung nối
  // người đạp LỚN RÕ: nón lá rộng + thân cúi + chân đạp tách màu
  CTX.fillStyle = C.vang2; CTX.fillRect(xx + 30, xy - 28, 14, 3); CTX.fillRect(xx + 33, xy - 31, 8, 3); // nón lá chóp rộng
  CTX.fillStyle = C.da; CTX.fillRect(xx + 35, xy - 25, 5, 4); // đầu
  K(xx + 33, xy - 21, 8, 12, C.xanhDuong); // thân áo xanh (khác màu bánh)
  CTX.fillStyle = C.kem || '#E8DCC0'; CTX.fillRect(xx + 34, xy - 19, 6, 3); // vạt áo sáng
  CTX.fillStyle = C.xam; CTX.fillRect(xx + 34, xy - 9, 3, 9); CTX.fillRect(xx + 38, xy - 9, 3, 7); // chân đạp XÁM tách khỏi bánh đen
  CTX.fillStyle = C.den2; CTX.fillRect(xx + 33, xy, 5, 3); CTX.fillRect(xx + 37, xy, 5, 3); // bàn chân + pedal
  CTX.fillStyle = C.xam; CTX.fillRect(xx + 30, xy - 16, 3, 2); // tay lái
  CTX.fillStyle = C.den2; CTX.fillRect(192, xy + 17, 58, 3); // bóng tiếp xúc
  // gánh hàng rong: đòn gánh NGANG qua vai, 2 thúng TREO bằng quang
  CTX.fillStyle = C.da; CTX.fillRect(64, 166, 5, 4); // đầu người bán
  CTX.fillStyle = C.vang2; CTX.fillRect(61, 163, 11, 3); CTX.fillRect(63, 161, 7, 2); // nón lá chóp
  K(63, 170, 7, 12, C.hong2); // thân áo bà ba
  CTX.fillStyle = C.go2; CTX.fillRect(42, 169, 50, 2); // ĐÒN GÁNH NGANG qua vai
  CTX.fillStyle = C.den2; CTX.fillRect(46, 171, 1, 8); CTX.fillRect(86, 171, 1, 8); // dây quang
  K(40, 179, 14, 10, C.go, C.go3); K(80, 179, 14, 10, C.go, C.go3); // 2 thúng TREO
  CTX.fillStyle = C.vang; CTX.fillRect(42, 177, 10, 3); CTX.fillRect(82, 177, 10, 3); // hàng
  CTX.fillStyle = C.den2; CTX.fillRect(64, 182, 3, 6); CTX.fillRect(68, 182, 3, 6); // chân ngồi xếp bằng
  veMeoFlat(280, 196);
};
HN.bia_hoi = function () { // bia hơi Tạ Hiện: cốc vại vàng, ghế nhựa xanh lè
  veTuongPhang(0, 0, 320, 142, C.vNha, C.vNha2);
  veSanGach(142, '#A8A090', '#8E8676');
  K(60, 8, 200, 24, C.xanhLa, C.xanhLa2); // biển xanh
  CTX.fillStyle = C.vang; CTX.fillRect(70, 14, 180, 12);
  // QUẦY chạm sàn (y 70→152): thân inox + mặt quầy + vòi rót từ bom bia xuống cốc
  K(16, 70, 78, 82, C.sat, C.sat2);
  CTX.fillStyle = C.xam2; CTX.fillRect(20, 90, 70, 3); CTX.fillRect(20, 118, 70, 3); // panel
  K(12, 64, 86, 8, C.xam, C.xam2); // mặt quầy nhô
  CTX.fillStyle = C.den2; CTX.fillRect(16, 150, 78, 4); // bóng chân quầy
  K(30, 40, 16, 24, C.vang, C.vang2); // BOM BIA đứng trên mặt quầy
  CTX.fillStyle = C.trang; CTX.fillRect(30, 40, 16, 4); // nắp
  CTX.fillStyle = C.xam2; CTX.fillRect(46, 50, 10, 2); // cần vòi ngang
  CTX.fillRect(54, 50, 2, 8); // vòi chúc xuống
  CTX.fillStyle = C.vang; CTX.fillRect(54, 58, 2, 4); // tia bia rót
  K(48, 58, 10, 8, C.kinh, C.xam); // cốc vại đang hứng
  CTX.fillStyle = C.trang; CTX.fillRect(49, 59, 8, 2); // bọt tràn
  for (let i = 0; i < 3; i++) { // bàn bia hơi
    const bx = 110 + i * 66;
    K(bx, 138, 44, 6, C.go, C.go3);
    CTX.fillStyle = C.go2; CTX.fillRect(bx + 5, 144, 5, 18); CTX.fillRect(bx + 34, 144, 5, 18);
    CTX.fillStyle = C.den2; CTX.fillRect(bx + 1, 162, 42, 3); // bóng bàn
    for (let j = 0; j < 2; j++) { // cốc vại
      K(bx + 8 + j * 18, 126, 9, 11, C.kinh, C.xam);
      CTX.fillStyle = C.vang; CTX.fillRect(bx + 9 + j * 18, 129, 7, 7);
      CTX.fillStyle = C.trang; CTX.fillRect(bx + 9 + j * 18, 127, 7, 3); // bọt
    }
    veNhuaGhe(bx - 12, 156, C.xanhLa, C.xanhLa2); veNhuaGhe(bx + 40, 156, C.xanhLa, C.xanhLa2);
  }
  K(286, 90, 26, 62, C.go, C.go3); // thùng bom bia chạm sàn
  CTX.fillStyle = C.sat2; CTX.fillRect(290, 94, 18, 6);
  CTX.fillStyle = C.den2; CTX.fillRect(286, 150, 26, 4); // bóng
  CTX.fillStyle = C.den; CTX.fillRect(0, 140, 320, 2);
};

// ============ ĐÀ NẴNG ============
const DN = {};
DN.phong_tro = function () { // phòng trọ gần biển: tường sáng, cửa sổ dừa, võng
  veTuongPhang(0, 0, 320, 142, '#DCE4DC', '#BCC8BC');
  veSanGach(142, '#D0C0A0', '#B6A686');
  K(220, 24, 70, 48, C.kinh, C.go3); // cửa sổ lớn nhìn ra biển
  CTX.fillStyle = C.bien; CTX.fillRect(224, 44, 62, 24); // biển
  CTX.fillStyle = C.bien2; CTX.fillRect(224, 50, 62, 3); CTX.fillRect(224, 60, 62, 2);
  CTX.fillStyle = '#88C8E8'; CTX.fillRect(224, 28, 62, 16); // trời
  CTX.fillStyle = C.la; CTX.fillRect(270, 30, 3, 14); CTX.fillRect(264, 32, 8, 3); CTX.fillRect(272, 30, 8, 3); // dừa xa
  CTX.fillStyle = C.go2; CTX.fillRect(254, 26, 3, 44); // đố cửa
  K(16, 100, 84, 42, C.go, C.go3); // giường
  K(20, 104, 76, 16, C.trang, C.trang2); CTX.fillStyle = C.xanhNc; CTX.fillRect(20, 104, 16, 16);
  // võng mắc giữa 2 CỘT GỖ cắm sàn (có đế + dây neo)
  CTX.fillStyle = C.den2; CTX.fillRect(116, 150, 4, 3); CTX.fillRect(196, 150, 4, 3); // bóng cột
  K(114, 84, 6, 68, C.go, C.go3); // cột trái từ sàn y=152 lên
  K(196, 84, 6, 68, C.go, C.go3); // cột phải
  CTX.fillStyle = C.go2; CTX.fillRect(112, 148, 10, 4); CTX.fillRect(194, 148, 10, 4); // đế cột
  CTX.fillStyle = C.den2; CTX.fillRect(120, 90, 8, 1); CTX.fillRect(188, 90, 8, 1); // dây neo
  CTX.fillStyle = C.hong2;
  for (let i = 0; i < 20; i++) { const v = Math.sin(i * 0.32) * 8; CTX.fillRect(126 + i * 3, 92 + v, 3, 3); } // lưới võng
  CTX.fillStyle = C.hong; CTX.fillRect(140, 100, 24, 4); // thân võng dày hơn ở đáy
  K(220, 120, 60, 12, C.go, C.go3); // bàn
  CTX.fillStyle = C.go2; CTX.fillRect(226, 132, 5, 14); CTX.fillRect(268, 132, 5, 14);
  K(236, 108, 12, 10, C.kinh, C.xam); // ly nước
  veTV(20, 40); K(16, 56, 32, 8, C.go, C.go3);
  veQuatTreo(160, 0);
  CTX.fillStyle = C.den; CTX.fillRect(0, 140, 320, 2);
};
DN.quan_pho = function () { // quán mì Quảng: tô vàng nghệ, bánh tráng, bàn thấp
  veTuongPhang(0, 0, 320, 130, '#E0D0A8', '#C4B48C');
  veSanGach(130, '#C8B898', '#AE9E7E');
  K(100, 8, 120, 26, C.cam, C.cam2); // biển cam
  CTX.fillStyle = C.trang; CTX.fillRect(110, 16, 100, 10);
  K(210, 66, 90, 64, C.go, C.go3); // quầy CHẠM SÀN (y 66→130)
  CTX.fillStyle = C.go2; CTX.fillRect(214, 84, 82, 3); CTX.fillRect(214, 108, 82, 3); // panel
  K(206, 60, 98, 8, C.go2, C.den); // mặt quầy nhô
  CTX.fillStyle = C.den2; CTX.fillRect(210, 128, 90, 4); // bóng chân quầy
  K(226, 42, 30, 18, C.sat, C.xam2); // nồi nước lèo trên mặt quầy
  CTX.fillStyle = C.cam; CTX.fillRect(230, 46, 22, 4); // nước nghệ
  CTX.fillStyle = C.trang2; CTX.fillRect(234, 32, 3, 8); CTX.fillRect(242, 28, 3, 10); // hơi
  K(268, 48, 14, 12, C.trang, C.xam); // chồng bánh tráng
  CTX.fillStyle = C.vang2; CTX.fillRect(270, 50, 10, 2); CTX.fillRect(270, 54, 10, 2);
  CTX.fillStyle = C.den2; CTX.fillRect(270, 44, 10, 3); // khăn phủ chồng bánh
  for (let i = 0; i < 2; i++) { // bàn thấp + tô mì
    const bx = 30 + i * 120;
    K(bx, 150, 64, 7, C.go, C.go3);
    CTX.fillStyle = C.go2; CTX.fillRect(bx + 6, 157, 6, 16); CTX.fillRect(bx + 52, 157, 6, 16);
    CTX.fillStyle = C.den2; CTX.fillRect(bx - 2, 173, 68, 3); // bóng tiếp xúc
    K(bx + 14, 138, 14, 10, C.trang, C.xam); // tô mì Quảng
    CTX.fillStyle = C.vang; CTX.fillRect(bx + 16, 140, 10, 4); // nước nghệ
    CTX.fillStyle = C.xanhLa; CTX.fillRect(bx + 17, 138, 4, 2); CTX.fillRect(bx + 22, 139, 3, 2);
    CTX.fillStyle = C.do; CTX.fillRect(bx + 20, 136, 2, 2); // ớt
    K(bx + 38, 140, 10, 8, C.kinh, C.xam); // ly
    veNhuaGhe(bx - 14, 162, C.xanhDuong, '#28508E'); veNhuaGhe(bx + 62, 162, C.xanhDuong, '#28508E');
  }
  veCay(300, 240, 'dua'); // dừa trong sân
  CTX.fillStyle = C.den; CTX.fillRect(0, 128, 320, 2);
};
DN.van_phong = function () { // VP hiện đại view biển
  veTuongPhang(0, 0, 320, 142, '#E0E4E8', '#C0C6CC');
  veSanGach(142, '#C8CCD2', '#AEB4BC');
  K(20, 16, 280, 60, C.kinh, C.sat2); // vách kính panorama biển
  CTX.fillStyle = '#88C8E8'; CTX.fillRect(24, 20, 272, 26); // trời
  CTX.fillStyle = C.bien; CTX.fillRect(24, 46, 272, 16); // biển
  CTX.fillStyle = C.bot; CTX.fillRect(40, 50, 30, 2); CTX.fillRect(150, 54, 40, 2); CTX.fillRect(230, 50, 26, 2);
  CTX.fillStyle = C.cat; CTX.fillRect(24, 62, 272, 6); // bãi cát xa
  CTX.fillStyle = C.sat2; CTX.fillRect(120, 18, 4, 56); CTX.fillRect(216, 18, 4, 56); // đố kính
  for (let i = 0; i < 2; i++) {
    const bx = 40 + i * 160;
    K(bx, 122, 120, 8, C.trang, C.xam2);
    CTX.fillStyle = C.xam2; CTX.fillRect(bx + 10, 130, 6, 20); CTX.fillRect(bx + 104, 130, 6, 20);
    K(bx + 40, 100, 36, 20, C.den2);
    CTX.fillStyle = '#3A5A6A'; CTX.fillRect(bx + 43, 103, 30, 13);
    CTX.fillStyle = C.vang; CTX.fillRect(bx + 47, 106, 16, 2); CTX.fillRect(bx + 47, 110, 22, 2);
    K(bx + 12, 114, 8, 8, C.kinh, C.xam); // cốc
  }
  K(10, 108, 14, 34, C.xanhLa, C.go3); // thân cây trong chậu
  CTX.fillStyle = C.xanhLa2; CTX.fillRect(4, 90, 26, 20); // tán
  K(8, 130, 18, 14, C.cam2, C.go3); // CHẬU chạm sàn
  CTX.fillStyle = C.den2; CTX.fillRect(8, 142, 18, 3); // bóng chậu
  CTX.fillStyle = C.den; CTX.fillRect(0, 140, 320, 2);
};
DN.pho_dem = function () { // đường biển đêm: cầu Rồng xa, dừa, thuyền thúng
  CTX.fillStyle = C.troiDem; CTX.fillRect(0, 0, 320, 150);
  veSao();
  // cầu Rồng silhouette bên phải — deck dài nối bờ + vòm + trụ cắm nước + đầu rồng
  CTX.fillStyle = '#3A3450';
  CTX.fillRect(170, 118, 150, 6); // mặt cầu dài tới mép phải
  for (let i = 0; i < 3; i++) { // 3 vòm
    const ax = 196 + i * 40;
    CTX.fillRect(ax, 96, 6, 22);
    CTX.fillRect(ax - 8, 102, 22, 5);
    CTX.fillRect(ax - 14, 108, 34, 4);
  }
  // trụ cầu cắm xuống nước
  CTX.fillRect(178, 118, 8, 30); CTX.fillRect(238, 118, 8, 26); CTX.fillRect(298, 118, 8, 22);
  CTX.fillStyle = '#2A2440';
  CTX.fillRect(176, 146, 12, 4); CTX.fillRect(236, 142, 12, 4); // chân trụ loe
  // đầu rồng bên trái cầu (mỏ há + mào)
  CTX.fillStyle = '#4A4266';
  CTX.fillRect(158, 104, 14, 10); // đầu
  CTX.fillRect(150, 106, 10, 5); // mõm
  CTX.fillStyle = C.hong; CTX.fillRect(152, 110, 6, 2); // lửa phun khe miệng
  CTX.fillStyle = C.vang; CTX.fillRect(162, 107, 2, 2); // mắt rồng
  CTX.fillStyle = '#4A4266';
  CTX.fillRect(164, 96, 4, 8); CTX.fillRect(170, 92, 4, 12); // mào
  CTX.fillStyle = C.vang; for (let i = 0; i < 13; i++) CTX.fillRect(174 + i * 11, 114, 3, 3); // đèn cầu
  CTX.fillStyle = C.hong; CTX.fillRect(192, 90, 4, 4); CTX.fillRect(232, 90, 4, 4); CTX.fillRect(272, 90, 4, 4); // đèn đỉnh vòm
  // phản chiếu đèn cầu trên biển (pixel phẳng, không gradient)
  CTX.fillStyle = '#3E4A68';
  CTX.fillRect(60, 128, 24, 2); CTX.fillRect(120, 134, 30, 2); CTX.fillRect(30, 140, 20, 2); CTX.fillRect(140, 144, 24, 2);
  // biển trái
  CTX.fillStyle = '#1E2E4A'; CTX.fillRect(0, 124, 180, 26);
  CTX.fillStyle = '#2E4260'; CTX.fillRect(10, 130, 40, 2); CTX.fillRect(70, 136, 50, 2); CTX.fillRect(30, 142, 30, 2);
  // thuyền thúng TRÒN trên biển
  CTX.fillStyle = C.den; CTX.beginPath(); CTX.arc(108, 132, 13, Math.PI, 0); CTX.fill();
  CTX.fillStyle = C.go; CTX.beginPath(); CTX.arc(108, 132, 11, Math.PI, 0); CTX.fill();
  CTX.fillStyle = C.go2; CTX.fillRect(97, 130, 22, 3);
  CTX.fillStyle = C.den2; CTX.fillRect(105, 124, 3, 7); CTX.fillRect(103, 122, 7, 2); // người chèo silhouette
  CTX.fillStyle = C.go2; CTX.fillRect(100, 118, 2, 12); CTX.fillRect(98, 116, 6, 2); // MÁI CHÈO chéo
  CTX.fillStyle = C.bot; CTX.fillRect(94, 136, 28, 2); // bóng nước dưới thúng
  // đường ven biển + cát
  CTX.fillStyle = C.cat2; CTX.fillRect(0, 150, 320, 14);
  CTX.fillStyle = '#3E3A48'; CTX.fillRect(0, 164, 320, 76);
  CTX.fillStyle = '#2E2A38'; CTX.fillRect(0, 164, 320, 3);
  CTX.fillStyle = C.vang2; for (let i = 0; i < 7; i++) CTX.fillRect(14 + i * 46, 214, 22, 3);
  // dừa 2 bên — gốc dừng tại dải cát (y=168)
  veCay(40, 168, 'dua'); veCay(300, 170, 'dua');
  // quán hải sản vỉa hè trên DẢI CÁT (y 150-164): vỉ nướng + khói dịch PHẢI tránh đầu rồng
  K(150, 148, 44, 6, C.sat, C.sat2);
  CTX.fillStyle = C.xam2; CTX.fillRect(154, 154, 4, 8); CTX.fillRect(186, 154, 4, 8);
  K(156, 142, 14, 6, C.cam, C.do2); // mực nướng
  K(174, 142, 12, 6, C.do, C.do2); // tôm
  CTX.fillStyle = C.xam; // khói nướng — dịch phải, thấp hơn đầu rồng
  CTX.fillRect(168, 132, 4, 8); CTX.fillRect(174, 126, 4, 10); CTX.fillRect(182, 132, 4, 8);
  CTX.fillStyle = C.xam2; CTX.fillRect(176, 120, 3, 5); CTX.fillRect(184, 124, 3, 5);
  veNhuaGhe(128, 150, C.xanhDuong, '#28508E'); veNhuaGhe(200, 150, C.do, C.do2);
  // đèn đường bên TRÁI (tránh đè trụ cầu)
  K(60, 128, 4, 52, C.xam2); K(52, 124, 20, 6, C.vang, C.vang2);
};
DN.bia_hoi = function () { // quán hải sản ven biển: bàn ốc, bia, dừa
  veTuongPhang(0, 0, 320, 142, '#D8E0DC', '#B8C4BC');
  veSanGach(142, '#C8BC9C', '#AEA284');
  K(80, 10, 160, 24, C.xanhNc, '#22486E'); // biển xanh biển cả
  CTX.fillStyle = C.vang; CTX.fillRect(90, 16, 140, 12);
  K(20, 78, 64, 64, C.sat, C.sat2); // quầy CHẠM SÀN (78→142)
  CTX.fillStyle = C.xam2; CTX.fillRect(24, 98, 56, 3); CTX.fillRect(24, 120, 56, 3); // panel
  K(16, 72, 72, 8, C.xam, C.xam2); // mặt quầy nhô
  CTX.fillStyle = C.den2; CTX.fillRect(20, 140, 64, 4); // bóng chân quầy
  K(30, 56, 20, 16, C.xam, C.xam2); // khay đá trên mặt quầy
  CTX.fillStyle = C.bot; CTX.fillRect(32, 58, 16, 4);
  K(56, 60, 8, 8, C.do, C.do2); // tôm
  CTX.fillStyle = C.trang; CTX.fillRect(58, 62, 4, 2);
  CTX.fillStyle = C.xanhNc; CTX.fillRect(30, 84, 20, 8); // ô kính trưng bày ốc
  CTX.fillStyle = C.xam2; CTX.fillRect(34, 86, 3, 3); CTX.fillRect(40, 87, 3, 3); // ốc
  for (let i = 0; i < 3; i++) { // bàn
    const bx = 100 + i * 70;
    K(bx, 142, 48, 6, C.go, C.go3);
    CTX.fillStyle = C.go2; CTX.fillRect(bx + 6, 148, 5, 18); CTX.fillRect(bx + 38, 148, 5, 18);
    K(bx + 8, 132, 9, 10, C.kinh, C.xam); // ly bia
    CTX.fillStyle = C.vang; CTX.fillRect(bx + 9, 135, 7, 6);
    K(bx + 24, 134, 14, 7, C.trang, C.xam); // đĩa ốc
    CTX.fillStyle = C.xam2; CTX.fillRect(bx + 27, 132, 3, 2); CTX.fillRect(bx + 32, 132, 3, 2);
    veNhuaGhe(bx - 12, 158, C.xanhLa, C.xanhLa2); veNhuaGhe(bx + 44, 158, C.do, C.do2);
  }
  veCay(296, 240, 'dua');
  CTX.fillStyle = C.den; CTX.fillRect(0, 140, 320, 2);
};

// ===== ĐĂNG KÝ =====
window.CANH = { saigon: SG, hanoi: HN, danang: DN };
