// GAME — điều phối: state + render + UI
let G = null; // game state

function batDau(tenTp) {
  G = taoNguoiChoi(tenTp);
  document.getElementById('menu').style.display = 'none';
  capNhatHUD();
  render();
  hopThoai('Cô chủ trọ', 'Chào con! Phòng 12m², 1 triệu 5 một tháng, điện nước riêng. Túi 150 ngàn thôi à... ráng đi làm nha con.');
}

function capNhatHUD() {
  const t = G.thoiGian;
  document.getElementById('hud-tg').textContent =
    'Ngày ' + t.ngay + ' · ' + (THU_VIET[t.thu] || '?') + ' · ' + String(t.gio).padStart(2,'0') + 'h' + String(t.phut).padStart(2,'0');
  document.getElementById('hud-tien').textContent =
    G.tien.toLocaleString('vi-VN') + ' đ';
  const c = G.chiSo;
  document.getElementById('hud-chiso').textContent =
    '⚡' + c.nangLuong + ' ❤️' + c.tamTrang + ' 🍚' + c.doBao;
  document.getElementById('man-hinh-nho').textContent = G.thanhPho.ten || '';
}

function hienThoiGian1h() {
  if (!G) return;
  tienTruoi(G, 60);
  npcSong(G, 60);
  capNhatHUD();
  // Sự kiện theo giờ
  const sk = kiemTraSuKien(G);
  if (sk.length) hopThoai('Phố', sk[0].ten + ' — ' + (sk[0].chiSo ? '⚡' + sk[0].chiSo.nangLuong : ''));
  render();
}

function apDung(chg) {
  apDungChiSo(G, chg);
  capNhatHUD();
}

function anUong() {
  if (G.tien < 25_000) return hopThoai('Má ơi', 'Tiền không đủ cơm rồi con ơi...');
  G.tien -= 25_000;
  apDung({ doBao: +30, tamTrang: +5 });
  const mon = G.thaoGian ? G.thanhPho.mon : G.theGioi.mon;
  hopThoai('Ăn uống', 'Mọi: một tô ' + mon[Math.floor(Math.random()*mon.length)] + ' ngon lành! (−25.000đ, +30 no)');
}

function ngu() {
  if (G.thoiGian.gio < 21 && G.thoiGian.gio > 4) {
    return hopThoai('Bà hàng xóm', 'Mới ' + G.thoiGian.gio + ' giờ mà đi ngủ à? Cuộc đời còn nhiều thứ nữa con ạ.');
  }
  tienTruoi(G, 480);
  G.chiSo.nangLuong = 100;
  G.chiSo.doBao = Math.max(20, G.chiSo.doBao - 40);
  capNhatHUD();
  hopThoai('Sáng mới', 'Bạn thức dậy tràn đầy năng lượng! ⚡100');
}

function diLam() {
  const t = G.thoiGian;
  if (t.thu === 8 || t.thu === 7) return hopThoai('Phòng bự', 'Cuối tuần mà! Nghỉ đi con.');
  if (t.gio < 7 || t.gio > 17) return hopThoai('Sếp', 'Văn phòng đóng rồi, mai đi làm lúc 7 giờ sáng.');
  tienTruoi(G, 480);
  G.tien += 80_000;
  apDung({ nangLuong: -30, tamTrang: -20 });
  capNhatHUD();
  hopThoai('Quán văn phòng', 'Bạn làm hết một ngày! Lương ngày: +80.000đ (⚡−30, 🍚−20)');
}

function diCho() {
  if (G.tien < 50_000) return hopThoai('Chợ', 'Không đủ tiền đi chợ nè con...');
  G.tien -= 50_000;
  apDung({ doBao: +20, tamTrang: +8 });
  hopThoai('Chợ', 'Đi chợ mua rau + trứng + cà phê. Cửa xếp quán quen quen mở rồi! (−50.000đ)');
}

function moDiary() {
  if (!G.diary.length) return hopThoai('Nhật ký', 'Nhật ký còn trống. Hãy sống đời đi đã — rồi có chuyện để ghi.');
  const d = G.diary[G.diary.length - 1];
  hopThoai('Nhật ký · ' + d.ngay, d.nguoi + ': ' + d.noiDung);
}

function hopThoai(nguoi, noiDung) {
  const box = document.getElementById('hop-thoai');
  box.style.display = 'block';
  box.innerHTML = '<span class="nguoi">' + nguoi + '</span><br>' + noiDung +
    '<br><span class="nut" onclick="this.parentElement.style.display=\'none\'">Đóng</span>';
}
