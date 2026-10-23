// ===== PHÒNG TRỌ CHUẨN "CRUMMY APARTMENT" (video mẫu IMG_9413) =====
// Copy KHẮT từng món từ frame 9/18/24/27/30/33 của 9 To Life:
// - tường olive #8A9A50 loang vết bẩn #6E7A38 (đốm hình thoi không đều)
// - sàn gỗ ván ngang #8B5E3C / #6E4A28, chỉ ngang + mạch dọc
// - cửa sổ khung nâu 4 ô + rèm tím lavender sọc dọc + bệ cửa
// - lịch giấy trắng đầu đỏ + móc treo
// - poster tím than mặt trời cam + tia + 2 vạch chữ trắng
// - đèn trần dây thả + chao kem vuông
// - TV CRT xám ăng-ten trên TỦ XANH DƯƠNG có ngăn kéo, đồ đỏ dưới chân
// - sofa nâu 2 chỗ đệm + tay vịn
// - bàn máy tính xám + màn CRT trắng màn tối
// - tủ lạnh trắng nam châm màu
// - radiator/bộ tản nhiệt trắng mép phải
// - giường trắng thấp mép trái + gối
// Nhân vật ~34px = 3/4 tủ lạnh; sàn từ y=142, đi vùng y 141-160.

function veTuongOliveBen() {
  // tường olive phẳng + vết bẩn/mốc đậm hơn rải rác (đúng chất crummy)
  CTX.fillStyle = '#8A9A50'; CTX.fillRect(0, 0, 320, 142);
  CTX.fillStyle = '#6E7A38';
  // đốm hình thoi/khối không đều — vị trí giống frame mẫu (trên-trái sát cửa sổ, giữa-phải cạnh poster, thấp sát sàn)
  const ben = [[36, 18, 10, 7], [30, 24, 6, 5], [196, 26, 9, 6], [202, 33, 6, 8], [288, 30, 8, 6], [250, 96, 10, 5], [76, 100, 7, 6], [124, 14, 8, 5]];
  for (const [bx, by, bw, bh] of ben) {
    CTX.fillRect(bx, by, bw, bh);
    CTX.fillRect(bx + 3, by + bh, bw - 5, 3); // rãnh nước chảy
  }
  // vệt mốc lớn nhạt hơn 1 tông trải nhẹ
  CTX.fillStyle = 'rgba(84,94,44,0.45)';
  CTX.fillRect(150, 40, 18, 10); CTX.fillRect(56, 66, 12, 8);
}

function veSanGoVan(y0) {
  // sàn gỗ ván NGANG: 10 hàng ván, đường chỉ ngang đậm + mạch dọc lệch nhau
  CTX.fillStyle = '#8B5E3C'; CTX.fillRect(0, y0, 320, 240 - y0);
  CTX.fillStyle = '#6E4A28';
  for (let yy = y0; yy < 240; yy += 10) CTX.fillRect(0, yy, 320, 2);
  CTX.fillStyle = '#5A3A1C';
  for (let yy = y0, i = 0; yy < 240; yy += 10, i++) {
    CTX.fillRect((i * 73) % 280 + 10, yy, 2, 10); // mạch dọc lệch từng hàng
    CTX.fillRect((i * 137) % 280 + 160, yy, 2, 10);
  }
  CTX.fillStyle = '#3E2810'; CTX.fillRect(0, y0, 320, 2); // đường chân tường
}

function veCuaSoRem4o(x, y) {
  // cửa sổ khung nâu 4 ô, kính = rèm tím lavender sọc dọc sáng-tối, có bệ
  CTX.fillStyle = '#3E2810'; CTX.fillRect(x - 2, y - 2, 84, 60);
  CTX.fillStyle = '#A07848'; CTX.fillRect(x - 1, y - 1, 82, 58); // khung nâu nhạt
  CTX.fillStyle = '#8A62D8'; CTX.fillRect(x + 3, y + 3, 74, 50); // rèm tím lavender
  CTX.fillStyle = '#A67EE8'; // nếp rèm sọc dọc sáng-tối xen kẽ
  for (let i = 0; i < 5; i++) CTX.fillRect(x + 7 + i * 14, y + 3, 5, 50);
  CTX.fillStyle = '#3E2810'; // nan chia 4 ô (thanh chữ thập)
  CTX.fillRect(x + 3, y + 27, 74, 3);
  CTX.fillRect(x + 38, y + 3, 3, 50);
  CTX.fillStyle = '#C8A068'; CTX.fillRect(x - 4, y + 57, 90, 5); // bệ cửa
  CTX.fillStyle = '#8A6838'; CTX.fillRect(x - 4, y + 62, 90, 2);
}

function veLichDoTrang(x, y) {
  // lịch giấy trắng đầu đỏ + 2 móc treo + dòng kẻ ngày
  CTX.fillStyle = '#3E2810';
  CTX.fillRect(x + 4, y - 5, 2, 5); CTX.fillRect(x + 24, y - 5, 2, 5); // móc
  CTX.fillStyle = '#5E5E66'; CTX.fillRect(x, y, 30, 40);
  CTX.fillStyle = '#F0EDE4'; CTX.fillRect(x + 1, y + 1, 28, 38);
  CTX.fillStyle = '#C83838'; CTX.fillRect(x + 1, y + 1, 28, 9); // đầu đỏ
  CTX.fillStyle = '#F0EDE4'; CTX.fillRect(x + 6, y + 3, 18, 5); // ô tháng
  CTX.fillStyle = '#8E2418'; CTX.fillRect(x + 12, y + 4, 8, 3); // số tháng
  CTX.fillStyle = '#A8A090';
  for (let r = 0; r < 5; r++) for (let cc = 0; cc < 7; cc++) CTX.fillRect(x + 4 + cc * 4, y + 14 + r * 4, 3, 2); // lưới ngày
}

function vePosterMatTroi(x, y) {
  // poster tím than + mặt trời cam rực + tia + 2 vạch chữ trắng dưới
  CTX.fillStyle = '#3E2810'; CTX.fillRect(x - 2, y - 2, 44, 54);
  CTX.fillStyle = '#3A3060'; CTX.fillRect(x, y, 40, 50);
  CTX.fillStyle = '#E08020';
  CTX.fillRect(x + 14, y + 12, 12, 12); // thân mặt trời
  CTX.fillRect(x + 16, y + 10, 8, 16); CTX.fillRect(x + 12, y + 14, 16, 8); // bo góc
  // tia 8 hướng
  CTX.fillRect(x + 19, y + 4, 2, 6); CTX.fillRect(x + 19, y + 26, 2, 6);
  CTX.fillRect(x + 8, y + 17, 6, 2); CTX.fillRect(x + 26, y + 17, 6, 2);
  CTX.fillRect(x + 11, y + 9, 4, 2); CTX.fillRect(x + 25, y + 9, 4, 2);
  CTX.fillRect(x + 11, y + 25, 4, 2); CTX.fillRect(x + 25, y + 25, 4, 2);
  CTX.fillStyle = '#F8E8B0';
  CTX.fillRect(x + 12, y + 36, 16, 2); CTX.fillRect(x + 14, y + 40, 12, 2); // 2 vạch chữ
}

function veDenTreoChaoKem(x, y) {
  // dây thẳng từ trần + chao đèn kem hình thang + bóng đèn vàng
  CTX.fillStyle = '#241B30'; CTX.fillRect(x, 0, 2, y);
  CTX.fillStyle = '#F0E6D0'; // chao hình thang
  CTX.fillRect(x - 8, y, 18, 4);
  CTX.fillRect(x - 6, y + 4, 14, 3);
  CTX.fillRect(x - 4, y + 7, 10, 3);
  CTX.fillStyle = '#FFD040'; CTX.fillRect(x - 1, y + 10, 4, 3); // bóng đèn
}

function veTVCRTAntenTrenTuXanh() {
  // tủ xanh dương có ngăn kéo (chạm sàn y=142), TV CRT xám + ăng-ten V, vật đỏ dưới chân
  // TỦ
  CTX.fillStyle = '#3E2810'; CTX.fillRect(244, 82, 60, 62);
  CTX.fillStyle = '#3868C8'; CTX.fillRect(245, 83, 58, 60);
  CTX.fillStyle = '#2C4E96';
  CTX.fillRect(247, 108, 54, 2); CTX.fillRect(247, 134, 54, 2); // ngăn
  CTX.fillStyle = '#F0E6D0'; CTX.fillRect(268, 118, 8, 3); CTX.fillRect(268, 144, 8, 3); // tay kéo
  CTX.fillStyle = '#241B30'; CTX.fillRect(242, 142, 64, 3); // bóng chạm sàn
  // TV CRT trên tủ (đáy TV = y82 = mặt tủ)
  CTX.fillStyle = '#3E2810'; CTX.fillRect(252, 52, 44, 32);
  CTX.fillStyle = '#B8B4A8'; CTX.fillRect(253, 53, 42, 30); // vỏ be/xám
  CTX.fillStyle = '#241B30'; CTX.fillRect(257, 57, 30, 22); // màn tối
  CTX.fillStyle = '#3A4A4A'; CTX.fillRect(259, 59, 26, 18); // phản chiếu mờ
  CTX.fillStyle = '#8A8A92'; CTX.fillRect(290, 58, 4, 3); CTX.fillRect(290, 63, 4, 3); // núm
  // ăng-ten chữ V
  CTX.strokeStyle = '#241B30'; CTX.lineWidth = 2;
  CTX.beginPath(); CTX.moveTo(268, 53); CTX.lineTo(258, 36); CTX.stroke();
  CTX.beginPath(); CTX.moveTo(274, 53); CTX.lineTo(286, 36); CTX.stroke();
  CTX.fillStyle = '#241B30'; CTX.fillRect(266, 34, 6, 3); // đế ăng-ten
  // vật đỏ nhỏ dưới chân tủ (frame mẫu: chuột/sách đỏ)
  CTX.fillStyle = '#C83838'; CTX.fillRect(304, 130, 7, 5);
  CTX.fillStyle = '#8E2418'; CTX.fillRect(304, 134, 7, 1);
}

function veSofaNau2Cho() {
  // sofa nâu đậm 2 chỗ: đệm lưng + đệm ngồi + tay vịn 2 bên, chạm sàn
  CTX.fillStyle = '#3E2810'; CTX.fillRect(96, 96, 78, 48);
  CTX.fillStyle = '#6E4228'; CTX.fillRect(97, 97, 76, 46); // thân nâu
  CTX.fillStyle = '#5A3218'; // tay vịn 2 bên đậm hơn
  CTX.fillRect(97, 112, 10, 31); CTX.fillRect(163, 112, 10, 31);
  CTX.fillStyle = '#82503A'; // đệm lưng
  CTX.fillRect(109, 102, 26, 16); CTX.fillRect(136, 102, 26, 16);
  CTX.fillStyle = '#8E5C42'; // đệm ngồi
  CTX.fillRect(109, 120, 26, 14); CTX.fillRect(136, 120, 26, 14);
  CTX.fillStyle = '#3E2810'; // khe đệm
  CTX.fillRect(134, 102, 2, 32);
  CTX.fillStyle = '#241B30'; CTX.fillRect(96, 142, 80, 3); // bóng chạm sàn
}

function veBanMayVanhCRT() {
  // bàn máy tính xám + màn CRT trắng màn tối + ghế, chạm sàn
  CTX.fillStyle = '#3E2810'; CTX.fillRect(186, 108, 56, 36);
  CTX.fillStyle = '#9A9690'; CTX.fillRect(187, 109, 54, 34); // mặt bàn xám
  CTX.fillStyle = '#7E7A74'; CTX.fillRect(187, 138, 54, 5); // cạnh bàn
  CTX.fillStyle = '#3E2810'; CTX.fillRect(190, 142, 6, 2); CTX.fillRect(232, 142, 6, 2); // chân
  // màn CRT trắng màn tối trên bàn
  CTX.fillStyle = '#3E2810'; CTX.fillRect(196, 82, 34, 28);
  CTX.fillStyle = '#F0EDE4'; CTX.fillRect(197, 83, 32, 26);
  CTX.fillStyle = '#241B30'; CTX.fillRect(201, 87, 22, 16); // màn tối
  CTX.fillStyle = '#5E6E88'; CTX.fillRect(203, 89, 10, 2); CTX.fillRect(203, 93, 16, 2); // dòng chữ trên màn
  CTX.fillStyle = '#8A8A92'; CTX.fillRect(206, 110, 12, 3); // đế phím
  // bóng
  CTX.fillStyle = '#241B30'; CTX.fillRect(186, 142, 56, 3);
}

function veTuLanhNamCham() {
  // tủ lạnh trắng cao ~1.3x nhân vật, khe cửa + nam châm màu, chạm sàn
  CTX.fillStyle = '#3E2810'; CTX.fillRect(60, 66, 34, 78);
  CTX.fillStyle = '#F0F0EC'; CTX.fillRect(61, 67, 32, 76);
  CTX.fillStyle = '#C4C4C0'; CTX.fillRect(61, 96, 32, 2); // khe ngăn đông
  CTX.fillStyle = '#8A8A92'; CTX.fillRect(86, 74, 3, 10); CTX.fillRect(86, 104, 3, 14); // tay nắm
  // nam châm màu (như frame mẫu)
  CTX.fillStyle = '#E08020'; CTX.fillRect(68, 76, 4, 4);
  CTX.fillStyle = '#3868C8'; CTX.fillRect(74, 82, 4, 4);
  CTX.fillStyle = '#C83838'; CTX.fillRect(68, 110, 4, 4);
  CTX.fillStyle = '#3E8E4E'; CTX.fillRect(76, 116, 4, 4);
  CTX.fillStyle = '#241B30'; CTX.fillRect(58, 142, 38, 3); // bóng
}

function veRadiatorTrang(x) {
  // bộ tản nhiệt trắng mép phải (frame mẫu có radiator/bếp cũ)
  CTX.fillStyle = '#3E2810'; CTX.fillRect(x, 112, 26, 32);
  CTX.fillStyle = '#E8E4DC'; CTX.fillRect(x + 1, 113, 24, 30);
  CTX.fillStyle = '#B8B4AC';
  for (let i = 0; i < 5; i++) CTX.fillRect(x + 3 + i * 5, 115, 3, 26); // nan dọc
  CTX.fillStyle = '#241B30'; CTX.fillRect(x - 1, 142, 28, 3);
}

function veGiuongTrangThap() {
  // giường/ghế dài trắng thấp mép trái + gối xám (frame 27: vật trắng thấp)
  CTX.fillStyle = '#3E2810'; CTX.fillRect(0, 118, 52, 26);
  CTX.fillStyle = '#E8E4DC'; CTX.fillRect(1, 119, 50, 24);
  CTX.fillStyle = '#C8C4BC'; CTX.fillRect(1, 119, 50, 6); // đệm trên
  CTX.fillStyle = '#9A9690'; CTX.fillRect(4, 121, 16, 9); // gối
  CTX.fillStyle = '#241B30'; CTX.fillRect(0, 142, 54, 3);
}

// ===== PHÒNG TRỌ SG — dán đúng bố cục mẫu, giữ chất SG (xe máy, cửa sắt) =====
SG.phong_tro = function () {
  veTuongOliveBen();
  veSanGoVan(142);
  // cửa sổ rèm tím 4 ô (trái-trên như frame mẫu)
  veCuaSoRem4o(36, 14);
  // lịch đỏ-trắng cạnh cửa sổ
  veLichDoTrang(136, 16);
  // poster mặt trời giữa-phải tường
  vePosterMatTroi(186, 24);
  // đèn trần chao kem giữa phòng
  veDenTreoChaoKem(158, 22);
  // GIƯỜNG trắng thấp mép trái
  veGiuongTrangThap();
  // TỦ LẠNH nam châm (sau giường, như mẫu tủ lạnh sát trái)
  veTuLanhNamCham();
  // SOFA nâu 2 chỗ giữa
  veSofaNau2Cho();
  // BÀN MÁY TÍNH + CRT
  veBanMayVanhCRT();
  // TV CRT ăng-ten trên tủ xanh bên phải
  veTVCRTAntenTrenTuXanh();
  // radiator trắng mép phải
  veRadiatorTrang(292);
  // CHẤT SG: cửa sắt kéo + xe máy dựng trong nhà (giữ bản sắc 3 TP)
  veCuaSat(0, 58, 34, 84);
  veXeMay(256, 160, C.do);
  // dây điện trần mảnh
  CTX.strokeStyle = '#241B30'; CTX.lineWidth = 1;
  CTX.beginPath(); CTX.moveTo(0, 4); CTX.quadraticCurveTo(80, 10, 160, 4); CTX.stroke();
  CTX.beginPath(); CTX.moveTo(160, 4); CTX.quadraticCurveTo(240, 12, 320, 6); CTX.stroke();
};
