// GAME v3 — UI giống 9 To Life: HUD trên, panel idle 6 bars + mood, tabs, today quest, dream LP, action list khóa
let G = null;
let TAB_HIEN = 'lam';
let PAUSE = false;

// ===== ÂM THANH 8-BIT (Pixabay, license-free) — 1 hệ thống duy nhất =====
// BGM arcade melody (loop) + 5 SFX: chọn / nút / tình cảm / tiền / game-over
const SFX = {
  chon: { src: 'assets/sfx/sfx_8bit_game_1.mp3', vol: 0.5 },     // chọn / bắt đầu cuộc đời
  nut:  { src: 'assets/sfx/sfx_8bit_game_2.mp3', vol: 0.28 },    // bấm nút UI (ngắn)
  coin: { src: 'assets/sfx/sfx_8bit_game_3.mp3', vol: 0.5 },     // tiền về / trọn quest
  yeu:  { src: 'assets/sfx/sfx_8bit_game_5.mp3', vol: 0.5 },     // tình cảm / thành đôi
  chet: { src: 'assets/sfx/sfx_peach_game_over_3.mp3', vol: 0.55 }, // văn bia
};
const BGM = { src: 'assets/sfx/bgm_arcade_melody.mp3', vol: 0.18 };
let MUTE = false, amKhoi = false, bgmAudio = null;
const sfxCache = {};
function amBat() { // trình duyệt chỉ cho autoplay sau tương tác
  if (amKhoi || MUTE) return;
  amKhoi = true;
  if (!bgmAudio) { bgmAudio = new Audio(BGM.src); bgmAudio.loop = true; bgmAudio.volume = BGM.vol; }
  bgmAudio.play().catch(() => {});
}
function bgmBat() { if (MUTE) return; amKhoi = true; if (!bgmAudio) { bgmAudio = new Audio(BGM.src); bgmAudio.loop = true; bgmAudio.volume = BGM.vol; } bgmAudio.play().catch(() => {}); }
function bgmTat() { if (bgmAudio) { bgmAudio.pause(); bgmAudio.currentTime = 0; } }
function playSfx(ten, vol) {
  if (!amKhoi || MUTE) return;
  const def = SFX[ten]; if (!def) return;
  let a = sfxCache[ten];
  if (!a) { a = new Audio(def.src); sfxCache[ten] = a; }
  try { a.currentTime = 0; a.volume = (vol != null ? vol : def.vol); a.play(); } catch (e) { /* trình duyệt chặn */ }
}
function taoMute() {
  MUTE = !MUTE;
  if (MUTE) { if (bgmAudio) bgmAudio.pause(); } else { bgmBat(); }
  const b = document.getElementById('hud-am'); if (b) b.textContent = MUTE ? '🔇' : '🔊';
}
document.addEventListener('pointerdown', function () { if (!amKhoi) amBat(); }, { once: true });
document.addEventListener('pointerdown', function (e) {
  if (e.target.closest && e.target.closest('button')) playSfx('nut');
});

// ===== MENU TẠO NHÂN VẬT =====
const TP_KEYS = ['saigon', 'hanoi', 'danang'];
const TP_MO_TA = {
  saigon: 'Hẻm sâu, mưa ngập, cơm tấm sáng — thành phố không ngủ.',
  hanoi: 'Phố cổ rêu phong, gió mùa, phở gánh và trà chanh.',
  danang: 'Biển xanh, gió Lào, mì Quảng — chậm mà chắc.',
};
const NGHE_LIST = [
  { id: 'van_phong', ten: 'Dân văn phòng', moTa: 'Thực tập sinh với 200 ngàn, phòng trọ 12m² và nhiều hoài bão.' },
  { id: 'shipper', ten: 'Shipper', moTa: 'Xe máy cũ, app đơn và đôi chân không mỏi. (Phase 3)' },
  { id: 'ban_quan', ten: 'Phụ quán', moTa: 'Bưng bê ở quán phở Bà Hạnh, tối về đếm tiền lẻ. (Phase 3)' },
];
const DREAM_LIST = [
  { ten: 'Nhà Mặt Phố', moTa: 'Từ phòng trọ 12m² tới căn nhà mặt phố của riêng mình.' },
  { ten: 'Về Quê Nuôi Cá', moTa: 'Bỏ phố về quê, ao cá vườn rau, wifi đầy đủ.' },
  { ten: 'Quán Cà Phê Của Mình', moTa: 'Một góc nhỏ, máy pha cũ, khách quen gọi tên.' },
];
let chonTp = 0, chonNghe = 0, chonDream = 0;

function chinhTp(d) { chonTp = (chonTp + d + 3) % 3; document.getElementById('tao-tp').textContent = THANH_PHO[TP_KEYS[chonTp]].ten; document.getElementById('tao-tp-mo-ta').textContent = TP_MO_TA[TP_KEYS[chonTp]]; }
function chinhNghe(d) { chonNghe = (chonNghe + d + NGHE_LIST.length) % NGHE_LIST.length; document.getElementById('tao-nghe').textContent = NGHE_LIST[chonNghe].ten; document.getElementById('tao-nghe-mo-ta').textContent = NGHE_LIST[chonNghe].moTa; }
function chinhDream(d) { chonDream = (chonDream + d + DREAM_LIST.length) % DREAM_LIST.length; document.getElementById('tao-dream').textContent = DREAM_LIST[chonDream].ten; document.getElementById('tao-dream-mo-ta').textContent = DREAM_LIST[chonDream].moTa; }
function doiTen() {
  const t = prompt('Tên nhân vật của bạn:', document.getElementById('tao-ten').textContent);
  if (t && t.trim()) document.getElementById('tao-ten').textContent = t.trim().slice(0, 12);
}

// nền menu: trời đêm + trăng + skyline (như title screen 9 To Life)
(function veMenuBg() {
  const c = document.getElementById('menu-bg');
  if (!c) return;
  const x = c.getContext('2d');
  const W = c.width, H = c.height;
  const g = x.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#141A30'); g.addColorStop(0.6, '#2A2450'); g.addColorStop(1, '#3A2B5C');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  for (let i = 0; i < 90; i++) {
    x.fillStyle = i % 3 ? '#FFF6E0' : '#E8C46A';
    x.fillRect((i * 61) % W, (i * 37) % (H * 0.6), 2, 2);
  }
  x.fillStyle = '#F0E6B4'; x.beginPath(); x.arc(W * 0.85, H * 0.12, 26, 0, 7); x.fill();
  x.fillStyle = '#2A2450'; x.beginPath(); x.arc(W * 0.85 + 10, H * 0.12 - 6, 22, 0, 7); x.fill();
  x.fillStyle = '#1A1636';
  for (let i = 0; i < 14; i++) {
    const bw = 20 + (i * 13) % 34, bh = 60 + (i * 47) % 140;
    const bx = (i * 37) % W;
    x.fillRect(bx, H * 0.75 - bh, bw, bh + H * 0.25);
    x.fillStyle = '#E8C46A';
    for (let wy = 0; wy < 4; wy++) if ((i + wy) % 3) x.fillRect(bx + 5 + (wy % 2) * 8, H * 0.75 - bh + 12 + wy * 22, 3, 4);
    x.fillStyle = '#1A1636';
  }
})();

function batDauTuMenu() {
  const ten = document.getElementById('tao-ten').textContent;
  G = taoNguoiChoi(TP_KEYS[chonTp], ten);
  playSfx('chon');
  G.nghe = NGHE_LIST[chonNghe].ten.toLowerCase();
  G.dream.ten = DREAM_LIST[chonDream].ten;
  G.dream.moTa = DREAM_LIST[chonDream].moTa;
  questMoi(G);
  khoiDongUI();
  bgmBat();
  G.diary.push({ ngay: 1, loai: 'chuyen_den', noiDung: 'Chuyển tới ' + G.thanhPho.ten + ', thuê phòng trọ 12m². Túi còn đúng 200 ngàn — giấc mơ: ' + G.dream.ten + '.' });
  hopThoai('Bà Tư chủ trọ', 'Chào con! Phòng 12m², 1 triệu 5 một tháng, điện nước riêng. Quên tiền trọ thì bà cho đúng 5 ngày đó nha. Ráng đi làm, đầu tháng nhớ tiền phòng.');
}

function tiepTuc() {
  const s = docGame();
  if (!s) return;
  G = s;
  khoiDongUI();
  bgmBat();
  hopThoai('Tiếp tục', 'Tải bản lưu — ngày ' + G.thoiGian.ngay + ', túi ' + G.tien.toLocaleString('vi-VN') + 'đ.');
}

function khoiDongUI() {
  document.getElementById('menu').style.display = 'none';
  document.getElementById('van-bia').style.display = 'none';
  dungBars();
  doiSceneImLang('phong_tro');
  capNhatTatCa();
  render();
}

function capNhatTatCa() {
  capNhatHUD(); capNhatBars(); capNhatToday(); capNhatDream();
  capNhatActions(); capNhatNpc(); capNhatKyNang(); capNhatDoi(); capNhatMo();
}

// ===== HUD =====
const IDLE_TITLE = { phong_tro: 'ĐANG Ở NHÀ', pho_dem: 'ĐANG Ở PHỐ', quan_pho: 'ĐANG Ở QUÁN PHỞ', bia_hoi: 'ĐANG UỐNG BIA HƠI', van_phong: 'ĐANG Ở CÔNG SỞ' };
function capNhatHUD() {
  if (!G) return;
  const t = G.thoiGian;
  document.getElementById('hud-ten').textContent = G.ten + (G.tuoi ? ' ' + G.tuoi : '');
  document.getElementById('hud-noi').textContent = 'Ngày ' + t.ngay + ' tại ' + (SCENES[SCENE_HIEN] ? SCENES[SCENE_HIEN].ten : 'phố');
  document.getElementById('hud-tg').textContent = (THU_VIET[t.thu] || '?') + ' ' + String(t.gio).padStart(2, '0') + ':' + String(t.phut).padStart(2, '0');
  document.getElementById('hud-tien').textContent = Math.round(G.tien).toLocaleString('vi-VN') + 'đ';
  document.getElementById('idle-title').textContent = IDLE_TITLE[SCENE_HIEN] || 'ĐANG Ở ĐÂU ĐÓ';
  document.getElementById('loc-hd').textContent = (SCENES[SCENE_HIEN] ? SCENES[SCENE_HIEN].ten.toUpperCase() : '') + (G.phong.conNo > 0 ? ' · NỢ TRỌ ' + G.phong.conNo.toLocaleString('vi-VN') + 'đ' : '');
  // biểu tượng tim trên HUD khi có người yêu (kiểu 9 To Life hiện Love)
  const coYeu = G.banGai ? ' 💕' + (G.npc.find(n => n.id === G.banGai.npcId) || {}).ten : '';
  document.getElementById('hud-ten').textContent = G.ten + (G.tuoi ? ' ' + G.tuoi : '') + coYeu;
  // shift note kiểu "Your shift is on (9am-5pm)"
  const ca = G.thoiGian.thu >= 2 && G.thoiGian.thu <= 6;
  document.getElementById('shift-note').innerHTML = ca
    ? '<b>Ca làm hôm nay:</b> 7h30 – 17h30 · ' + G.nghe + ' · lương ca ' + G.luong.ca.toLocaleString('vi-VN') + 'đ'
    : '<b>Cuối tuần!</b> Không ca làm — dành ngày cho mình, cho bạn bè, cho gia đình.';
}

// ===== 6 BARS + MOOD BOX (đúng layout Idle at Home của 9 To Life) =====
function dungBars() {
  const grid = document.getElementById('idle-grid');
  grid.innerHTML = '';
  let i = 0;
  for (const [k, m] of Object.entries(NHU_CAU)) {
    const d = document.createElement('div');
    d.className = 'bar'; d.id = 'bar-' + k;
    d.style.gridColumn = (i % 2) + 1; d.style.gridRow = Math.floor(i / 2) + 1;
    d.innerHTML = '<div class="ten"><span>' + m.icon + ' ' + m.ten + '</span><span class="tt">0%</span></div>' +
      '<div class="ong"><div class="day" style="width:0%"></div></div>';
    grid.appendChild(d);
    i++;
  }
  const mb = document.createElement('div');
  mb.id = 'mood-box';
  mb.innerHTML = '<img id="mood-face" src="assets/meowa-r1/char_07.png"><span id="mood-pct">—</span><span id="mood-txt"></span>';
  grid.appendChild(mb);
}
function capNhatBars() {
  if (!G) return;
  for (const k of Object.keys(NHU_CAU)) {
    const el = document.getElementById('bar-' + k);
    if (!el) continue;
    const v = Math.round(G.chiSo[k]);
    el.querySelector('.tt').textContent = v + '%';
    const day = el.querySelector('.day');
    day.style.width = v + '%';
    day.className = 'day' + (v < 25 ? ' do' : v < 50 ? ' vang' : '');
  }
  const m = mood(G);
  document.getElementById('mood-pct').textContent = m.pct + '%';
  document.getElementById('mood-pct').style.color = m.mau;
  document.getElementById('mood-txt').textContent = m.txt;
  document.getElementById('mood-face').src = m.pct >= 65 ? 'assets/meowa-r1/char_04.png' : m.pct >= 45 ? 'assets/meowa-r1/char_07.png' : m.pct >= 25 ? 'assets/meowa-r1/char_06.png' : 'assets/meowa-r1/char_02.png';
}

// ===== TODAY QUEST BOX =====
function capNhatToday() {
  if (!G || !G.questNgay) return;
  capNhatQuest(G);
  const q = G.questNgay;
  const done = q.viec.filter(v => v.xong).length;
  document.getElementById('today-hd').textContent = 'hôm nay ' + done + '/' + q.viec.length;
  document.getElementById('today-thuong').textContent = 'cả 3: +' + q.thuongHet.toLocaleString('vi-VN') + 'đ';
  const ul = document.getElementById('today-ul');
  ul.innerHTML = '';
  for (const v of q.viec) {
    const li = document.createElement('li');
    li.className = v.xong ? 'done' : '';
    li.innerHTML = '<span><span class="tick">' + (v.xong ? '☑' : '☐') + '</span> ' + v.ten + '</span><span class="thuong">+' + (v.thuong / 1000) + 'k</span>';
    ul.appendChild(li);
  }
}

// ===== DREAM LP =====
function capNhatDream() {
  if (!G) return;
  document.getElementById('dream-ten').textContent = G.dream.ten;
  document.getElementById('dream-lp').textContent = G.dream.lp + ' LP';
  const pips = document.getElementById('dream-pips');
  pips.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('span');
    p.className = 'pip' + (i < G.dream.lp % 8 ? ' on' : '');
    pips.appendChild(p);
  }
  document.getElementById('dream-mo-ta').innerHTML = '★ <b style="color:var(--vang)">' + G.dream.ten + '</b><br>' + G.dream.moTa +
    '<br><br>Mỗi ngày hoàn thành CẢ 3 việc "hôm nay" = +1 LP.<br>Hiện có: <b style="color:var(--vang)">' + G.dream.lp + ' LP</b>';
}

// ===== ACTION LIST (row: tên + mui ↑↓ + chip tiền + chip giờ; khóa = xỉu + lý do đỏ) =====
function capNhatActions() {
  const wrap = document.getElementById('actions');
  if (!wrap || !G) return;
  const list = hoatDongKhaDung(G, SCENE_HIEN);
  wrap.innerHTML = '';
  if (!list.length) { wrap.innerHTML = '<div class="panel" style="font-size:12px;color:#8A90B0">Ở đây giờ này không có gì để làm.</div>'; return; }
  for (const h of list) {
    const b = document.createElement('button');
    b.className = 'act' + (h.khoaLyDo ? ' locked' : '');
    const chips = (h.tien ? '<span class="chip">' + (h.tien > 0 ? '+' : '−') + Math.abs(h.tien) / 1000 + 'k</span>' : '') +
      '<span class="chip gio">' + dinhDangPhut(h.phut) + '</span>';
    b.innerHTML = '<span class="ten">' + h.ten + '<span class="mui">' + muiTen(h.chiSo) +
      (h.khoaLyDo ? '<span class="canhkhoa">🔒 ' + h.khoaLyDo + '</span>' : '') + '</span></span><span class="chips">' + chips + '</span>';
    if (!h.khoaLyDo) b.onclick = () => bamHoatDong(h.id);
    wrap.appendChild(b);
  }
}
const MUI = { com: '🍚', nangLuong: '⚡', vui: '🎮', xaHoi: '💬', sachSe: '🚿', sucKhoe: '❤' };
function muiTen(chiSo) {
  return Object.entries(chiSo || {}).filter(([, v]) => v !== 0 && v !== 100)
    .map(([k, v]) => '<span style="color:' + (v > 0 ? '#8FD4C8' : '#E88A90') + '">' + MUI[k] + (v > 0 ? '↑' : '↓') + '</span>').join(' ');
}

// ===== TABS =====
function chuyenTab(tab) {
  TAB_HIEN = tab;
  for (const t of ['lam', 'pho', 'nguoi', 'doi', 'song', 'mo']) {
    const el = document.getElementById('tab-' + t);
    if (el) el.style.display = t === tab ? 'block' : 'none';
    const btn = document.querySelector('.tab[data-tab="' + t + '"]');
    if (btn) btn.classList.toggle('on', t === tab);
  }
  if (tab === 'doi') capNhatDoi();
  if (tab === 'nguoi') capNhatNpc();
}
document.addEventListener('keydown', e => {
  const so = parseInt(e.key);
  if (so >= 1 && so <= 6) chuyenTab(['lam', 'pho', 'nguoi', 'doi', 'song', 'mo'][so - 1]);
});

// ===== NPC LIST (tab NGƯỜI — kiểu PEOPLE của 9 To Life) =====
function capNhatNpc() {
  const wrap = document.getElementById('npc-list');
  if (!wrap || !G) return;
  wrap.innerHTML = '';
  for (const n of [...G.npc].sort((a, b) => b.quanHe - a.quanHe)) {
    const d = document.createElement('div');
    d.className = 'npc';
    d.innerHTML = '<img src="assets/' + portraitCua(n.ten) + '">' +
      '<div class="info"><b>' + n.ten + '</b> <span style="color:#9AA5C9">· ' + n.vai + '</span><br>' +
      '<span class="rels"><span class="rel">Bạn ' + Math.round(n.ban) + '</span> <span class="rel">Mến ' + Math.round(n.yeu) + '</span> <span class="rel" style="color:' + ((n.tamTrang||'').includes('vui') ? '#6FE06A' : '#9AA5C9') + '">' + (n.tamTrang||'') + '</span></span></div>';
    d.onclick = () => moNpc(n.id);
    wrap.appendChild(d);
  }
}
// Portrait theo ĐÚNG giới tính + tuổi + nghề NPC:
// nu_01 bà già (Bà Tư, bà Hạnh cỡ tuổi), nu_02 cô công sở (Mai, Linh),
// nu_03 tạp dề teal (Thảo cà phê), nu_04 trung niên áo hoa (chị Hạnh hàng xóm),
// nu_05 áo trắng (Hoa sinh viên), nu_06 áo vàng (chị Đào xôi)
// char_0X (nam): Đức/Tuấn/Trung sếp+kỹ thuật, Hùng shipper (char_03 túi đeo),
// Nam game thủ (char_08 reo hò), Cụ Long/Ông Sáng già (char_06), người kể chuyện (char_07)
const PORTRAIT = {
  'Bà Tư': 'portrait/nu_01', 'Mai': 'portrait/nu_02', 'Linh': 'portrait/nu_02',
  'Thảo': 'portrait/nu_03', 'Hạnh': 'portrait/nu_04', 'Hoa': 'portrait/nu_05',
  'Chị Đào': 'portrait/nu_06', 'Bà Hạnh': 'portrait/nu_01',
  'Đức': 'meowa-r1/char_06', 'Tuấn': 'meowa-r1/char_06', 'Trung': 'meowa-r1/char_07',
  'Hùng': 'meowa-r1/char_03', 'Nam': 'meowa-r1/char_07',
  'Cụ Long': 'meowa-r1/char_06', 'Ông Sáng': 'meowa-r1/char_06',
};
function portraitCua(ten) { return (PORTRAIT[ten] || 'meowa-r1/char_07') + '.png'; }
function duongDanPortrait(ten) { return 'assets/' + portraitCua(ten); }

function moNpc(id) {
  const n = G.npc.find(x => x.id === id);
  if (!n) return;
  const box = document.getElementById('npc-chi-tiet');
  box.style.display = 'block';
  box.innerHTML = '<div class="panel" style="border-color:var(--vang)">' +
    '<div style="display:flex;gap:10px;align-items:center"><img src="assets/' + portraitCua(n.ten) + '" style="width:64px;height:64px;image-rendering:pixelated;border:2px solid var(--vien);background:#10152A">' +
    '<div><b style="color:var(--vang);font-size:15px">' + n.ten + '</b><br><span style="font-size:11px;color:#9AA5C9">' + n.vai + ' · ' + n.tinhCach + '</span><br>' +
    '<span style="font-size:11px;color:#8FD4C8">Bạn ' + Math.round(n.ban) + ' · Mến ' + Math.round(n.yeu) + ' · ' + (n.tamTrang||'') + '</span></div></div>' +
    NPC_HANH_DONG.map(hd => {
      const khoa = hd.dieuKienBan && n.ban < hd.dieuKienBan;
      return '<button class="hd-npc' + '' + '" ' + (khoa ? 'style="opacity:.45"' : '') + ' onclick="' + (khoa ? '' : 'lamVoiNpcUI(\'' + id + '\',\'' + hd.id + '\')') + '">' +
        hd.ten + (hd.tien ? ' <span style="color:var(--vang)">−' + (-hd.tien / 1000) + 'k</span>' : '') + ' <span style="color:#8FD4C8">' + dinhDangPhut(hd.phut) + '</span>' +
        (khoa ? '<span style="display:block;font-size:10px;color:var(--do)">🔒 Cần Bạn ≥ ' + hd.dieuKienBan + '</span>' : '') + '</button>';
    }).join('') +
    '<button class="hd-npc" style="margin-top:8px;background:#1A2040" onclick="document.getElementById(\'npc-chi-tiet\').style.display=\'none\'">← Quay lại</button></div>';
  document.getElementById('npc-list').style.display = 'none';
}
function lamVoiNpcUI(npcId, hdId) {
  const truoc = G.banGai;
  const kq = lamVoiNpc(G, npcId, hdId);
  if (!kq.ok) { hopThoai('Khoan đã', kq.lyDo); capNhatTatCa(); return; }
  const n = kq.npc;
  // khoảnh khắc thành đôi: SFX tình cảm + banner vàng (kiểu 9 To Life)
  if (!truoc && G.banGai && G.banGai.npcId === n.id) { playSfx('yeu'); toast('💕 <b>' + n.ten + '</b> nắm tay bạn — hai người chính thức thành đôi!'); }
  const camNhan = n.yeu >= 40 ? 'má hơi đỏ' : n.ban >= 40 ? 'cười tươi' : 'gật gù';
  hopThoai(n.ten, camNhan.charAt(0).toUpperCase() + camNhan.slice(1) + '. ' + n.ten + ' nhớ bạn đấy — tình cảm là thứ không mua được bằng deadline.');
  document.getElementById('npc-chi-tiet').style.display = 'none';
  document.getElementById('npc-list').style.display = 'flex';
  capNhatTatCa();
  kiemTraPhanUngQuest();
  kiemTraChet();
}

// ===== TOAST (banner vàng kiểu 9 To Life: trọn quest / thành đôi) =====
function toast(noI) {
  let el = document.getElementById('toast');
  if (!el) { el = document.createElement('div'); el.id = 'toast'; document.body.appendChild(el); }
  el.innerHTML = noI;
  el.classList.add('hi');
  if (toast._t) clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('hi'), 3500);
}

// ===== PHẢN ỨNG QUEST (SFX + toast khi việc/xong tăng — gọi sau capNhatQuest) =====
let qTruoc = { xong: 0, lanh: false };
function kiemTraPhanUngQuest() {
  if (!G || !G.questNgay) return;
  const q = G.questNgay;
  const xong = q.viec.filter(v => v.xong).length;
  if (xong > qTruoc.xong && q.viec.length > 1 && xong < q.viec.length) playSfx('coin', 0.35);
  if (q.daLanhHet && !qTruoc.lanh && xong === q.viec.length) {
    playSfx('coin', 0.7);
    toast('⭐ Trọn CẢ 3 việc hôm nay! +<b>' + q.thuongHet.toLocaleString('vi-VN') + 'đ</b> · +1 LP "' + G.dream.ten + '"');
  }
  qTruoc = { xong, lanh: !!q.daLanhHet };
}

// ===== HOẠT ĐỘNG =====
let suKienDaBao = '';
function bamHoatDong(id) {
  if (!G || G.daChet || PAUSE) return;
  const thangTruoc = G.thoiGian.thang;
  const kq = lamHoatDong(G, id);
  if (!kq.ok) { hopThoai('Khoan đã', kq.lyDo); capNhatTatCa(); return; }
  const h = kq.hoatDong;
  const tienTxt = h.tien > 0 ? ' (+' + h.tien.toLocaleString('vi-VN') + 'đ)' : h.tien < 0 ? ' (' + h.tien.toLocaleString('vi-VN') + 'đ)' : '';
  hopThoai(h.ten, h.moTa + tienTxt);
  capNhatTatCa();
  kiemTraPhanUngQuest();
  // đầu tháng → tiền trọ
  if (G.thoiGian.thang !== thangTruoc && G.thoiGian.ngay === 1) {
    const tt = xuLyTienThue(G);
    setTimeout(() => hopThoai('Bà Tư', tt.ok ? 'Tiền trọ tháng này đủ rồi. Bà gật gù: "con biết lo rồi đó".' : 'Thiếu tiền trọ rồi con. Bà cho đúng 5 ngày đó — liệu mà lo. Nợ ' + tt.no.toLocaleString('vi-VN') + 'đ.'), 1800);
  }
  chaySuKien();
  kiemTraChet();
  render();
}

function chaySuKien() {
  if (!G || G.daChet) return;
  const sk = kiemTraSuKien(G);
  const nn = sk.find(s => s.ngauNhien);
  if (nn) {
    const key = nn.id + '-' + G.thoiGian.ngay + '-' + G.thoiGian.gio;
    if (key !== suKienDaBao) {
      suKienDaBao = key;
      setTimeout(() => { hopThoai('⚡ ' + nn.ten, nn.thoai); capNhatTatCa(); kiemTraChet(); }, 1400);
    }
  }
}

// ===== KỸ NĂNG (tab SỐNG) =====
function capNhatKyNang() {
  const el = document.getElementById('ky-nang-list');
  if (!el || !G) return;
  el.innerHTML = Object.entries(G.kyNang).map(([k, v]) => {
    const cap = Math.floor(v);
    return '<div>' + tenKyNang(k) + ': <b style="color:var(--vang)">' + '★'.repeat(cap) + '☆'.repeat(5 - cap) + '</b> <span style="color:#9AA5C9">cấp ' + cap + '</span></div>';
  }).join('') +
    '<div style="margin-top:6px">Nghề: <b style="color:var(--vang)">' + G.nghe + '</b> · lương ca ' + G.luong.ca.toLocaleString('vi-VN') + 'đ</div>' +
    '<div>Tiền trọ: ' + G.phong.tienThue.toLocaleString('vi-VN') + 'đ/tháng' + (G.phong.conNo > 0 ? ' · <b style="color:var(--do)">đang nợ ' + G.phong.conNo.toLocaleString('vi-VN') + 'đ</b>' : '') + '</div>';
}
function capNhatDoi() {
  const el = document.getElementById('nhat-ky-list');
  if (!el || !G) return;
  const ds = G.diary.filter(d => d.loai !== 'quest_hook').slice(-14).reverse();
  el.innerHTML = ds.length ? ds.map(d => '<div>▫ <b>N' + d.ngay + '</b> ' + d.noiDung + '</div>').join('') : '<div>Nhật ký còn trống. Hãy sống đời đi đã.</div>';
  capNhatToday();
}
function capNhatMo() { capNhatDream(); }

// ===== CHẾT + VĂN BIA (màn tang lễ kiểu 9 To Life) =====
function kiemTraChet() {
  if (!G || !G.daChet) return;
  playSfx('chet'); bgmTat();
  const d = G.daChet;
  document.getElementById('vb-ten').textContent = d.ten.toUpperCase();
  document.getElementById('vb-nghe').textContent = '· ' + d.nghe.toUpperCase() + ' ·';
  document.getElementById('vb-tuoi').textContent = 'Hưởng dương ' + d.tuoi + ' tuổi — Ngày ' + d.ngay + ' tháng ' + d.thang;
  document.getElementById('vb-lydo').textContent = 'Mất vì ' + d.lyDo + '.';
  document.getElementById('vb-trich').textContent = '"' + d.vanBia + '"';
  document.getElementById('vb-bimat').textContent = d.biMat || '';
  document.getElementById('vb-nguoilai').textContent = d.nguoiOLai || '';
  document.getElementById('vb-khach').textContent = d.khachDu + ' người quen tới tiễn · ' + d.lp + ' LP dành dụm cho giấc mơ "' + G.dream.ten + '" chưa thành.';
  document.getElementById('van-bia').style.display = 'flex';
  // scene tang lễ trên canvas chính + copy sang canvas trong overlay (có sao lấp lánh động)
  doiSceneImLang('tang_le');
  const nguoiDuaTang = G.npc.filter(n => n.quanHe >= 40).slice(0, 6);
  if (nguoiDuaTang.length) {
    const ten = nguoiDuaTang[0].ten;
    setTimeout(() => hopThoai(ten, (d.chiTiet || d.lyDo) + '\n' + d.vanBia), 1400);
  }
  const cv = document.getElementById('cv-tang');
  const ctx2 = cv.getContext('2d');
  ctx2.imageSmoothingEnabled = false;
  const main = document.getElementById('man-choi');
  ctx2.drawImage(main, 0, 0);
  xoaSave();
}
function luuAnhTang() {
  // gộp canvas tang lễ + dòng epitaph thành ảnh tải về
  const cv = document.getElementById('cv-tang');
  const out = document.createElement('canvas');
  out.width = 320; out.height = 300;
  const o = out.getContext('2d');
  o.imageSmoothingEnabled = false;
  o.fillStyle = '#0B0916'; o.fillRect(0, 0, 320, 300);
  o.drawImage(cv, 0, 0);
  const d = G.daChet || {};
  o.fillStyle = '#F8D400'; o.font = 'bold 14px monospace'; o.textAlign = 'center';
  o.fillText((d.ten || '').toUpperCase(), 160, 262);
  o.fillStyle = '#C8C8D8'; o.font = '10px monospace';
  o.fillText('Mất vì ' + (d.lyDo || '') + ' · ' + (d.khachDu || 0) + ' người tới tiễn', 160, 280);
  o.fillStyle = '#8888A0'; o.font = '9px monospace';
  o.fillText('Cơm Bụi & Deadline — một đời đã sống', 160, 294);
  const a = document.createElement('a');
  a.href = out.toDataURL('image/png');
  a.download = 'tang-le-' + (d.ten || 'vo-danh') + '.png';
  a.click();
}

// ===== HỘP THOẠI (kiểu RPG xanh dương viền trắng của 9 To Life) =====
let hopThoaiTimer = null;
function hopThoai(nguoi, noiDung) {
  const box = document.getElementById('hop-thoai');
  box.style.display = 'block';
  const tenSach = nguoi.replace(/^⚡ /, '').replace(' chủ trọ', '').replace(' Bà Hạnh', '');
  const p = PORTRAIT[tenSach] || (tenSach.includes('Bà') ? 'portrait/nu_01' : (tenSach.includes('chị') || tenSach.includes('Chị') ? 'portrait/nu_04' : 'meowa-r1/char_07'));
  const img = p ? '<img class="pt" src="assets/' + (p.endsWith('.png') ? p : p + '.png') + '">' : '';
  box.innerHTML = img + '<span class="nguoi">' + nguoi + '</span><span class="noi-dung">' + noiDung.replace(/\n/g, '<br>') +
    '</span><br><span class="nut" onclick="dongHopThoai()">OK</span>';
  if (hopThoaiTimer) clearTimeout(hopThoaiTimer);
  hopThoaiTimer = setTimeout(dongHopThoai, 10000);
}
function dongHopThoai() {
  document.getElementById('hop-thoai').style.display = 'none';
  if (hopThoaiTimer) { clearTimeout(hopThoaiTimer); hopThoaiTimer = null; }
}

// ===== PAUSE / SAVE / RESET =====
function togglePause() {
  PAUSE = !PAUSE;
  document.getElementById('hud-pause').textContent = PAUSE ? '▶' : '‖';
  if (PAUSE) { hopThoai('Tạm dừng', 'Thời gian ngừng lại. Trà đá vẫn còn ấm.'); bgmTat(); } else bgmBat();
}
function luuVaBao() { if (!G) return; luuGame(G); hopThoai('💾 Đã lưu', 'Cuộc đời bạn được cất gọn vào máy này.'); }
function hoiLaiChoi() {
  xoaSave(); G = null;
  document.getElementById('van-bia').style.display = 'none';
  document.getElementById('menu').style.display = 'flex';
  kiemTraSaveMenu();
}
function kiemTraSaveMenu() {
  document.getElementById('btn-tiep-tuc').style.display = docGame() ? 'block' : 'none';
}

// ===== DI CHUYỂN NHANH (tab PHỐ) =====
function diChuyenNhanh(tenScene) {
  if (!G || G.daChet) return;
  if (typeof doiScene === 'function') doiScene(tenScene);
}

// ===== HOOK từ render8 =====
function sauKhiDoiScene(ten) {
  if (!G) return;
  capNhatHUD();
  capNhatActions();
}

// ===== THỜI GIAN TRÔI NHẸ (20s = 10 phút game) =====
setInterval(() => {
  if (!G || G.daChet || PAUSE) return;
  tienDo(G, 10);
  capNhatQuest(G);
  kiemTraPhanUngQuest();
  quayThoiTiet(G);
  capNhatTatCa();
  kiemTraChet();
}, 20000);
// loop vẽ liên tục: mưa rơi động + thoiTietAnhHuong ngoài trời
const NGOAI_TROI_SCENE = { pho_dem: true, bia_hoi: true };
setInterval(() => {
  if (!G || G.daChet) return;
  render(); // mưa chuyển động qua các tick render
}, 100);
setInterval(() => {
  if (!G || G.daChet || PAUSE) return;
  thoiTietAnhHuong(G, 4, NGOAI_TROI_SCENE[SCENE_HIEN]);
}, 20000);
setInterval(() => { if (G && !G.daChet) luuGame(G); }, 60000);

kiemTraSaveMenu();
