// GAME v2 — điều phối: state + render + UI (Cơm Bụi & Deadline, Phase 1)
let G = null; // game state

const MAU_THANH = {
  nangLuong: '#E8C46A', tamTrang: '#E2585E', doBao: '#E67E22',
  khatNuoc: '#3498DB', xaHoi: '#B06AC9', tinhThan: '#47857D',
};

function batDau(tenTp) {
  G = taoNguoiChoi(tenTp);
  khoiDongUI();
  G.diary.push({ ngay: 1, thu: 2, loai: 'chuyen_den', noiDung: 'Chuyển tới ' + G.thanhPho.ten + ', thuê phòng trọ 12m². Túi còn đúng 150 ngàn.' });
  hopThoai('Bà Tư chủ trọ', 'Chào con! Phòng 12m², 1 triệu 5 một tháng, điện nước riêng. Túi mỏng thì ráng đi làm nha con — đầu tháng nhớ tiền trọ.');
  ghiLog('Bắt đầu cuộc đời mới tại ' + G.thanhPho.ten + '.');
}

function tiepTuc() {
  const s = docGame();
  if (!s) return;
  G = s;
  khoiDongUI();
  hopThoai('Tiếp tục', 'Tải bản lưu thành công — ngày ' + G.thoiGian.ngay + ', túi ' + G.tien.toLocaleString('vi-VN') + 'đ.');
  ghiLog('Đã tải bản lưu.');
}

function khoiDongUI() {
  document.getElementById('menu').style.display = 'none';
  document.getElementById('van-bia').style.display = 'none';
  dungNhuCauUI();
  capNhatHUD();
  capNhatMenuHoatDong();
  try { doiSceneImLang('phong_tro'); } catch (e) { if (typeof SCENE_HIEN !== 'undefined') SCENE_HIEN = 'phong_tro'; }
  render();
}

// ===== HUD =====
function capNhatHUD() {
  if (!G) return;
  const t = G.thoiGian;
  document.getElementById('hud-tg').textContent =
    THU_VIET[t.thu] + ' · ngày ' + t.ngay + '/' + 30 + ' · ' + String(t.gio).padStart(2,'0') + ':' + String(t.phut).padStart(2,'0','0');
  document.getElementById('hud-tien').textContent = G.tien.toLocaleString('vi-VN') + ' đ';
  document.getElementById('hud-nghe').textContent = G.nghe + (G.phong.conNo > 0 ? ' · nợ trọ ' + G.phong.conNo.toLocaleString('vi-VN') + 'đ' : '');
  capNhatNhuCau();
  capNhatMenuHoatDong();
}

// ===== 6 THANH NHU CẦU =====
function dungNhuCauUI() {
  const wrap = document.getElementById('nhu-cau');
  wrap.innerHTML = '';
  for (const [k, m] of Object.entries(NHU_CAU)) {
    const d = document.createElement('div');
    d.className = 'nc'; d.id = 'nc-' + k;
    d.innerHTML = '<div class="ten"><span>' + m.icon + ' ' + m.ten + '</span><span class="gia-tri">0</span></div>' +
      '<div class="thanh"><div class="day" style="width:0%; background:' + MAU_THANH[k] + '"></div></div>';
    wrap.appendChild(d);
  }
}
function capNhatNhuCau() {
  for (const k of Object.keys(NHU_CAU)) {
    const el = document.getElementById('nc-' + k);
    if (!el) continue;
    const v = Math.round(G.chiSo[k]);
    el.querySelector('.gia-tri').textContent = v + '%';
    el.querySelector('.day').style.width = v + '%';
    el.classList.toggle('thap', v < 25);
  }
}

// ===== MENU HOẠT ĐỘNG (linh hồn 9 To Life) =====
function capNhatMenuHoatDong() {
  const wrap = document.getElementById('hoat-dong');
  if (!wrap || !G) return;
  const scene = (typeof SCENE_HIEN !== 'undefined') ? SCENE_HIEN : 'phong_tro';
  const list = hoatDongKhaDung(G, scene);
  wrap.innerHTML = '';
  if (!list.length) {
    wrap.innerHTML = '<div style="font-size:11px;color:#8A80A0">Giờ này ở đây không có gì để làm. Thử ra phố hoặc chờ tới giờ khác.</div>';
    return;
  }
  for (const h of list) {
    const b = document.createElement('button');
    b.className = 'hd';
    let phi = '';
    if (h.tien > 0) phi = '+' + (h.tien/1000) + 'k';
    else if (h.tien < 0) phi = '−' + (-h.tien/1000) + 'k';
    const mui = muiTenChiSo(h.chiSo);
    b.innerHTML = '<span>' + h.ten + ' <span class="mui">' + mui + '</span></span>' +
      '<span class="phi">' + (phi ? phi + ' · ' : '') + dinhDangPhut(h.phut) + '</span>';
    b.onclick = () => bamHoatDong(h.id);
    wrap.appendChild(b);
  }
}
function muiTenChiSo(chiSo) {
  const mau = { nangLuong:'⚡', tamTrang:'❤', doBao:'🍚', khatNuoc:'💧', xaHoi:'💬', tinhThan:'🌿' };
  return Object.entries(chiSo || {})
    .filter(([, v]) => v !== 0)
    .map(([k, v]) => mau[k] + (v > 0 ? '↑' : '↓'))
    .join(' ');
}

function bamHoatDong(id) {
  if (!G || G.daChet) return;
  const ngayTruoc = G.thoiGian.ngay;
  const thangTruoc = G.thoiGian.thang;
  const kq = lamHoatDong(G, id);
  if (!kq.ok) { hopThoai('Khoan đã', kq.lyDo); capNhatHUD(); return; }
  const h = kq.hoatDong;
  const tienTxt = h.tien > 0 ? ' (+' + h.tien.toLocaleString('vi-VN') + 'đ)' : h.tien < 0 ? ' (' + h.tien.toLocaleString('vi-VN') + 'đ)' : '';
  hopThoai(h.ten, h.moTa + tienTxt + '\n' + muiTenChiSoTxt(h.chiSo) + ' · mất ' + dinhDangPhut(h.phut));
  // ngủ đêm kéo qua ngày mới
  if (id === 'ngu_dem') G.chiSo.nangLuong = 100;
  capNhatHUD();
  // sang ngày mới → sự kiện đầu tháng / kiểm tra chết
  if (G.thoiGian.thang !== thangTruoc && G.thoiGian.ngay === 1) {
    const tt = xuLyTienThue(G);
    setTimeout(() => hopThoai('Bà Tư', tt.ok ? 'Tiền trọ tháng này đủ rồi. Bà gật gù: "con biết lo rồi đó".' : 'Thiếu tiền trọ rồi con. Nợ bà ' + tt.no.toLocaleString('vi-VN') + 'đ — tháng sau liệu đó.'), 1600);
  }
  kiemTraChet();
  render();
}
function muiTenChiSoTxt(chiSo) {
  const ten = { nangLuong:'NL', tamTrang:'TT', doBao:'No', khatNuoc:'Nước', xaHoi:'XH', tinhThan:'TT2' };
  return Object.entries(chiSo).filter(([,v]) => v !== 0).map(([k,v]) => ten[k] + ' ' + (v>0?'+':'') + v).join(', ');
}

// ===== SỰ KIỆN THEO GIỜ + NGẪU NHIÊN =====
let suKienDaBao = ''; // chống spam cùng sự kiện trong cùng giờ
function chaySuKien() {
  if (!G || G.daChet) return;
  const sk = kiemTraSuKien(G);
  const ngauNhien = sk.find(s => s.ngauNhien);
  if (ngauNhien) {
    const key = ngauNhien.id + '-' + G.thoiGian.ngay + '-' + G.thoiGian.gio;
    if (key !== suKienDaBao) {
      suKienDaBao = key;
      setTimeout(() => { hopThoai('⚡ ' + ngauNhien.ten, ngauNhien.thoai); capNhatHUD(); kiemTraChet(); }, 1400);
    }
  }
  capNhatHUD();
}

// ===== CHẾT + VĂN BIA =====
function kiemTraChet() {
  if (!G || !G.daChet) return;
  const d = G.daChet;
  document.getElementById('vb-ten').textContent = d.ten.toUpperCase();
  document.getElementById('vb-nghe').textContent = '· ' + d.nghe.toUpperCase() + ' ·';
  document.getElementById('vb-tuoi').textContent = 'Hưởng dương ' + d.tuoi + ' tuổi — Ngày ' + d.ngay + ' tháng ' + d.thang;
  document.getElementById('vb-lydo').textContent = 'Mất vì ' + d.lyDo + '.';
  document.getElementById('vb-trich').textContent = '"' + d.vanBia + '"';
  document.getElementById('vb-khach').textContent = d.khachDu + ' người quen tới tiễn. Có người mang theo ly trà đá đặt lên mộ.';
  document.getElementById('van-bia').style.display = 'flex';
  xoaSave();
}

// ===== HỘP THOẠI =====
let hopThoaiTimer = null;
function hopThoai(nguoi, noiDung) {
  const box = document.getElementById('hop-thoai');
  box.style.display = 'block';
  box.innerHTML = '<span class="nguoi">' + nguoi + '</span><br>' + noiDung.replace(/\n/g, '<br>') +
    '<br><span class="nut" onclick="dongHopThoai()">Đóng</span>';
  if (hopThoaiTimer) clearTimeout(hopThoaiTimer);
  hopThoaiTimer = setTimeout(dongHopThoai, 9000);
}
function dongHopThoai() {
  document.getElementById('hop-thoai').style.display = 'none';
  if (hopThoaiTimer) { clearTimeout(hopThoaiTimer); hopThoaiTimer = null; }
}

// ===== NHẬT KÝ =====
function moNhatKy() {
  const p = document.getElementById('panel-nhat-ky');
  const list = document.getElementById('nhat-ky-list');
  if (p.style.display === 'none' || !p.style.display) {
    list.innerHTML = G && G.diary.length
      ? G.diary.slice(-12).reverse().map(d => '<div>▫ <b>N' + d.ngay + '</b> · ' + d.noiDung + '</div>').join('')
      : '<div>Nhật ký còn trống. Hãy sống đời đi đã.</div>';
    p.style.display = 'block';
  } else p.style.display = 'none';
}

// ===== SAVE / LOAD =====
function luuVaBao() {
  if (!G) return;
  luuGame(G);
  hopThoai('💾 Đã lưu', 'Cuộc đời bạn được cất gọn vào máy. Mai mở lại chơi tiếp.');
}
function hoiLaiChoi() {
  xoaSave();
  G = null;
  document.getElementById('van-bia').style.display = 'none';
  document.getElementById('menu').style.display = 'flex';
  kiemTraSaveMenu();
}
function kiemTraSaveMenu() {
  const s = docGame();
  document.getElementById('btn-tiep-tuc').style.display = s ? 'inline-block' : 'none';
}

// ===== LOG =====
function ghiLog(txt) { if (typeof console !== 'undefined') console.log('[game]', txt); }

// ===== ĐỒNG BỘ THỜI GIAN THẬT (mỗi 20s = 10 phút game — đời trôi nhẹ) =====
setInterval(() => {
  if (!G || G.daChet) return;
  const gioTruoc = G.thoiGian.gio;
  tienDo(G, 10);
  if (G.thoiGian.gio !== gioTruoc) chaySuKien();
  capNhatHUD();
  kiemTraChet();
}, 20000);

// Auto-save mỗi 60s
setInterval(() => { if (G && !G.daChet) luuGame(G); }, 60000);

// Hook: render8 gọi hàm này khi đổi cảnh → refresh menu hoạt động
function sauKhiDoiScene(ten) {
  if (!G) return;
  document.getElementById('canh-hien').textContent = '📍 ' + G.thanhPho.ten + ' · ' + ten;
  capNhatMenuHoatDong();
}

function diChuyenNhanh(tenScene) {
  if (!G || G.daChet) return;
  if (typeof doiScene === 'function') doiScene(tenScene);
}

kiemTraSaveMenu();
