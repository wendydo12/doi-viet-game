// CƠM BỤI & DEADLINE — Backend core v3 (Phase 2: cấu trúc GIỐNG HỆT 9 To Life)
// 6 nhu cầu: com/nangLuong/vui/xaHoi/sachSe/sucKhoe — mood % phái sinh
// Quest ngày (3 việc + thưởng), Dream LP, kỹ năng khóa hoạt động, ca làm việc
// 100% logic thuần — không đụng DOM, test được bằng node

const THANH_PHO = {
  saigon: { ten: 'Sài Gòn', vung: 'nam', tiet: ['nắng gắt trưa', 'mưa ngập chiều', 'triều cường dâng'], mon: ['cơm tấm', 'hủ tiếu', 'bánh mì', 'cơm bụi'], mauChuDao: '#E8C46A' },
  hanoi:  { ten: 'Hà Nội',  vung: 'bac', tiet: ['rét đậm', 'mưa phùn', 'thu mát', 'nồm ẩm'], mon: ['phở', 'bún chả', 'bánh cuốn', 'bún đậu'], mauChuDao: '#C0392B' },
  danang: { ten: 'Đà Nẵng', vung: 'trung', tiet: ['nắng biển', 'mưa bão', 'gió biển mát'], mon: ['mì Quảng', 'bánh xèo', 'bún mắm', 'cơm gà'], mauChuDao: '#47857D' },
};

const NPC_GOC = [
  { id: 'linh', ten: 'Linh', vai: 'đồng nghiệp', tinhCach: 'nói nhiều, hay tám' },
  { id: 'tuan', ten: 'Tuấn', vai: 'đồng nghiệp', tinhCach: 'trầm, thích cà phê' },
  { id: 'ba_tu', ten: 'Bà Tư', vai: 'chủ trọ', tinhCach: 'cứng nhưng tốt bụng' },
  { id: 'hung', ten: 'Hùng', vai: 'anh shipper', tinhCach: 'vui, chạy xe nhanh' },
  { id: 'mai', ten: 'Mai', vai: 'bạn thân', tinhCach: 'ấm áp, hay rủ đi ăn' },
  { id: 'cu_long', ten: 'Cụ Long', vai: 'hàng xóm già', tinhCach: 'hay kể chuyện xưa' },
  { id: 'thao', ten: 'Thảo', vai: 'bán quán cà phê', tinhCach: 'mến khách, nhớ gu nước' },
  { id: 'duc', ten: 'Đức', vai: 'sếp', tinhCach: 'khó tính, hay deadline' },
  { id: 'hanh', ten: 'Hạnh', vai: 'bà tám hàng xóm', tinhCach: 'biết hết chuyện phố' },
  { id: 'nam', ten: 'Nam', vai: 'bạn thời đại học', tinhCach: 'hay rủ chơi game' },
  { id: 'chi_dao', ten: 'Chị Đào', vai: 'bán xôi sáng', tinhCach: 'vui tính, nhớ khách quen' },
  { id: 'trung', ten: 'Trung', vai: 'anh kỹ thuật', tinhCach: 'ít nói, sửa được mọi thứ' },
  { id: 'hoa', ten: 'Hoa', vai: 'con bà Tư', tinhCach: 'sinh viên, ráng học' },
  { id: 'ong_sang', ten: 'Ông Sáng', vai: 'bán báo già', tinhCach: 'yêu báo giấy' },
];

// ===== 6 NHU CẦU — ĐÚNG BỘ 9 TO LIFE (Food/Energy/Fun/Social/Clean/Health) =====
const NHU_CAU = {
  com:       { ten: 'Đồ ăn',     icon: '🍚', day: 'com' },
  nangLuong: { ten: 'Năng lượng', icon: '⚡', day: 'nangLuong' },
  vui:       { ten: 'Vui vẻ',    icon: '🎮', day: 'vui' },
  xaHoi:     { ten: 'Xã hội',    icon: '💬', day: 'xaHoi' },
  sachSe:    { ten: 'Sạch sẽ',   icon: '🚿', day: 'sachSe' },
  sucKhoe:   { ten: 'Sức khỏe',  icon: '❤️', day: 'sucKhoe' },
};

function taoNguoiChoi(tenThanhPho, tenNguoi) {
  const tp = THANH_PHO[tenThanhPho];
  if (!tp) throw new Error('Không biết thành phố: ' + tenThanhPho);
  return {
    phienBan: 3,
    ten: tenNguoi || 'Nhân',
    tuoi: 23,
    thanhPhoKey: tenThanhPho,
    thanhPho: { key: tenThanhPho, ...tp },
    thoiGian: { ngay: 1, thu: 2, gio: 6, phut: 0, tuan: 1, thang: 10, nam: 2026 },
    tien: 200_000,
    chiSo: { com: 67, nangLuong: 73, vui: 60, xaHoi: 53, sachSe: 73, sucKhoe: 100 },
    // NGHỀ + KỸ NĂNG (khóa hoạt động kiểu "Needs Cooking level 2")
    nghe: 'thực tập sinh',
    kyNang: { nauAn: 0, caPhe: 1, vanPhong: 1, giaoTiep: 1 },
    luong: { ca: 80_000 },
    caLam: { tu: 7.5, den: 17.5 }, // 7h30-17h30
    phong: { ten: 'phòng trọ 12m²', tienThue: 1_500_000, conNo: 0, ngayHanNo: 0 },
    // QUEST NGÀY (kiểu "today 0/3 ... all 3: +$50")
    questNgay: null,
    // DREAM (kiểu Mansion Life LP)
    dream: { ten: 'Nhà Mặt Phố', lp: 0, moTa: 'Từ phòng trọ 12m² tới căn nhà mặt phố của riêng mình.' },
    npc: NPC_GOC.map(n => ({ ...n, quanHe: 20, ban: 0, yeu: 0, tamTrang: 'bình thường' })),
    // THỜI TIẾT kiểu 9 To Life (icon mây/mưa trên HUD): nang — mua — nong
    thoiTiet: 'nang',
    // bạn gái/chàng trai (làm quen kiểu Flirt/Ask on a date → bạn thân + Mến ≥ 60 = người yêu)
    banGai: null, // { npcId, ngayChot }
    diary: [],
    songSot: { doi: 0, khat: 0, matNgu: 0 },
    daChet: null,
  };
}

const THU_VIET = { 2: 'thứ hai', 3: 'thứ ba', 4: 'thứ tư', 5: 'thứ năm', 6: 'thứ sáu', 7: 'thứ bảy', 8: 'chủ nhật' };

// ===== MOOD % phái sinh (kiểu "66% GOOD") =====
const MOOD_BAC = [
  { min: 85, txt: 'TUYỆT VỜI', mau: '#6FE06A' },
  { min: 65, txt: 'TỐT',       mau: '#9BD66A' },
  { min: 45, txt: 'ỔN',        mau: '#E8C46A' },
  { min: 25, txt: 'MỆT MỎI',   mau: '#E67E22' },
  { min: 0,  txt: 'KIỆT QUỆ',  mau: '#E2585E' },
];
function mood(state) {
  const c = state.chiSo;
  const v = Math.round((c.com + c.nangLuong + c.vui + c.xaHoi + c.sachSe + c.sucKhoe) / 6);
  const bac = MOOD_BAC.find(b => v >= b.min);
  return { pct: v, txt: bac.txt, mau: bac.mau };
}

// ===== THỜI GIAN =====
function tienTruoi(state, phut) {
  let { gio, phut: p, ngay, thu, tuan, thang, nam } = state.thoiGian;
  let total = gio * 60 + p + phut;
  while (total >= 1440) {
    total -= 1440; ngay += 1; thu = thu === 8 ? 2 : thu + 1;
    if (thu === 2) tuan += 1;
    if (ngay > 30) { ngay = 1; thang += 1; }
    if (thang > 12) { thang = 1; nam += 1; }
  }
  state.thoiGian = { ngay, thu, gio: Math.floor(total / 60), phut: total % 60, tuan, thang, nam };
  return state;
}

// ===== NHU CẦU TỤT (thức nhanh, ngủ chậm — sạch sẽ tụt chậm nhất) =====
function nhuCauTut(state, phut) {
  const h = phut / 60;
  const thuc = state.thoiGian.gio >= 6 && state.thoiGian.gio < 23;
  const heSo = thuc ? 1 : 0.4;
  const c = state.chiSo;
  c.com       = ket(c.com       - 1.0 * h * heSo);
  c.nangLuong = ket(c.nangLuong - (thuc ? 1.5 : -6) * h); // ngủ = hồi năng lượng
  c.vui       = ket(c.vui       - 0.8 * h * heSo);
  c.xaHoi     = ket(c.xaHoi     - (thuc ? 0.9 : 0.25) * h);
  c.sachSe    = ket(c.sachSe    - 0.5 * h * heSo);
  // sức khỏe: bị kéo xuống khi nhu cầu khác chạm đáy
  const day = [c.com, c.nangLuong, c.sachSe].filter(v => v < 15).length;
  c.sucKhoe   = ket(c.sucKhoe   - (day * 1.2) * h + (day === 0 && thuc ? -0.05 * h : 0));
  return state;
}
function ket(v) { return Math.max(0, Math.min(100, Math.round(v * 10) / 10)); }

function tienDo(state, phut) {
  if (state.daChet) return state;
  const ngayTruoc = state.thoiGian.ngay;
  tienTruoi(state, phut);
  nhuCauTut(state, phut);
  npcSong(state, phut);
  if (state.thoiGian.ngay !== ngayTruoc) {
    questMoi(state);      // ngày mới → quest mới
    kiemTraDay(state);
  }
  return state;
}

// ===== QUEST NGÀY — kiểu "today 0/3, all 3: +$50" =====
const QUEST_POOL = [
  { id: 'goi_dien',  ten: 'Gọi cho ai đó',        ktra: s => s.diary.some(d => d.quest === 'goi_dien' && d.ngay === s.thoiGian.ngay), thuong: 20_000 },
  { id: 'ra_pho',    ten: 'Ra phố đi dạo',        ktra: s => s.diary.some(d => d.quest === 'ra_pho' && d.ngay === s.thoiGian.ngay), thuong: 20_000 },
  { id: 'an_quan',   ten: 'Ăn một bữa ở quán',    ktra: s => s.diary.some(d => d.quest === 'an_quan' && d.ngay === s.thoiGian.ngay), thuong: 20_000 },
  { id: 'tra_da',    ten: 'Ngồi trà đá vỉa hè',   ktra: s => s.diary.some(d => d.quest === 'tra_da' && d.ngay === s.thoiGian.ngay), thuong: 15_000 },
  { id: 'di_lam',    ten: 'Đi làm trọn ca',       ktra: s => s.diary.some(d => d.quest === 'di_lam' && d.ngay === s.thoiGian.ngay), thuong: 15_000 },
  { id: 'tam_giat',  ten: 'Tắm giặt sạch sẽ',     ktra: s => s.diary.some(d => d.quest === 'tam_giat' && d.ngay === s.thoiGian.ngay), thuong: 10_000 },
  { id: 'choi_game', ten: 'Chơi game với Nam',    ktra: s => s.diary.some(d => d.quest === 'choi_game' && d.ngay === s.thoiGian.ngay), thuong: 10_000 },
  { id: 'xem_tivi',  ten: 'Xem tivi CRT',         ktra: s => s.diary.some(d => d.quest === 'xem_tivi' && d.ngay === s.thoiGian.ngay), thuong: 10_000 },
];
function questMoi(state) {
  // bốc 3 quest không trùng
  const pool = [...QUEST_POOL];
  const chon = [];
  while (chon.length < 3 && pool.length) {
    chon.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  state.questNgay = { ngay: state.thoiGian.ngay, viec: chon.map(q => ({ id: q.id, ten: q.ten, thuong: q.thuong, xong: false })), thuongHet: 50_000, daLanhHet: false };
}
function capNhatQuest(state) {
  if (!state.questNgay || state.questNgay.ngay !== state.thoiGian.ngay) questMoi(state);
  const q = state.questNgay;
  for (const v of q.viec) {
    if (v.xong) continue;
    const def = QUEST_POOL.find(x => x.id === v.id);
    if (def && def.ktra(state)) {
      v.xong = true;
      state.tien += v.thuong;
      ghiNhatKy(state, 'quest', 'Xong việc ngày: "' + v.ten + '" (+' + v.thuong.toLocaleString('vi-VN') + 'đ)');
    }
  }
  const xongHet = q.viec.every(v => v.xong);
  if (xongHet && !q.daLanhHet) {
    q.daLanhHet = true;
    state.tien += q.thuongHet;
    state.dream.lp += 1; // mỗi ngày trọn quest = +1 LP giấc mơ
    ghiNhatKy(state, 'quest', 'Hoàn thành CẢ 3 việc ngày! (+' + q.thuongHet.toLocaleString('vi-VN') + 'đ, +1 LP "' + state.dream.ten + '")');
  }
  return q;
}

// ===== HOẠT ĐỘNG — cấu trúc row 9 To Life: tên + icon↑↓ + chip tiền + chip giờ, có KHÓA =====
const HOAT_DONG = [
  { id: 'an_com_bui',  ten: 'Ăn cơm bụi đầu hẻm', phut: 30, tien: -25_000, chiSo: { com: +35, vui: +5, sachSe: -5 }, quest: 'an_quan', scene: ['phong_tro', 'pho_dem'], moTa: 'Cơm sườn bì chả thêm trứng, kèm chén canh.' },
  { id: 'an_quan_pho', ten: 'Ăn tô phở quen',     phut: 40, tien: -40_000, chiSo: { com: +45, vui: +8 }, quest: 'an_quan', scene: ['quan_pho'], moTa: 'Bà Hạnh nhớ mặt: "như cũ hả con?"' },
  { id: 'tra_da_via_he', ten: 'Trà đá vỉa hè',    phut: 15, tien: -3_000,  chiSo: { xaHoi: +10, vui: +6 }, quest: 'tra_da', scene: ['pho_dem', 'quan_pho'], moTa: '3 ngàn một cốc, ngắm phố chảy qua.' },
  { id: 'ca_phe_sua',  ten: 'Cà phê sữa đá',      phut: 20, tien: -15_000, chiSo: { nangLuong: +12, vui: +8, xaHoi: +4 }, scene: ['pho_dem', 'van_phong'], moTa: 'Tỉnh táo 2 tiếng, tim đập nhanh 3 tiếng.' },
  { id: 'di_lam',      ten: 'Đi làm trọn ca',     phut: 480, tien: +80_000, chiSo: { nangLuong: -30, com: -25, vui: -12, sachSe: -15 }, quest: 'di_lam', scene: ['van_phong'], dieuKien: 'ngayLamViec', moTa: 'Chấm công, họp hành, deadline.' },
  { id: 'lam_them_gio', ten: 'Nán lại tăng ca',   phut: 180, tien: +50_000, chiSo: { nangLuong: -25, vui: -20, com: -12 }, scene: ['van_phong'], dieuKien: 'ngayLamViec', moTa: 'Sếp Đức: "anh ghi nhận nỗ lực của em".' },
  { id: 'ngu_trua',    ten: 'Ngủ trưa một giấc',  phut: 60,  tien: 0, chiSo: { nangLuong: +20 }, scene: ['phong_tro', 'van_phong'], moTa: 'Gục xuống bàn 1 tiếng, mơ thấy lương về.' },
  { id: 'ngu_dem',     ten: 'Ngủ một đêm',        phut: 420, tien: 0, chiSo: { nangLuong: 100, sucKhoe: +5 }, scene: ['phong_tro'], dieuKien: 'banDem', moTa: 'Tắt điện thoại. Giấc ngủ không deadline.' },
  { id: 'tam_giat',    ten: 'Tắm giặt',           phut: 30,  tien: 0, chiSo: { sachSe: +55, vui: +5, nangLuong: +5 }, quest: 'tam_giat', scene: ['phong_tro'], moTa: 'Nước máy lạnh — tỉnh cả người.' },
  { id: 'tam_su_ban',  ten: 'Tám chuyện với bạn', phut: 45,  tien: 0, chiSo: { xaHoi: +30, vui: +15, nangLuong: -5 }, scene: ['phong_tro', 'pho_dem', 'quan_pho'], moTa: 'Chuyện trên trời dưới đất, hết buồn luôn.' },
  { id: 'goi_ve_nha',  ten: 'Gọi điện về cho má', phut: 30,  tien: 0, chiSo: { xaHoi: +15, vui: +12, sucKhoe: +3 }, quest: 'goi_dien', scene: ['phong_tro'], moTa: 'Má hỏi: "ăn uống đầy đủ không con?" — Ừa má.' },
  { id: 'xem_tivi',    ten: 'Xem tivi CRT',       phut: 60,  tien: 0, chiSo: { vui: +18, nangLuong: -5, sachSe: -3 }, quest: 'xem_tivi', scene: ['phong_tro'], moTa: 'Phim cũ chiếu lại, quảng cáo vẫn hay.' },
  { id: 'di_dao',      ten: 'Đi dạo phố',         phut: 45,  tien: 0, chiSo: { vui: +15, xaHoi: +10, sucKhoe: +6, nangLuong: -8 }, quest: 'ra_pho', scene: ['pho_dem'], moTa: 'Gió đêm, mùi hủ tiếu gõ, xe máy chảy như sông.' },
  { id: 'choi_game',   ten: 'Chơi game với Nam',  phut: 90,  tien: 0, chiSo: { vui: +28, xaHoi: +15, nangLuong: -12, com: -8 }, quest: 'choi_game', scene: ['phong_tro'], moTa: 'Nam gào trong voice: "đẩy trụ đi bạn êi!"' },
  { id: 'di_cho',      ten: 'Đi chợ mua đồ',      phut: 60,  tien: -50_000, chiSo: { com: +25, vui: +8, nangLuong: -8, sachSe: -5 }, scene: ['pho_dem'], moTa: 'Rau trứng mì gói — tủ lạnh hết trống trải.' },
  { id: 'nau_an',      ten: 'Nấu bữa tử tế',      phut: 60,  tien: -30_000, chiSo: { com: +50, vui: +10, sachSe: -10 }, khoa: { kyNang: 'nauAn', cap: 2 }, moTa: 'Món nhà làm — má dạy mà chưa thuộc.', scene: ['phong_tro'] },
  { id: 'tap_the_duc', ten: 'Chạy bộ công viên',  phut: 45,  tien: 0, chiSo: { sucKhoe: +12, nangLuong: -15, sachSe: -20, vui: +5 }, scene: ['pho_dem'], moTa: 'Sáng sớm hít thở — né ổ gà và xe buýt.' },
  // ===== QUÁN BIA HƠI (tụ bạn nhậu kiểu 9 To Life at Bar) =====
  { id: 'nhom_bia',     ten: 'Nhậu bia hơi với bạn',  phut: 120, tien: -80_000, chiSo: { xaHoi: +30, vui: +25, com: +15, nangLuong: -15, sachSe: -15, sucKhoe: -8 }, quest: 'ra_pho', scene: ['bia_hoi'], moTa: 'Đĩa đậu luộc lạc rang, cạn chai ngàn — chuyện công sở tụt hết.' },
  { id: 'nghe_gossip',  ten: 'Nghe buôn chuyện',      phut: 30,  tien: -20_000, chiSo: { xaHoi: +15, vui: +18, nangLuong: -6 }, scene: ['bia_hoi'], moTa: 'Cả bàn bắt đầu câu chuyện "này nhớ đừng kể ai".' },
  { id: 'ca_nuong',     ten: 'Gọi thêm đĩa cá nướng', phut: 45,  tien: -120_000, chiSo: { com: +30, xaHoi: +10, vui: +12, nangLuong: -8 }, scene: ['bia_hoi'], khoa: { kyNang: 'giaoTiep', cap: 2 }, moTa: 'Cá nướng giấy bạc, chanh ớt — phải quen chủ quán mới được kêu.' },
];

function hoatDongKhaDung(state, sceneHien) {
  const ra = [];
  for (const h of HOAT_DONG) {
    if (!h.scene.includes(sceneHien)) continue;
    const row = { ...h, khoaLyDo: null };
    if (h.dieuKien === 'ngayLamViec') {
      const t = state.thoiGian;
      if (!(t.thu >= 2 && t.thu <= 6)) row.khoaLyDo = 'Chỉ ngày thường (thứ 2 → thứ 6).';
      else if (t.gio < state.caLam.tu || t.gio > state.caLam.den) row.khoaLyDo = 'Ngoài ca làm (7h30–17h30).';
    }
    if (h.dieuKien === 'banDem') {
      const g = state.thoiGian.gio;
      if (g >= 5 && g < 21) row.khoaLyDo = 'Chưa tới giờ ngủ (sau 21h).';
    }
    if (h.khoa && state.kyNang[h.khoa.kyNang] < h.khoa.cap) {
      row.khoaLyDo = 'Cần kỹ năng ' + tenKyNang(h.khoa.kyNang) + ' cấp ' + h.khoa.cap + '.';
    }
    if (h.tien < 0 && state.tien < -h.tien) row.khoaLyDo = 'Không đủ tiền.';
    ra.push(row);
  }
  return ra;
}
const TEN_KY_NANG = { nauAn: 'Nấu ăn', caPhe: 'Pha chế', vanPhong: 'Văn phòng', giaoTiep: 'Giao tiếp' };
function tenKyNang(k) { return TEN_KY_NANG[k] || k; }

function lamHoatDong(state, id) {
  const h = HOAT_DONG.find(x => x.id === id);
  if (!h) throw new Error('Hoạt động lạ: ' + id);
  const khaDung = hoatDongKhaDung(state, h.scene[0]).find(r => r.id === id);
  // kiểm tra lại điều kiện từ chính state thật (scene hiện tại do UI truyền)
  if (h.dieuKien === 'ngayLamViec') {
    const t = state.thoiGian;
    if (t.thu === 7 || t.thu === 8) return { ok: false, lyDo: 'Cuối tuần mà! Văn phòng đóng cửa.' };
    if (t.gio < state.caLam.tu || t.gio > state.caLam.den) return { ok: false, lyDo: 'Ngoài ca làm.' };
  }
  if (h.dieuKien === 'banDem') {
    const g = state.thoiGian.gio;
    if (g >= 5 && g < 21) return { ok: false, lyDo: 'Giờ này ai lại đi ngủ?' };
  }
  if (h.khoa && state.kyNang[h.khoa.kyNang] < h.khoa.cap) {
    return { ok: false, lyDo: 'Cần kỹ năng ' + tenKyNang(h.khoa.kyNang) + ' cấp ' + h.khoa.cap + ' — đi làm rồi học thêm đã.' };
  }
  if (h.tien < 0 && state.tien < -h.tien) return { ok: false, lyDo: 'Tiền không đủ — túi lép rồi.' };

  state.tien += h.tien;
  apDungChiSo(state, h.chiSo);
  if (h.chiSo.xaHoi >= 10) {
    const ban = state.npc[Math.floor(Math.random() * state.npc.length)];
    ban.quanHe = Math.min(100, ban.quanHe + 5);
    ban.ban = Math.min(100, ban.ban + 2);
    ghiNhatKy(state, 'quan_he', 'Nói chuyện vui với ' + ban.ten + ' (+5 thân thiết).');
  }
  // kỹ năng tăng khi dùng
  if (h.id === 'di_lam' || h.id === 'lam_them_gio') state.kyNang.vanPhong = Math.min(5, state.kyNang.vanPhong + 0.2);
  if (h.id === 'tam_su_ban' || h.id === 'goi_ve_nha') state.kyNang.giaoTiep = Math.min(5, state.kyNang.giaoTiep + 0.2);
  if (h.id === 'ca_phe_sua') state.kyNang.caPhe = Math.min(5, state.kyNang.caPhe + 0.1);
  // quest hook
  if (h.quest) ghiNhatKyQuest(state, h.quest, h.ten);
  tienDo(state, h.phut);
  capNhatQuest(state);
  ghiNhatKy(state, 'hoat_dong', state.ten + ' dành ' + dinhDangPhut(h.phut) + ': ' + h.ten + '. ' + h.moTa);
  return { ok: true, hoatDong: h };
}
function ghiNhatKyQuest(state, questId, ten) {
  state.diary.push({ ngay: state.thoiGian.ngay, loai: 'quest_hook', quest: questId, noiDung: ten });
}

function dinhDangPhut(p) {
  if (p >= 60) { const h = Math.floor(p / 60), m = p % 60; return m ? h + 'h' + m + 'm' : h + 'h'; }
  return p + 'm';
}

function ghiNhatKy(state, loai, noiDung) {
  state.diary.push({ ngay: state.thoiGian.ngay, thu: state.thoiGian.thu, loai, noiDung });
  if (state.diary.length > 80) state.diary = state.diary.slice(-80);
}

// ===== CHẾT + VĂN BIA (9 To Life v0.5: "you get old now. and you can die. a lot...") =====
function kiemTraDay(state) {
  const c = state.chiSo;
  state.songSot.doi    = c.com <= 0 ? state.songSot.doi + 1 : 0;
  state.songSot.matNgu = c.nangLuong <= 0 ? state.songSot.matNgu + 1 : 0;
  state.songSot.khat   = c.sucKhoe <= 0 ? 2 : 0; // sức khỏe cạn = nguy kịch luôn
  if (c.sucKhoe <= 0) return chet(state, 'kiệt sức', 'Sức khỏe chạm đáy nhiều ngày liền.');
  if (state.songSot.doi >= 2) return chet(state, 'đói lả giữa mùa deadline', 'Nhịn ăn 2 ngày để kịp tiến độ. Tiến độ không kịp người.');
  if (state.songSot.matNgu >= 3) return chet(state, 'gục trên bàn phím', 'Ba đêm trắng liên tiếp. Laptop vẫn mở, người đã tắt.');
  return state;
}

function chet(state, lyDo, chiTiet) {
  const khach = state.npc.filter(n => n.quanHe >= 40).length;
  const mauVanBia = [
    'Từng muốn sống chậm lại. Chưa kịp.',
    'Sổ tay còn ghi: "tuần sau nghỉ ngơi một bữa".',
    'Tin nhắn cuối: "mai mình cà phê nhé". Không có mai.',
    'Đồng nghiệp nói: "nó còn nợ mình chầu trà đá".',
  ];
  state.daChet = {
    ngay: state.thoiGian.ngay, thang: state.thoiGian.thang,
    lyDo, chiTiet,
    vanBia: mauVanBia[Math.floor(Math.random() * mauVanBia.length)],
    khachDu: khach, nghe: state.nghe, tuoi: state.tuoi, ten: state.ten,
    lp: state.dream.lp,
  };
  return state;
}

// ===== THỜI TIẾT (kiểu icon mây/mưa trên HUD của 9 To Life) =====
// 'nang' — 'may' — 'mua' — 'nong' — 'ret' (trời lạnh Hà Nội)
const THOI_TIET_MO_TA = {
  nang: 'Trời nắng vàng, như quên mất deadline.',
  may: 'Mây râm, gió hiu quất — thời tiết để đi dạo.',
  mua: 'Mưa rơi tí tách, mặt đường ướt loang loáng.',
  nong: 'Nắng thiêu xăng dầu — đến quạt máy cũng đuối.',
  ret: 'Trời lạnh cắn da, hơi thở khói.',
};
function quayThoiTiet(state) {
  const tp = state.thanhPhoKey;
  const r = Math.random();
  let t = 'nang';
  if (tp === 'hanoi') {
    // Hà Nội: 4 mùa linh tinh, hay mưa và trở lạnh
    t = r < 0.35 ? 'nang' : r < 0.55 ? 'may' : r < 0.72 ? 'mua' : r < 0.85 ? 'ret' : 'nong';
  } else if (tp === 'danang') {
    // Đà Nẵng: nắng nhiều, mưa lũ tháng cuối năm
    t = r < 0.55 ? 'nang' : r < 0.75 ? 'nong' : 'mua';
  } else {
    // Sài Gòn: nắng nóng + mù mưa chiều
    t = r < 0.45 ? 'nong' : r < 0.65 ? 'nang' : r < 0.85 ? 'may' : 'mua';
  }
  if (t !== state.thoiTiet) {
    state.thoiTiet = t;
    ghiNhatKy(state, 'thoi_tiet', THOI_TIET_MO_TA[t]);
  }
  return state;
}
// Mưa ảnh hưởng: đi bộ ngoài đường ướt, sạch sẽ tụt nhanh, vui giảm nếu không có ô
function thoiTietAnhHuong(state, phut, sceneNgoaiTroi) {
  if (!sceneNgoaiTroi) return state;
  const h = phut / 60;
  if (state.thoiTiet === 'mua') {
    apDungChiSo(state, { sachSe: -3 * h, vui: -2 * h, nangLuong: -1 * h });
  } else if (state.thoiTiet === 'nong') {
    apDungChiSo(state, { nangLuong: -2.5 * h, com: -1.5 * h });
  } else if (state.thoiTiet === 'ret') {
    apDungChiSo(state, { nangLuong: -1.5 * h });
  }
  return state;
}

// ===== SỰ KIỆN VIỆT =====
const SU_KIEN_VIET = [
  { id: 'ket_xe', ten: 'Kẹt xe', xacSuat: 0.10, chiSo: { nangLuong: -8, vui: -10 }, thoai: 'Đường kẹt cứng 40 phút. Một chú Grab vẫn cười: "kệ, sống chung với lũ em ơi".' },
  { id: 'cup_dien', ten: 'Cúp điện', xacSuat: 0.07, chiSo: { vui: -12, sachSe: -8 }, thoai: 'Cúp điện đúng lúc deadline gần kề. Cả xóm trọ kéo ra hành lang hóng gió.' },
  { id: 'mua_ngap', ten: 'Mưa ngập', xacSuat: 0.08, chiSo: { nangLuong: -10, sachSe: -25, vui: -6 }, thoai: 'Mưa ập xuống, nước ngập nửa bánh xe. Dép trôi một chiếc.' },
  { id: 'duoc_khen', ten: 'Sếp khen', xacSuat: 0.06, chiSo: { vui: +15, sucKhoe: +3 }, thoai: 'Sếp Đức hiếm hoi mỉm cười: "báo cáo của em ổn đấy".' },
  { id: 'ba_tu_thu', ten: 'Bà Tư hỏi tiền', xacSuat: 0.05, chiSo: { vui: -8 }, thoai: 'Bà Tư gõ cửa nhắc tiền nước — tay thì đưa thêm bịch cam.' },
  { id: 've_so', ten: 'Trúng vé số', xacSuat: 0.02, chiSo: { vui: +20 }, tien: +100_000, thoai: 'Ông Sáng dúi tờ vé ế. Chiều dò: trúng 100 ngàn!' },
  { id: 'me_goi', ten: 'Má gọi', xacSuat: 0.06, chiSo: { vui: +15, xaHoi: +8, sucKhoe: +3 }, thoai: 'Má: "ngoài đó lạnh không con, nhớ mặc áo khoác".' },
  { id: 'cam_cum', ten: 'Trái gió trở trời', xacSuat: 0.05, chiSo: { sucKhoe: -15, nangLuong: -10 }, thoai: 'Hắt hơi sổ mũi — mùa này ai cũng dính. Uống nước ấm vào.' },
  { id: 'mua_to', ten: 'Dông bất chợt', xacSuat: 0.06, chiSo: { sachSe: -15, vui: -4 }, thoai: 'Dông ập xuống bất chợt, ai cũng chạy tìm mái hiên. Một ông tài xế vẫn từ tốn đắp bạt xe.' },
  { id: 'nghe_ban_gai', ten: 'Tin đồn tình ái', xacSuat: 0.04, chiSo: { vui: +8, xaHoi: +5 }, thoai: 'Lão Chương tám: "nghe đồn ông ở chung với người yêu rồi ha?" — mặt đỏ như gạch nung.' },
];

// Gossip kiểu 9 To Life "word gets around" — NPC buôn chuyện với nhau qua tin nhắn
const GOSSIP = [
  'Bà Tư khoe con gà ta nhà bà ủ lá chanh thơm lắm',
  'ông Sáng lại giơ tờ vé số ế khoe "mai đổi đời"',
  'chị Đào dọn xôi sáng giờ không kịp úp nồi xôi',
  'Linh bảo sếp Đức giờ đã học gọi tên đồng nghiệp',
  'đám ở phòng 404 khuya 3h vẫn hát karaoke',
  'Mai mới đổi kiểu tóc — nửa quán nhắn tin hỏi nhau',
];

function kiemTraSuKien(state) {
  const sk = [];
  const { thu, gio, ngay } = state.thoiGian;
  if (Math.random() < 0.35) {
    const r = Math.random(); let cong = 0;
    for (const s of SU_KIEN_VIET) {
      cong += s.xacSuat;
      if (r < cong) {
        apDungChiSo(state, s.chiSo);
        if (s.tien) state.tien += s.tien;
        if (s.chiSo.sucKhoe <= -15 && Math.random() < 0.5) state.songSot.khat = 0; // ốm nhẹ chưa nguy
        ghiNhatKy(state, 'su_kien', s.ten + ': ' + s.thoai);
        sk.push({ id: s.id, ten: s.ten, thoai: s.thoai, ngauNhien: true });
        break;
      }
    }
  }
  if (ngay === 1 && gio >= 6 && gio <= 9) sk.push({ id: 'tien_thue', ten: 'Đầu tháng — tiền trọ ' + state.phong.tienThue.toLocaleString('vi-VN') + 'đ' });
  return sk;
}

function xuLyTienThue(state) {
  const thue = state.phong.tienThue;
  if (state.tien >= thue) {
    state.tien -= thue;
    ghiNhatKy(state, 'tien_thue', 'Đóng tiền trọ ' + thue.toLocaleString('vi-VN') + 'đ. Bà Tư gật gù: "con biết lo rồi đó".');
    return { ok: true };
  }
  // Giống 9 To Life: "Forget rent and the landlord gives you five days"
  state.phong.conNo += thue - state.tien;
  state.phong.ngayHanNo = state.thoiGian.ngay + 5;
  state.tien = 0;
  apDungChiSo(state, { vui: -15 });
  ghiNhatKy(state, 'tien_thue', 'Không đủ tiền trọ. Bà Tư hẹn đúng 5 ngày: "liệu đó con". Nợ ' + state.phong.conNo.toLocaleString('vi-VN') + 'đ.');
  return { ok: false, no: state.phong.conNo, han: state.phong.ngayHanNo };
}

// ===== NPC =====
function npcSong(state, phut) {
  const bien = ['đang bận', 'đi làm', 'vui vẻ', 'buồn ngủ', 'đi chợ', 'đang tám', 'nuôi cún con', 'mệt vì tăng ca'];
  for (const n of state.npc) {
    if (Math.random() < 0.04) n.tamTrang = bien[Math.floor(Math.random() * bien.length)];
    if (Math.random() < 0.003) {
      state.diary.push({ ngay: state.thoiGian.ngay, nguoi: n.ten, loai: 'tin_nhan', noiDung: n.ten + ' nhắn: "' + tinNhanNgauNhien(n) + '"' });
      if (n.quanHe >= 40) apDungChiSo(state, { xaHoi: +4, vui: +3 });
    }
    if (Math.random() < 0.002) n.quanHe = Math.max(0, n.quanHe - 1);
  }
}

function tinNhanNgauNhien(n) {
  const mau = {
    mai: ['Chiều nay ăn lẩu không?', 'Lương về chưa vậy?', 'Cuối tuần đi cà phê bệt nha'],
    ba_tu: ['Nhớ đóng tiền nước nha con', 'Tối nhớ khóa cổng'],
    hung: ['Ship đơn gấp lắm, chạy quá trời', 'Bữa nào rảnh làm ly cà phê'],
    linh: ['Sếp kêu nộp report rùi huhu', 'Café không bạn êi?'],
    duc: ['Deadline thứ 5 nhớ nhớ nhớ', 'Gửi anh file trước 17h'],
    cu_long: ['Đánh cờ không cháu?', 'Trà sen mới pha, sang chơi'],
    nam: ['Tối nay leo rank không?', 'Game mới ra, hay lắm'],
    thao: ['Cà phê như cũ nha?', 'Quán mới có bàn ngoài hiên mát lắm'],
    hoa: ['Em thi giữa kỳ xong rồi!'],
    chi_dao: ['Mai ghé ăn xôi nha, có xôi mặn mới'],
    ong_sang: ['Báo sáng nay có tin hay'],
    hanh: ['Nghe nói cuối hẻm mới mở quán bún'],
    trung: ['Máy bạn chậm thì đưa mình xem'],
    tuan: ['Cà phê sáng không?'],
  };
  const list = mau[n.id] || ['Dạo này sao rồi?'];
  return list[Math.floor(Math.random() * list.length)];
}

function apDungChiSo(state, chg) {
  for (const [k, v] of Object.entries(chg || {})) {
    if (k in state.chiSo) state.chiSo[k] = v === 100 ? 100 : ket(state.chiSo[k] + v);
  }
  return state;
}

// ===== HÀNH ĐỘNG VỚI NPC (kiểu Apologize/Chat/Give a gift/Flirt) =====
const NPC_HANH_DONG = [
  { id: 'tro_chuyen', ten: 'Trò chuyện', tien: 0, phut: 20, ban: +6, yeu: 0, vui: +8, xaHoi: +12 },
  { id: 'moi_nuoc',   ten: 'Mời ly trà đá', tien: -5_000, phut: 15, ban: +9, yeu: +2, vui: +6, xaHoi: +10 },
  { id: 'tang_qua',   ten: 'Tặng quà', tien: -30_000, phut: 10, ban: +14, yeu: +6, vui: +10, xaHoi: +5 },
  { id: 'tha_thinh',  ten: 'Thả thính', tien: 0, phut: 15, ban: +2, yeu: +8, vui: +12, xaHoi: +8, dieuKienBan: 50 },
  { id: 'moi_hen_ho', ten: 'Rủ đi ăn tối', tien: -80_000, phut: 120, ban: +8, yeu: +15, vui: +20, xaHoi: +15, dieuKienBan: 60 },
];
function lamVoiNpc(state, npcId, hanhDongId) {
  const n = state.npc.find(x => x.id === npcId);
  if (!n) throw new Error('NPC lạ: ' + npcId);
  const hd = NPC_HANH_DONG.find(x => x.id === hanhDongId);
  if (!hd) throw new Error('Hành động lạ: ' + hanhDongId);
  if (hd.tien < 0 && state.tien < -hd.tien) return { ok: false, lyDo: 'Tiền không đủ.' };
  if (hd.dieuKienBan && n.ban < hd.dieuKienBan) return { ok: false, lyDo: n.ten + ' chưa đủ thân (' + Math.round(n.ban) + '/' + hd.dieuKienBan + ' Bạn).' };
  state.tien += hd.tien;
  n.ban = Math.min(100, n.ban + hd.ban);
  n.yeu = Math.min(100, n.yeu + hd.yeu);
  n.quanHe = Math.round((n.ban + n.yeu) / 2);
  apDungChiSo(state, { vui: hd.vui, xaHoi: hd.xaHoi });
  tienDo(state, hd.phut);
  capNhatQuest(state);
  ghiNhatKy(state, 'npc', hd.ten + ' với ' + n.ten + ' — ' + n.ten + ' có vẻ ' + (hd.yeu >= 8 ? 'cảm động' : 'vui hơn') + '.');
  // ===== TÌNH YEU: bạn thân + Mến ≥ 60 → tỏ tình tự động thành người yêu (kiểu Ask on a date)
  if (hd.id === 'moi_hen_ho' && n.ban >= 60 && n.yeu >= 60) {
    if (!state.banGai) {
      state.banGai = { npcId: n.id, ngayChot: state.thoiGian.ngay };
      n.tamTrang = 'đang yêu';
      apDungChiSo(state, { vui: +25, xaHoi: +15 });
      ghiNhatKy(state, 'tinh_yeu', 'Sau bữa ăn tối, ' + n.ten + ' nắm tay bạn: "mình đi với nhau nha". Cả hai chính thức thành người yêu 💕');
    }
  }
  // gossip ngẫu nhiên khi chat ở quán
  if (hd.id === 'tro_chuyen' && Math.random() < 0.4) {
    const g = GOSSIP[Math.floor(Math.random() * GOSSIP.length)];
    ghiNhatKy(state, 'gossip', 'Chuyện bên bàn: ' + g + '.');
  }
  return { ok: true, npc: n };
}

// ===== SAVE / LOAD =====
const SAVE_KEY = '***';
function luuGame(state) {
  const duLieu = JSON.stringify({ phienBan: 3, luuLuc: Date.now(), state });
  if (typeof localStorage !== 'undefined') localStorage.setItem(SAVE_KEY, duLieu);
  return duLieu;
}
function docGame() {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    const d = JSON.parse(raw);
    if (!d || d.phienBan !== 3 || !d.state) return null;
    return d.state;
  } catch { return null; }
}
function xoaSave() { if (typeof localStorage !== 'undefined') localStorage.removeItem(SAVE_KEY); }

// ==== TESTS ====
function chayTest() {
  const kq = [];
  const t = (ten, fn) => { try { fn(); kq.push(['PASS', ten]); } catch (e) { kq.push(['FAIL', ten + ' — ' + e.message]); } };
  const eq = (a, b, msg) => { if (a !== b) throw new Error((msg || '') + ' (' + a + ' ≠ ' + b + ')'); };

  let s = taoNguoiChoi('saigon');
  t('Tạo người chơi + 6 nhu cầu đúng bộ 9 To Life', () => {
    eq(Object.keys(s.chiSo).length, 6, 'so nhu cau');
    ['com','nangLuong','vui','xaHoi','sachSe','sucKhoe'].forEach(k => { if (!(k in s.chiSo)) throw new Error('thiếu ' + k); });
  });
  t('Mood % phái sinh + bậc chữ', () => {
    const m = mood(s);
    if (m.pct < 0 || m.pct > 100) throw new Error('pct lạ');
    if (!m.txt) throw new Error('thiếu chữ mood');
  });
  t('14 NPC khởi tạo', () => eq(s.npc.length, 14, 'npc'));
  t('Quest ngày: mới chơi có quest 3 việc + thưởng hết 50k', () => {
    capNhatQuest(s);
    eq(s.questNgay.viec.length, 3, 'so viec');
    eq(s.questNgay.thuongHet, 50_000, 'thuong het');
  });
  t('Quest hook: ăn cơm bụi → quest "Ăn một bữa ở quán" xong + tiền thưởng', () => {
    const tienTruoc = s.tien;
    lamHoatDong(s, 'an_com_bui');
    capNhatQuest(s);
    const q = s.questNgay.viec.find(v => v.id === 'an_quan');
    if (q && !q.xong) throw new Error('quest chưa xong dù đã ăn quán');
  });
  t('Hoạt động bị KHÓA bởi kỹ năng (nấu ăn cấp 2)', () => {
    const list = hoatDongKhaDung(s, 'phong_tro');
    const nau = list.find(h => h.id === 'nau_an');
    if (!nau) throw new Error('thiếu nấu ăn trong list');
    if (!nau.khoaLyDo) throw new Error('nấu ăn không bị khóa khi kỹ năng 0');
    const kq2 = lamHoatDong(s, 'nau_an');
    if (kq2.ok) throw new Error('vẫn cho nấu khi chưa đủ kỹ năng');
  });
  t('Mở khóa kỹ năng → nấu được', () => {
    s.kyNang.nauAn = 2;
    s.tien = 500_000;
    const kq3 = lamHoatDong(s, 'nau_an');
    if (!kq3.ok) throw new Error('fail: ' + kq3.lyDo);
  });
  t('Đi làm đúng ca: +80k, trôi 8h', () => {
    const s7 = taoNguoiChoi('saigon');
    s7.thoiGian = { ngay: 2, thu: 3, gio: 8, phut: 0, tuan: 1, thang: 10, nam: 2026 };
    // Cố định quest ngày = việc KHÔNG thể xong qua di_lam → test deterministic
    // (trước: questMoi bốc ngẫu nhiên, 37.5% rơi đúng quest 'di_lam' → +15k → flaky)
    s7.questNgay = { ngay: 2, viec: [{ id: 'tam_giat', ten: 'Tắm giặt sạch sẽ', thuong: 10_000, xong: false }], thuongHet: 50_000, daLanhHet: false };
    const t0 = s7.tien;
    const kq7 = lamHoatDong(s7, 'di_lam');
    if (!kq7.ok) throw new Error('fail: ' + kq7.lyDo);
    eq(s7.tien, t0 + 80_000, 'lương');
  });
  t('Ngủ đêm hồi 100 năng lượng', () => {
    const s8 = taoNguoiChoi('hanoi');
    s8.thoiGian.gio = 22; s8.chiSo.nangLuong = 20;
    lamHoatDong(s8, 'ngu_dem');
    if (s8.chiSo.nangLuong < 90) throw new Error('NL = ' + s8.chiSo.nangLuong);
  });
  t('Tiền trọ: thiếu → nợ + hạn 5 ngày (đúng 9 To Life)', () => {
    const s11 = taoNguoiChoi('saigon'); s11.tien = 100_000;
    const kq11 = xuLyTienThue(s11);
    if (kq11.ok) throw new Error('không ghi nợ');
    if (s11.phong.ngayHanNo !== s11.thoiGian.ngay + 5) throw new Error('hạn nợ không phải 5 ngày');
  });
  t('Chết vì sức khỏe cạn → văn bia + LP', () => {
    const s9 = taoNguoiChoi('hanoi');
    s9.chiSo.sucKhoe = 0;
    kiemTraDay(s9);
    if (!s9.daChet) throw new Error('chưa chết');
    if (!s9.daChet.vanBia) throw new Error('thiếu văn bia');
    if (typeof s9.daChet.lp !== 'number') throw new Error('thiếu LP');
  });
  t('Hành động NPC: tặng quà +quan hệ, thả thính cần Bạn 50', () => {
    const s12 = taoNguoiChoi('danang'); s12.tien = 500_000;
    const kq12 = lamVoiNpc(s12, 'mai', 'tang_qua');
    if (!kq12.ok) throw new Error('tặng quà fail');
    const mai = s12.npc.find(n => n.id === 'mai');
    if (mai.ban <= 0 || mai.yeu <= 0) throw new Error('quan hệ không tăng: ban=' + mai.ban + ' yeu=' + mai.yeu);
    const kq13 = lamVoiNpc(s12, 'mai', 'tha_thinh');
    if (kq13.ok) throw new Error('thả thính được khi chưa thân?');
  });
  t('Save/Load v3 round-trip', () => {
    const s13 = taoNguoiChoi('danang'); s13.tien = 777_000;
    const raw = JSON.stringify({ phienBan: 3, state: s13 });
    eq(JSON.parse(raw).state.tien, 777_000, 'tiền');
  });
  t('Nhu cầu tụt theo giờ, ngủ không tụt năng lượng', () => {
    const s14 = taoNguoiChoi('hanoi');
    const truoc = s14.chiSo.com;
    tienDo(s14, 120);
    if (s14.chiSo.com >= truoc) throw new Error('com không tụt');
    s14.thoiGian.gio = 23; s14.chiSo.nangLuong = 50;
    tienDo(s14, 180);
    if (s14.chiSo.nangLuong < 50) throw new Error('ngủ mà tụt NL');
  });
  t('1 TUẦN IN-GAME sống khỏe không chết (blockgate)', () => {
    const s15 = taoNguoiChoi('saigon');
    for (let ngayLap = 0; ngayLap < 9 && !s15.daChet; ngayLap++) {
      s15.tien = Math.max(s15.tien, 300_000);
      capNhatQuest(s15);
      // lịch ngày: ăn, đi làm (nếu được), trà đá, tám, tắm, gọi má, ngủ
      for (const id of ['an_com_bui', 'tra_da_via_he', 'tam_su_ban', 'tam_giat', 'goi_ve_nha']) {
        const h = HOAT_DONG.find(x => x.id === id);
        s15.tien += Math.max(0, -h.tien);
        lamHoatDong(s15, id);
        if (s15.daChet) break;
      }
      if (s15.daChet) break;
      const g = s15.thoiGian.gio;
      if (g < 21) tienDo(s15, (21 - g) * 60 + 30);
      lamHoatDong(s15, 'ngu_dem');
      capNhatQuest(s15);
    }
    if (s15.daChet) throw new Error('chết: ' + s15.daChet.lyDo);
    if (s15.thoiGian.tuan < 2) throw new Error('chưa qua tuần: ' + s15.thoiGian.tuan);
    if (!s15.questNgay) throw new Error('quest mất');
  });
  t('Thành phố lạ từ chối', () => {
    let threw = false;
    try { taoNguoiChoi('trape'); } catch { threw = true; }
    if (!threw) throw new Error('không chặn');
  });
  t('Thời tiết quay theo thành phố (Sài Gòn không bao giờ rét)', () => {
    const stt = taoNguoiChoi('saigon');
    for (let i = 0; i < 60; i++) {
      quayThoiTiet(stt);
      if (stt.thoiTiet === 'ret') throw new Error('Sài Gòn mà lạnh?');
    }
    const hn = taoNguoiChoi('hanoi');
    let coMuaHoacRet = false;
    for (let i = 0; i < 60; i++) { quayThoiTiet(hn); if (hn.thoiTiet === 'mua' || hn.thoiTiet === 'ret') coMuaHoacRet = true; }
    if (!coMuaHoacRet) throw new Error('Hà Nội 60 lượt không mưa/lạnh?');
  });
  t('Thời tiết ảnh hưởng: mưa ngoài đường làm ướt + mệt; trong nhà vô sự', () => {
    const s = taoNguoiChoi('saigon'); s.thoiTiet = 'mua';
    const sachTruoc = s.chiSo.sachSe;
    thoiTietAnhHuong(s, 60, true);
    if (s.chiSo.sachSe >= sachTruoc) throw new Error('mưa mà sạch sẽ không tụt');
    const sachTruoc2 = s.chiSo.sachSe;
    thoiTietAnhHuong(s, 60, false);
    if (s.chiSo.sachSe !== sachTruoc2) throw new Error('trong nhà vẫn bị mưa?');
  });
  t('Nhậu bia hơi: có ở quán bia, tốn tiền, Xã hội +30', () => {
    const s = taoNguoiChoi('saigon'); s.tien = 500_000;
    const ds = hoatDongKhaDung(s, 'bia_hoi');
    const nh = ds.find(h => h.id === 'nhom_bia');
    if (!nh) throw new Error('thiếu nhom_bia ở bia_hoi');
    if (nh.chiSo.xaHoi !== 30) throw new Error('xaHoi sai: ' + nh.chiSo.xaHoi);
    const kq = lamHoatDong(s, 'nhom_bia');
    if (!kq.ok) throw new Error(kq.lyDo);
    if (s.chiSo.xaHoi < 80) throw new Error('xaHoi không lên: ' + s.chiSo.xaHoi);
  });
  t('Tán tỉnh ở quán: trò chuyện sinh gossip + rủ ăn tối đủ điều kiện → người yêu', () => {
    const s = taoNguoiChoi('saigon'); s.tien = 1_000_000;
    const mai = s.npc.find(n => n.id === 'mai');
    mai.ban = 65; mai.yeu = 55;
    lamVoiNpc(s, 'mai', 'tro_chuyen'); // gossip có thể ghi nhật ký
    lamVoiNpc(s, 'mai', 'tha_thinh'); // +8 Mến → 63
    const kq = lamVoiNpc(s, 'mai', 'moi_hen_ho');
    if (!kq.ok) throw new Error(kq.lyDo);
    if (!s.banGai || s.banGai.npcId !== 'mai') throw new Error('chưa thành người yêu');
    if (!s.diary.some(d => d.loai === 'tinh_yeu')) throw new Error('nhật ký thiếu tin tình yêu');
  });
  t('Mến < 60 thì rủ ăn tối không thành người yêu', () => {
    const s = taoNguoiChoi('saigon'); s.tien = 1_000_000;
    const hoa = s.npc.find(n => n.id === 'hoa');
    hoa.ban = 65; hoa.yeu = 40;
    lamVoiNpc(s, 'hoa', 'moi_hen_ho');
    if (s.banGai) throw new Error('40 Mến mà lấy được?');
  });
  return kq;
}

if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  const kq = chayTest();
  for (const [st, ten] of kq) console.log(st + ' | ' + ten);
  const fail = kq.filter(x => x[0] === 'FAIL').length;
  console.log('---');
  console.log(kq.length - fail + '/' + kq.length + ' PASS');
  if (fail > 0) process.exit(1);
}
