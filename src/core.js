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
  com:       { ten: 'Đồ ăn',     icon: 'com', day: 'com' },
  nangLuong: { ten: 'Năng lượng', icon: 'set', day: 'nangLuong' },
  vui:       { ten: 'Vui vẻ',    icon: 'vui', day: 'vui' },
  xaHoi:     { ten: 'Xã hội',    icon: 'noi', day: 'xaHoi' },
  sachSe:    { ten: 'Sạch sẽ',   icon: 'nuoc', day: 'sachSe' },
  sucKhoe:   { ten: 'Sức khỏe',  icon: 'tim', day: 'sucKhoe' },
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
    'Chỉ muốn xong cái deadline cuối. Deadline thắng.',
    'Ước mơ còn dang dở: một giấc ngủ không báo thức.',
  ];
  // bí mật xấu hổ + người ở lại — hài đen đúng chất 9 To Life
  const nguoiYeu = state.banGai ? (state.npc.find(n => n.id === state.banGai.npcId) || {}).ten : null;
  const mauBiMat = [
    'Chưa từng giặt cái gối ôm suốt 2 năm.',
    'Ăn vụng hộp cơm của đồng nghiệp 3 lần, chưa nhận.',
    'Từng nói dối "em sắp tới" khi vẫn còn ở nhà.',
    'Giấu 50 ngàn trong ốp điện thoại "phòng thân".',
    'Hát karaoke phòng trọ lúc 1 giờ sáng, cả xóm biết.',
    'Nợ bà Tư tiền nước 2 tháng, bà giả vờ quên.',
  ];
  const mauNguoiOLai = nguoiYeu
    ? 'Ở lại là ' + nguoiYeu + ', người vẫn hay dúi quà vào tay bạn — và mẹ bạn, người đang gắng gượng lắm.'
    : 'Ở lại là mẹ bạn, người đang gắng gượng lắm. Và vài đứa bạn còn nợ bạn chầu cà phê chưa kịp trả.';
  state.daChet = {
    ngay: state.thoiGian.ngay, thang: state.thoiGian.thang,
    lyDo, chiTiet,
    vanBia: mauVanBia[Math.floor(Math.random() * mauVanBia.length)],
    biMat: mauBiMat[Math.floor(Math.random() * mauBiMat.length)],
    nguoiOLai: mauNguoiOLai,
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
  // ===== MỞ RỘNG ~20 sự kiện hên xui — điều kiện theo thành phố / thời tiết / giờ =====
  // xui kiểu VN đời thường
  { id: 'csgt', ten: 'CSGT thổi phạt', xacSuat: 0.04, tien: -150_000, chiSo: { vui: -12 }, thoai: 'Chú CSGT vẫy tay: "em quên xi-nhan kìa". Ví mỏng đi 150 ngàn, bài học nhớ đời.' },
  { id: 'chet_may', ten: 'Xe chết máy giữa mưa', xacSuat: 0.05, onlyThoiTiet: 'mua', chiSo: { nangLuong: -12, sachSe: -20, vui: -10 }, thoai: 'Xe chết máy đúng chỗ ngập sâu nhất. Dắt bộ 500m, chú sửa xe ven đường cười: "bệnh cũ rồi em".' },
  { id: 'cho_ruo', ten: 'Chó rượt', xacSuat: 0.03, chiSo: { nangLuong: -15, sucKhoe: -8, vui: -5 }, thoai: 'Con chó nhà ai xổ cổng rượt 3 con hẻm. Tim còn đập thình thịch, chân thì... chạy tiếp cho chắc.' },
  { id: 'karaoke', ten: 'Karaoke hàng xóm', xacSuat: 0.05, gioMin: 19, gioMax: 23, chiSo: { nangLuong: -10, vui: -8 }, thoai: 'Xóm bên mở "Đắp mộ cuộc tình" lúc 10h đêm, loa kéo full công suất. Gối bịt tai cũng không ăn thua.' },
  { id: 'wifi_sap', ten: 'Wifi sập', xacSuat: 0.05, chiSo: { vui: -14, xaHoi: -5 }, thoai: 'Mạng rớt đúng lúc họp online. Gọi tổng đài: "dạ 2-4 tiếng nữa kỹ thuật qua ạ". 4 tiếng.' },
  { id: 'rop_vi', ten: 'Rớt ví', xacSuat: 0.025, tien: -200_000, chiSo: { vui: -18 }, thoai: 'Ví rơi đâu mất tiêu — trong còn đúng 200 ngàn với cái thẻ sinh viên cũ. Đau hơn bị người yêu cũ block.' },
  { id: 'gap_nguoi_yeu_cu', ten: 'Gặp người yêu cũ', xacSuat: 0.03, chiSo: { vui: -10, xaHoi: +4 }, thoai: 'Gặp người cũ ở quán cà phê, đi cùng... người mới. Hai bên gật đầu chào, lòng dậy sóng nhẹ.' },
  { id: 'sep_nhan_11h', ten: 'Sếp nhắn 23h', xacSuat: 0.04, gioMin: 22, chiSo: { nangLuong: -8, vui: -12 }, thoai: '23:07, sếp Đức nhắn: "em ơi file mai cần gấp". Tin nhắn đã xem. Không dám giả vờ ngủ.' },
  { id: 'trien_cuong', ten: 'Triều cường dâng', xacSuat: 0.05, onlyTp: 'saigon', chiSo: { sachSe: -18, nangLuong: -8, vui: -8 }, thoai: 'Triều cường, nước dâng nửa bánh xe đúng giờ tan tầm. Cả đoàn người nối nhau đẩy xe, cười khổ.' },
  { id: 'nom_am', ten: 'Trời nồm', xacSuat: 0.05, onlyTp: 'hanoi', chiSo: { sachSe: -15, vui: -8 }, thoai: 'Nồm ẩm — sàn nhà "đổ mồ hôi", quần áo phơi 3 ngày chưa khô. Cái ẩm ngấm vào tận xương.' },
  { id: 'gio_lao', ten: 'Gió Lào thổi rát', xacSuat: 0.04, onlyTp: 'danang', chiSo: { nangLuong: -10, sucKhoe: -5, sachSe: -8 }, thoai: 'Gió Lào khô rát thổi cả ngày, ra đường 5 phút tóc cứng như bánh tráng.' },
  { id: 'say_bia', ten: 'Quá chén', xacSuat: 0.03, gioMin: 18, chiSo: { sucKhoe: -15, nangLuong: -12, vui: +6, xaHoi: +10 }, thoai: '"Một ly nữa thôi!" — và đó là ly thứ sáu. Sáng nay đầu đau như búa bổ nhưng mà... vui thật.' },
  // hên kiểu VN đời thường
  { id: 'luom_tien', ten: 'Nhặt được tiền', xacSuat: 0.025, tien: +50_000, chiSo: { vui: +12 }, thoai: 'Nhặt được 50 ngàn ai đánh rơi trước cổng công ty. Chờ 10 phút không ai quay lại... thôi coi như lộc.' },
  { id: 'duoc_giam_tien', ten: 'Bà Tư giảm tiền trọ', xacSuat: 0.02, tien: +200_000, chiSo: { vui: +15, xaHoi: +8 }, thoai: 'Bà Tư phẩy tay: "tháng này mày ngoan, bà bớt cho 200". Sống trên đời có tình có nghĩa là vậy.' },
  { id: 'ban_cu_goi', ten: 'Bạn cũ chuyển khoản', xacSuat: 0.02, tien: +150_000, chiSo: { vui: +12, xaHoi: +10 }, thoai: 'Thằng Nam thời đại học nhắn: "tao còn nợ mày chầu cà phê 5 năm trước", kèm 150 ngàn.' },
  { id: 'trung_so_cao', ten: 'Trúng số cào', xacSuat: 0.012, tien: +500_000, chiSo: { vui: +25 }, thoai: 'Tờ vé cào 10 ngàn mua cho vui — cào ra 500! Cả xóm trọ kéo sang xem tận mắt.' },
  { id: 'duoc_thang_chuc', ten: 'Được thăng chức', xacSuat: 0.02, chiSo: { vui: +20, xaHoi: +6 }, thoai: 'Sếp Đức gọi riêng: "từ mai em dẫn dắt nhóm nhỏ". Lương chưa tăng nhưng oai thì có.' },
  { id: 'hang_xom_cho_do', ten: 'Hàng xóm cho đồ ăn', xacSuat: 0.04, chiSo: { com: +25, vui: +8, xaHoi: +6 }, thoai: 'Chị phòng bên gõ cửa: "nhà nấu dư nồi bún riêu, em ăn phụ chị". Tình làng nghĩa xóm là đây.' },
  { id: 'troi_dep', ten: 'Trời đẹp bất ngờ', xacSuat: 0.04, onlyThoiTiet: 'nang', chiSo: { vui: +10, nangLuong: +6 }, thoai: 'Trời xanh nắng vàng gió nhẹ — kiểu thời tiết khiến người ta muốn sống tử tế hơn một chút.' },
  { id: 'duoc_nguoi_yeu_qua', ten: 'Quà bất ngờ', xacSuat: 0.03, onlyCoNguoiYeu: true, chiSo: { vui: +18, xaHoi: +8 }, thoai: 'Người ấy dúi vào tay hộp quà nhỏ: "thấy hợp với anh/em nên mua". Không dịp gì cả. Tự nhiên thế.' },
  { id: 'song_than', ten: 'Sóng thần tin đồn', xacSuat: 0.02, chiSo: { vui: -6, xaHoi: +8 }, thoai: 'Tin đồn công ty cắt giảm lan nhanh hơn wifi. Hóa ra chỉ là chuyển phòng ban. Thở phào nhưng cũng chột dạ.' },
  { id: 'mat_dien_thoai', ten: 'Suýt mất điện thoại', xacSuat: 0.025, chiSo: { vui: -15, nangLuong: -5 }, thoai: 'Móc túi quần trống trơn — tim rơi cái bịch. May quá, nó trượt nằm trong lớp áo khoác. Thọ thêm vài năm.' },
  // ===== ĐỢT 3: sự kiện đặc trưng từng thành phố (verify test 'Sự kiện theo TP') =====
  { id: 'troi_re_hn', ten: 'Rét đậm rét hại', xacSuat: 0.05, onlyTp: 'hanoi', chiSo: { sucKhoe: -12, nangLuong: -8, vui: -6 }, thoai: '5 độ, gió bấc cắt da cắt thịt. Cả xóm muối dưa quây quần quanh nồi lẩu bò kêu: "rét thế này không lẩu là không sống được".' },
  { id: 'ro_rua_hn', ten: 'Phố cổ bịt đường', xacSuat: 0.04, onlyTp: 'hanoi', chiSo: { nangLuong: -10, vui: -8 }, thoai: 'Đào mặt đường toàn phố cổ. Đi vòng 3 lối vẫn vào ngõ cụt, chú xe ôm: "phố này răm răm lắm chú ơi".' },
  { id: 'la_ca_hn', ten: 'Quán chè cô lá ca', xacSuat: 0.03, onlyTp: 'hanoi', chiSo: { vui: +12, xaHoi: +6 }, tien: -20_000, thoai: 'Nhà thơ lá ca sáng tác luôn tay: "bạn uống gì đi bạn...". Cả quán bật cười — một buổi chiều Hà Nội trôi thật êm.' },
  { id: 'nang_ha_noi_hn', ten: 'Nắng vụ mùa đẹp lạ', xacSuat: 0.035, onlyTp: 'hanoi', chiSo: { vui: +12, nangLuong: +6 }, thoai: 'Nắng vàng vụ mùa phủ lên mặt hồ Gươm. Tháp Rùa soi bóng, ai cũng nhấc điện thoại lên chụp.' },
  { id: 'bien_dn', ten: 'Biển xanh cát trắng', xacSuat: 0.05, onlyTp: 'danang', chiSo: { vui: +18, sucKhoe: +6, nangLuong: +6 }, thoai: 'My Khe cát trắng nước trong, sóng vỗ rì rào. Ai bảo Đà Nẵng là thành phố đáng sống là đúng — nhưng mà đang giờ làm mà!' },
  { id: 'bao_dn', ten: 'Bão đổ bộ', xacSuat: 0.03, onlyTp: 'danang', chiSo: { sachSe: -20, nangLuong: -12, vui: -14 }, thoai: 'Bão số 8 đổ bộ thẳng mặt. Cắm trại lấy yến, cả căn hộ chạy gió — sáng ra sân đáy đầy lá cây bay từ đâu tới.' },
  { id: 'cau_tinh_yeu_dn', ten: 'Cầu Tình Yêu sáng đèn', xacSuat: 0.035, onlyTp: 'danang', chiSo: { vui: +15, xaHoi: +10 }, thoai: 'Cầu Tình Yêu thắp đèn tim hồng khắp mặt sông Hàn. Cặp đôi chìa khóa tình yêu, mình thì... tự thưởng cho mình ly trà đá.' },
  { id: 'sai_gon_xe_om_sg', ten: 'Xe ôm chở quá tải', xacSuat: 0.045, onlyTp: 'saigon', chiSo: { nangLuong: -8, vui: -6, xaHoi: +5 }, thoai: 'Bắt xe ôm đi công tác, chú chở thêm 2 người nữa. Ba người trên một chiếc Wave — có lẽ đây là kỹ năng sống còn của Sài Gòn.' },
  { id: 'com_tam_sg', ten: 'Cơm tấm quán quen', xacSuat: 0.04, onlyTp: 'saigon', chiSo: { com: +25, vui: +10 }, tien: -35_000, thoai: 'Dì Sáu quán cơm tấm gỏi mặn tay giơ vòng: "thêm chả quýt em?". Lòng đầy ắp, ví nhẹ đi tí — đáng.' },
  { id: 'ngap_nuoc_sg', ten: 'Biển lũ chặn lối về', xacSuat: 0.04, onlyTp: 'saigon', chiSo: { sachSe: -20, nangLuong: -10, vui: -10 }, thoai: 'Mưa 30 phút, nước ngập cả lối về. Người ta cõng nhau qua lề đường, ai đó còn chụp ảnh sống ảo giữa biển nước.' },
  { id: 'ho_guom_hn', ten: 'Đi bộ hồ Gươm', xacSuat: 0.035, onlyTp: 'hanoi', chiSo: { vui: +12, xaHoi: +5, nangLuong: +4 }, thoai: 'Chủ nhật đi bộ quanh hồ Gươm, nghe nhạc đường phố. Cà phê trứng nóng hổi giữa tiết trời se lạnh — bình yên khó giải thích.' },
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

function suKienHopLe(s, state, gio) {
  if (s.onlyTp && state.thanhPhoKey !== s.onlyTp) return false;
  if (s.onlyThoiTiet && state.thoiTiet !== s.onlyThoiTiet) return false;
  if (s.onlyCoNguoiYeu && !(state.banGai && state.banGai.npcId)) return false;
  if (s.gioMin !== undefined && gio < s.gioMin) return false;
  if (s.gioMax !== undefined && gio > s.gioMax) return false;
  return true;
}

function kiemTraSuKien(state) {
  const sk = [];
  const { thu, gio, ngay } = state.thoiGian;
  if (Math.random() < 0.35) {
    // lọc theo điều kiện (thành phố / thời tiết / giờ / người yêu) rồi quay theo xác suất
    const hopLe = SU_KIEN_VIET.filter(s => suKienHopLe(s, state, gio));
    const tongXs = hopLe.reduce((a, s) => a + s.xacSuat, 0);
    const r = Math.random() * tongXs; let cong = 0;
    for (const s of hopLe) {
      cong += s.xacSuat;
      if (r < cong) {
        apDungChiSo(state, s.chiSo);
        if (s.tien) state.tien += s.tien;
        if ((s.chiSo.sucKhoe || 0) <= -15 && Math.random() < 0.5) state.songSot.khat = 0; // ốm nhẹ chưa nguy
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
  t('Sự kiện theo TP: triều cường chỉ Sài Gòn, nồm chỉ Hà Nội, gió Lào chỉ Đà Nẵng', () => {
    const sg = taoNguoiChoi('saigon');
    const hn = taoNguoiChoi('hanoi');
    const dn = taoNguoiChoi('danang');
    if (!suKienHopLe({ onlyTp: 'saigon' }, sg, 12)) throw new Error('SG phải hợp lệ');
    if (suKienHopLe({ onlyTp: 'saigon' }, hn, 12)) throw new Error('HN không được có triều cường');
    if (suKienHopLe({ onlyTp: 'hanoi' }, dn, 12)) throw new Error('ĐN không được có nồm');
    if (suKienHopLe({ onlyTp: 'danang' }, sg, 12)) throw new Error('SG không được có gió Lào');
  });
  t('Sự kiện theo thời tiết + giờ + người yêu', () => {
    const s = taoNguoiChoi('saigon');
    s.thoiTiet = 'mua';
    if (!suKienHopLe({ onlyThoiTiet: 'mua' }, s, 12)) throw new Error('mưa phải khớp chết máy');
    s.thoiTiet = 'nang';
    if (suKienHopLe({ onlyThoiTiet: 'mua' }, s, 12)) throw new Error('nắng không được ra chết máy');
    if (suKienHopLe({ gioMin: 22 }, s, 10)) throw new Error('10h không được ra sự kiện 23h');
    if (!suKienHopLe({ gioMin: 22 }, s, 23)) throw new Error('23h phải khớp');
    if (suKienHopLe({ onlyCoNguoiYeu: true }, s, 12)) throw new Error('FA không được nhận quà');
    s.banGai = { npcId: 'mai', ngayChot: 3 };
    if (!suKienHopLe({ onlyCoNguoiYeu: true }, s, 12)) throw new Error('có người yêu phải khớp');
  });
  t('Bộ sự kiện VN ≥ 25 cái, id không trùng, quay nhiều lần không crash', () => {
    if (SU_KIEN_VIET.length < 25) throw new Error('chỉ có ' + SU_KIEN_VIET.length);
    const ids = new Set(SU_KIEN_VIET.map(s => s.id));
    if (ids.size !== SU_KIEN_VIET.length) throw new Error('trùng id sự kiện');
    for (const tp of ['saigon', 'hanoi', 'danang']) {
      const s = taoNguoiChoi(tp);
      for (let i = 0; i < 60; i++) { s.thoiGian.gio = i % 24; quayThoiTiet(s); kiemTraSuKien(s); }
    }
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


// ==================== PHASE 2: HỆ NGHỀ SÂU ====================
// 3 nghề thật sự khác nhau: mỗi nghề có ca làm + lương + cách kiếm riêng
const NGHE_HE_THONG = {
  van_phong: {
    ten: 'Dân văn phòng',
    moTa: 'Chấm công, họp hành, deadline. Sếp Đức nhìn kim đồng hồ.',
    kyNangChinh: 'vanPhong',
    caLam: { tu: 7.5, den: 17.5 },
    sceneLam: ['van_phong'],
    kieu: 'ca',          // lương trọn ca
    luongCa: 80_000,
    luongTangCa: 50_000,
    thang: {
      sep: 'duc',
      bac: [
        { cap: 1, ten: 'Thực tập sinh',    ycKyNang: 0,   ycSep: 0,  luongCa: 80_000 },
        { cap: 2, ten: 'Nhân viên chính',  ycKyNang: 2,   ycSep: 30, luongCa: 120_000 },
        { cap: 3, ten: 'Trưởng nhóm',      ycKyNang: 3.5, ycSep: 55, luongCa: 180_000 },
        { cap: 4, ten: 'Phó phòng',        ycKyNang: 4.5, ycSep: 75, luongCa: 260_000 },
      ],
    },
  },
  shipper: {
    ten: 'Shipper',
    moTa: 'App đơn + đôi chân. Trời mưa đơn cháy, nắng gắt đơn vắng.',
    kyNangChinh: 'giaoTiep',
    caLam: { tu: 6, den: 22 },
    sceneLam: ['pho_dem'],
    kieu: 'don',         // kiếm theo đơn
    tienDon: 35_000,     // mỗi chuyến ship
    thang: {
      sep: null,
      bac: [
        { cap: 1, ten: 'Shipper mới',        ycKyNang: 0,   luongCa: 0 },
        { cap: 2, ten: 'Shipper quen đường', ycKyNang: 2,   luongCa: 0 },
        { cap: 3, ten: 'Giao hỏa tốc',       ycKyNang: 3.5, luongCa: 0 },
        { cap: 4, ten: 'Chủ nhóm shipper',   ycKyNang: 4.5, luongCa: 0 },
      ],
    },
  },
  ban_quan: {
    ten: 'Phụ quán phở',
    moTa: 'Bưng bê pha phín từ tờ mờ sáng, tối về đếm tiền lẻ.',
    kyNangChinh: 'nauAn',
    caLam: { tu: 5, den: 13 },
    sceneLam: ['quan_pho'],
    kieu: 'kip',         // theo kíp + tiền tip khách quen
    luongKip: 25_000,
    thang: {
      sep: null,
      bac: [
        { cap: 1, ten: 'Nhiệm vụ phụ bưng', ycKyNang: 0,   luongCa: 0 },
        { cap: 2, ten: 'Chân lùa pha phín', ycKyNang: 2,   luongCa: 0 },
        { cap: 3, ten: 'Vai trên bếp phở',  ycKyNang: 3.5, luongCa: 0 },
        { cap: 4, ten: 'Quán của riêng mình', ycKyNang: 4.5, luongCa: 0 },
      ],
    },
  },
};
// Bậc nghề HIỆN TẠI (đã được thăng trong state; mặc định bậc 1)
function bacNghe(state) {
  const h = NGHE_HE_THONG[state.ngheKey];
  if (!h) return { cap: 1, ten: state.nghe, luongCa: state.luong.ca };
  const cap = state.thangChucCap || 1;
  const b = h.thang.bac.find(x => x.cap === cap) || h.thang.bac[0];
  return { ...b, luongCa: b.luongCa || h.luongCa || 0 };
}
// Bậc CAO NHẤT đang đủ điều kiện (UI dùng để nhắc "chưa nhận thăng chức")
function bacDuDieuKien(state) {
  const h = NGHE_HE_THONG[state.ngheKey];
  if (!h) return null;
  const kyn = state.kyNang[h.kyNangChinh] || 0;
  const sep = h.thang.sep ? (state.npc.find(n => n.id === h.thang.sep) || {}).quanHe || 0 : 0;
  let ra = null;
  for (const b of h.thang.bac) {
    if (kyn >= b.ycKyNang && sep >= (b.ycSep || 0)) ra = b;
  }
  return ra;
}

// Hoạt động làm việc theo NGHỀ (thay 'di_lam' cứng cho 3 nghề) — nối vào HOAT_DONG như hoạt động thường
function lamViecNghe(state) {
  const h = NGHE_HE_THONG[state.ngheKey];
  if (!h) return { ok: false, lyDo: 'Chưa có nghề.' };
  const t = state.thoiGian;
  if (t.thu === 7 || t.thu === 8) return { ok: false, lyDo: 'Cuối tuần mà! Chợ tụi hắn cũng nghỉ.' };
  if (t.gio < h.caLam.tu || t.gio > h.caLam.den) {
    return { ok: false, lyDo: 'Ngoài ca làm (' + h.caLam.tu + 'h–' + h.caLam.den + 'h).' };
  }
  if (h.kieu === 'don') {
    // SHIPPER: bốc đơn — tiền theo đơn + mưa tăng đơn (đời thật), kỹ năng tăng nhanh
    const soDon = 3 + (state.thoiTiet === 'mua' ? 2 : 0) + Math.floor((state.kyNang.giaoTiep || 0));
    const tien = soDon * h.tienDon;
    state.tien += tien;
    state.thongKe.don = (state.thongKe.don || 0) + soDon;
    apDungChiSo(state, { nangLuong: -22, com: -15, vui: -6, sachSe: -10 });
    state.kyNang.giaoTiep = Math.min(5, state.kyNang.giaoTiep + 0.3);
    ghiNhatKy(state, 'lam_viec', 'Chạy ship ' + soDon + ' đơn (+' + tien.toLocaleString('vi-VN') + 'đ)' + (state.thoiTiet === 'mua' ? ' — trời mưa đơn cháy, kiếm mặn hơn.' : '.'));
    tienDo(state, 90);
    capNhatQuest(state);
    return { ok: true, tien, soDon, ten: 'Chạy ship ' + soDon + ' đơn' };
  }
  if (h.kieu === 'kip') {
    // PHỤ QUÁN: kíp sáng + tip khách quen tăng theo kỹ năng nấu
    const tip = Math.floor((state.kyNang.nauAn || 0)) * 12_000 + 8_000;
    const tien = h.luongKip + tip;
    state.tien += tien;
    state.thongKe.kip = (state.thongKe.kip || 0) + 1;
    apDungChiSo(state, { nangLuong: -25, com: -10, vui: +4, sachSe: -12 });
    state.kyNang.nauAn = Math.min(5, state.kyNang.nauAn + 0.35);
    ghiNhatKy(state, 'lam_viec', 'Trực kíp quán (+' + tien.toLocaleString('vi-VN') + 'đ, gộp tip khách quen). Bà Hạnh: "ráng lên, quán cần người tử tế".');
    tienDo(state, 240);
    capNhatQuest(state);
    return { ok: true, tien, ten: 'Trực kíp quán phở' };
  }
  // VAN PHONG: trọn ca lương bậc hiện tại
  const b = bacNghe(state);
  const tien = b.luongCa || h.luongCa;
  state.tien += tien;
  apDungChiSo(state, { nangLuong: -30, com: -25, vui: -12, sachSe: -15 });
  state.kyNang.vanPhong = Math.min(5, state.kyNang.vanPhong + 0.2);
  ghiNhatKy(state, 'lam_viec', 'Đi làm trọn ca (+' + tien.toLocaleString('vi-VN') + 'đ — ' + b.ten + '). Deadline thứ mấy cũng vậy.');
  tienDo(state, 480);
  capNhatQuest(state);
  return { ok: true, tien, ten: b.ten };
}

// Tăng ca văn phòng (chỉ nghề van_phong)
function tangCaVanPhong(state) {
  const h = NGHE_HE_THONG[state.ngheKey];
  if (!h || h.kieu !== 'ca') return { ok: false, lyDo: 'Nghề này không có tăng ca.' };
  const t = state.thoiGian;
  if (t.thu === 7 || t.thu === 8) return { ok: false, lyDo: 'Cuối tuần mà! Văn phòng đóng cửa.' };
  if (t.gio < 17.5 || t.gio > 20) return { ok: false, lyDo: 'Giờ tăng ca là sau 17h30, trước 20h.' };
  state.tien += h.luongTangCa;
  apDungChiSo(state, { nangLuong: -25, vui: -20, com: -12 });
  state.kyNang.vanPhong = Math.min(5, state.kyNang.vanPhong + 0.25);
  ghiNhatKy(state, 'lam_viec', 'Nán lại tăng ca (+' + h.luongTangCa.toLocaleString('vi-VN') + 'đ). Sếp Đức: "anh ghi nhận nỗ lực của em".');
  tienDo(state, 180);
  capNhatQuest(state);
  return { ok: true, ten: 'Nán lại tăng ca' };
}

// ===== PHASE 3: NPC ĐỜI SỐNG SÂU — nhớ, ghi hận, giận, cảm xúc lây =====
// Mỗi NPC ghi nhớ: hẹn hò bỏ hẹn → giận; tặng quà → nhớ ơn; bỏ mặc lâu → lạnh nhạt
function npcGhiHanhVi(state, npcId, loai, chiTiet) {
  const n = state.npc.find(x => x.id === npcId);
  if (!n) return;
  n.ghiNho = n.ghiNho || [];
  n.ghiNho.push({ ngay: state.thoiGian.ngay, loai, chiTiet: chiTiet || '' });
  if (n.ghiNho.length > 6) n.ghiNho = n.ghiNho.slice(-6);
}

// Hành động NPC mở rộng: có điều kiện, có hệ quả
function lamVoiNpcSau(state, npcId, hanhDongId) {
  const kq = lamVoiNpc(state, npcId, hanhDongId);
  if (!kq.ok) return kq;
  const n = kq.npc;
  if (hanhDongId === 'tang_qua') npcGhiHanhVi(state, npcId, 'on', 'nhận quà');
  if (hanhDongId === 'moi_hen_ho') npcGhiHanhVi(state, npcId, 'hen', 'đã hẹn ăn tối');
  if (hanhDongId === 'tro_chuyen' && n.ban < 20) npcGhiHanhVi(state, npcId, 'lan_nhat', 'gặp gỡ xã giao');
  // cảm xúc lây kiểu 9 To Life: NPC vui/buồn ảnh hưởng người chơi
  if (n.tamTrang === 'mệt vì tăng ca') apDungChiSo(state, { vui: -4 });
  if (n.tamTrang === 'vui vẻ') apDungChiSo(state, { vui: +4 });
  return kq;
}

// NPC GIẬN: người yêu hẹn mà không tới (đánh dấu henLo) — kêu trách khi gặp
function npcHenLo(state, npcId) {
  const n = state.npc.find(x => x.id === npcId);
  if (!n) return;
  npcGhiHanhVi(state, npcId, 'hen_lo', 'hẹn mà không tới');
  n.ban = Math.max(0, n.ban - 15);
  n.yeu = Math.max(0, n.yeu - 20);
  n.tamTrang = 'đang giận';
  const isYeu = state.banGai && state.banGai.npcId === npcId;
  ghiNhatKy(state, 'npc', (isYeu ? 'Người yêu ' : '') + n.ten + ' giận: "hẹn mà không tới, lần sau khỏi hẹn". (' + (isYeu ? '−20 Mến' : '−15 Bạn') + ')');
}

// Nhắn tin NPC theo TÍNH CÁCH (thay tin nhắn đại khái cũ) — mỗi NPC bộ câu riêng theo quan hệ
function tinNhanTheoTamTrang(n, state) {
  const giap = state.banGai && state.banGai.npcId === n.id;
  const mau = {
    mai: giap ? ['Yêu anh nhiều nha 💕', 'Chiều đón em ăn bún bò Huế nhé?'] : ['Chiều nay ăn lẩu không?', 'Lương về chưa vậy?', 'Cuối tuần đi cà phê bệt nha'],
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
  // GIẬN: chèn tin nhắn trách theo tính cách
  if (n.tamTrang === 'đang giận') {
    const gianh = {
      mai: 'Sao hôm qua không tới? Mai tớ không muốn nói chuyện.',
      hoa: 'Anh hẹn em mà không tới à?',
      thao: 'Khách hẹn mà không tới, buồn thật.',
    };
    return gianh[n.id] || 'Hẹn mà không tới, buồn lắm.';
  }
  const list = mau[n.id] || ['Dạo này sao rồi?'];
  return list[Math.floor(Math.random() * list.length)];
}

// NPC sống sâu hơn: nhắn tin bằng tính cách + nhớ khi bỏ bê lâu
function npcSongSau(state, phut) {
  npcSong(state, phut); // giữ nền cũ: thay đổi trạng thái + tin nhắn ngẫu nhiên nền
  const { ngay } = state.thoiGian;
  for (const n of state.npc) {
    // bỏ bê quá 4 ngày → quan hệ tự lạnh dần + NPC nhắn "quên tui rồi à"
    n.gapGanNhat = n.gapGanNhat || ngay;
    if (ngay - n.gapGanNhat === 4 && n.quanHe >= 30 && Math.random() < 0.6) {
      ghiNhatKy(state, 'npc', n.ten + ' nhắn: "dạo này im lặng ghê, sống chết gì vậy?"');
      n.quanHe = Math.max(0, n.quanHe - 3);
    }
    // đang giận thì tự nguôi sau 2 ngày nếu được làm hòa (trò chuyện)
    if (n.tamTrang === 'đang giận' && n.ghiNho) {
      const henLo = n.ghiNho.find(g => g.loai === 'hen_lo');
      if (henLo && ngay - henLo.ngay >= 2 && Math.random() < 0.4) {
        n.tamTrang = 'bình thường';
        ghiNhatKy(state, 'npc', n.ten + ' dịu lại: "thôi, tụi mình nói chuyện chuyện khác đi".');
      }
    }
  }
}

// ===== PHASE 4: LỊCH ÂM + TẾT + LỄ HỘI VN =====
// Lịch âm theo bảng dữ liệu 2026-2027 (đơn giản hóa đúng nhịp câu chuyện game:
// 30 ngày/tháng, Tết rơi đầu tháng 1 âm = ngày ~10-12 tháng 2 dương năm sau)
const AM_LICH_2026 = { // Tết 2027 rơi 6/2/2027 → tháng chạp âm bắt đầu ~8/1/2027
  tetNgayDuong: { nam: 2027, thang: 2, ngay: 6 },
  // quy đổi thô: ngày dương 1/10/2026 = 20/8 âm; Tết 6/2/2027 = mùng 1 tháng 1 âm 2027
  moTa: 'Bảng âm lịch nội bộ, đủ cho gameplay Tết',
};
// Đếm ngày tuyệt đối từ mốc 1/10/2026 (ngày 1 game, đơn giản 30 ngày/tháng)
// Tết Nguyên Đán 2027 rơi 6/2/2027 = mùng 1 tháng 1 âm → dem 0
function ngayAmLich(state) {
  const t = state.thoiGian;
  let ngayTD;
  if (t.nam === 2026) {
    ngayTD = (t.thang - 10) * 30 + (t.ngay - 1); // tháng 10 = 0, tháng 12 = 60
  } else {
    ngayTD = (12 - 10 + 1) * 30 + (t.thang - 1) * 30 + (t.ngay - 1); // 2027: hết 2026 = 90 ngày
  }
  const tetTD = (12 - 10 + 1) * 30 + (2 - 1) * 30 + (6 - 1) - 0; // 6/2/2027: 3 tháng cuối 2026 (90) + 1 tháng 1 (30) + 5 = 125
  const conLaiTet = tetTD - ngayTD; // >0 = chưa Tết, 0 = mùng 1, âm = sau Tết
  return { conLaiTet, ngayTD, tetTD };
}
// Sự kiện LỊCH: đám giỗ gia đình (23/12 âm ≈ 18/1/2027), Tết Nguyên Đán, bao vỏ, lì xì
const SU_KIEN_LICH = [
  { id: 'gio_to_hung_vuong', ten: 'Giỗ Tổ Hùng Vương', thang: 4, ngayAm: 10, chiSo: { vui: +10 }, thoai: 'Mùng 10 tháng 3 âm — cả nước nghỉ giỗ Tổ. Dịp hiếm hoi được ngủ nướng không bị trách.' },
  { id: 'le_30_4', ten: 'Ngày giải phóng', thang: 4, ngayAm: 30, chiSo: { vui: +12 }, thoai: '30-4 nghỉ 2 ngày! Cả phố treo cờ đỏ sao vàng, ai về quê ai về.' },
  { id: 'le_1_5', ten: 'Ngày Quốc tế Lao động', thang: 5, ngayAm: 1, chiSo: { vui: +10 }, thoai: '1-5 hội hè — công viên đông vui, bán kem bơ chen chúc.' },
  { id: 'trung_thu', ten: 'Tết Trung thu', thang: 8, ngayAm: 15, chiSo: { vui: +14, xaHoi: +8 }, thoai: 'Rằm tháng 8 — đèn ông sao rực rỡ, mưa dâu nướng thơm lừng, trẻ con rước đèn phá đường.' },
  { id: 'tet_duong_1_1', ten: 'Giao thừa dương lịch', thang: 12, ngayAm: 31, chiSo: { vui: +8 }, thoai: 'Giao thừa dương — đếm ngược trên tivi, pháo giấy nổ chào năm mới kiểu "dân tiểu thương".', },
];
// Sự kiện TẾT âm — kích hoạt theo ngày đếm tới Tết (mốc âm 23 tháng chạp → mùng 7)
const TET_SK = [
  { dem: 14, ten: 'Cậu Tét dạo', chiSo: { vui: +10, xaHoi: +6 }, thoai: 'Cậu vã mưa trước Tết, hang cùng xóm trọ gói bánh chưng. Vò lá chuối xanh non, gạo nếp thơm lừng cả hành lang.' },
  { dem: 8,  ten: '23 Tết — Táo quân về trời', chiSo: { vui: +6 }, thoai: '23 tháng Chạp: thả cá chép cho ông Công ông Táo về trời. Cả xóm mua cá chép bọc bốn quả pháo giấy chờ thả sông.' },
  { dem: 4,  ten: 'Tất niên', chiSo: { xaHoi: +15, vui: +12, com: +20 }, thoai: 'Cả xóm trọ tất niên chung — bà Tư nấu nồi thịt kho tàu, cụ Long rót rượu, ăn 1 bàn 10 người, chưa từng thân thế này.' },
  { dem: 1,  ten: 'GIAO THỪA', chiSo: { xaHoi: +20, vui: +25, nangLuong: -10 }, thoai: 'Giao thừa! Pháo hoa nổ sáng trời, xe không còi. Cụ Long rót trà nóng: "lấy may đầu năm". Sáng mai tất cả sẽ bắt đầu mới.' },
  { dem: 0,  ten: 'MÙNG 1 TẾT — LÌ XÌ', chiSo: { vui: +30, xaHoi: +18, com: +25 }, tien: +300_000, thoai: 'Mùng 1 Tết! Chúc thọ bà Tư: "chúc bà trăm tuổi không lão". Bà dúi bao lì xì đỏ chót: "ngoan lắm, đi chơi đi con". +300 ngàn lì xì!' },
  { dem: -1, ten: 'Mùng 2 Tết', chiSo: { vui: +18, xaHoi: +10, nangLuong: -5 }, thoai: 'Mùng 2 về nhà mẹ chồng/nợ — nhưng FA đi chơi với đám bạn. Đánh bài ăn tiền với họ hàng: thắng 50 ngàn, không dám chơi to.' },
  { dem: -2, ten: 'Mùng 3 Tết', chiSo: { vui: +12, nangLuong: -8 }, thoai: 'Mùng 3 đi chùa đầu năm cầu tài lộc, xếp hàng xin lộc, cắt hạt mai về cắm.' },
  { dem: -4, ten: 'Mùng 5 Tết', chiSo: { vui: +8, nangLuong: -10 }, thoai: 'Mùng 5 "tắt Tết" — hoãn Tết để về quê lần cuối, đường tắc nghẽn cả vành đai.' },
  { dem: -6, ten: 'Mùng 7 Tết — trở lại phố', chiSo: { vui: -6, nangLuong: -5 }, thoai: 'Mùng 7 cả phố mở cửa trở lại. Ánh đèn văn phòng bật lại, ai cũng thở dài: "Tết hết rồi...".' },
];

// Kiểm tra kích hoạt sự kiện Tết (theo ngày đếm tới Tết, mỗi mốc chỉ bắn 1 lần/life)
function kiemTraTet(state) {
  const { conLaiTet } = ngayAmLich(state);
  const daCo = state.tetDaChoi || {};
  const ra = [];
  for (const sk of TET_SK) {
    const key = 'tet_' + sk.dem;
    if (conLaiTet <= sk.dem && conLaiTet >= sk.dem - 1 && !daCo[key]) {
      daCo[key] = true;
      apDungChiSo(state, sk.chiSo);
      if (sk.tien) state.tien += sk.tien;
      ghiNhatKy(state, 'tet', sk.ten + ': ' + sk.thoai);
      ra.push(sk);
    }
  }
  state.tetDaChoi = daCo;
  return ra;
}

// ===== NỐI PHASE 2-4 VÀO VÒNG LẶP + NGƯỜI CHƠI MỚI =====
function taoNguoiChoiSau(tenThanhPho, tenNguoi, ngheKey) {
  const s = taoNguoiChoi(tenThanhPho, tenNguoi);
  const ngheKeyChot = NGHE_HE_THONG[ngheKey] ? ngheKey : 'van_phong';
  const h = NGHE_HE_THONG[ngheKeyChot];
  s.ngheKey = ngheKeyChot;
  s.nghe = h.ten.toLowerCase();
  s.thangChucCap = 1;
  s.thongKe = { don: 0, kip: 0, ca: 0 };
  s.tetDaChoi = {};
  // đồng bộ ca làm + lương theo nghề
  if (h.kieu === 'ca') {
    s.caLam = { ...h.caLam };
    s.luong.ca = h.luongCa;
  } else {
    s.caLam = { ...h.caLam };
    s.luong.ca = 0; // shipper/phụ quán không có lương trọn ca
  }
  // nghề shipper/phụ quán: xuất phát gần quán/phố — đồng nghiệp quán thêm thân
  if (ngheKeyChot === 'ban_quan') {
    const hanh = s.npc.find(n => n.id === 'hanh');
    if (hanh) { hanh.ban += 15; hanh.quanHe += 10; }
  }
  if (ngheKeyChot === 'shipper') {
    const hung = s.npc.find(n => n.id === 'hung');
    if (hung) { hung.ban += 30; hung.quanHe += 20; }
  }
  return s;
}

// đi làm THỐNG NHẤT: gọi theo nghề — UI chỉ cần gọi 1 hàm
function diLamNghe(state) {
  const h = NGHE_HE_THONG[state.ngheKey];
  if (!h) return { ok: false, lyDo: 'Chưa có nghề.' };
  if (h.kieu === 'ca') {
    // giữ hành vi cũ cho van_phong (test cũ 24/24 không vỡ)
    return lamHoatDong(state, 'di_lam');
  }
  return lamViecNghe(state);
}

// thăng chức: kiểm tra điều kiện, tăng bậc → lương mới + nhật ký
function thangChuc(state) {
  const h = NGHE_HE_THONG[state.ngheKey];
  if (!h) return { ok: false, lyDo: 'Chưa có nghề.' };
  const bac = h.thang.bac;
  const cur = bacNghe(state);
  const idx = bac.findIndex(b => b.cap === cur.cap);
  if (idx >= bac.length - 1) return { ok: false, lyDo: 'Đã đỉnh nghề rồi — giờ chỉ giữ lửa.' };
  const next = bac[idx + 1];
  const kyn = state.kyNang[h.kyNangChinh] || 0;
  const sep = h.thang.sep ? (state.npc.find(n => n.id === h.thang.sep) || {}).quanHe || 0 : 0;
  if (kyn < next.ycKyNang) return { ok: false, lyDo: 'Cần ' + tenKyNang(h.kyNangChinh) + ' cấp ' + next.ycKyNang + ' (hiện ' + Math.floor(kyn * 10) / 10 + ').' };
  if ((next.ycSep || 0) > sep) return { ok: false, lyDo: 'Cần ' + (h.thang.sep ? 'sếp ' : '') + 'để ý tới ' + next.ycSep + ' quan hệ (hiện ' + Math.round(sep) + ').' };
  // thăng!
  state.thangChucCap = next.cap;
  if (h.kieu === 'ca') state.luong.ca = next.luongCa;
  state.dream.lp += 2; // thăng chức = +2 LP giấc mơ
  apDungChiSo(state, { vui: +25, xaHoi: +10 });
  ghiNhatKy(state, 'thang_chuc', 'THĂNG CHỨC: ' + next.ten + '!' + (h.kieu === 'ca' ? ' Lương ca lên ' + next.luongCa.toLocaleString('vi-VN') + 'đ.' : ' Đơn/ngày nhiều hơn, khách quen giới thiệu đông hơn.'));
  return { ok: true, ten: next.ten };
}

// === TESTS PHASE 2-4 ===
function chayTestSau() {
  const kq = [];
  const t = (ten, fn) => { try { fn(); kq.push(['PASS', ten]); } catch (e) { kq.push(['FAIL', ten + ' — ' + e.message]); } };
  const eq = (a, b, msg) => { if (a !== b) throw new Error((msg || '') + ' (' + a + ' ≠ ' + b + ')'); };

  t('Tạo người chơi nghề shipper — ca 6h-22h, thân Hùng', () => {
    const s = taoNguoiChoiSau('saigon', 'Bin', 'shipper');
    eq(s.caLam.tu, 6, 'ca tu');
    eq(s.caLam.den, 22, 'ca den');
    const hung = s.npc.find(n => n.id === 'hung');
    if (hung.ban < 30) throw new Error('Hùng chưa thân: ' + hung.ban);
    eq(s.luong.ca, 0, 'khong luong ca');
  });
  t('Shipper chạy đơn: tiền theo đơn, mưa tăng đơn', () => {
    const s = taoNguoiChoiSau('saigon', 'Bin', 'shipper');
    s.thoiGian = { ngay: 2, thu: 3, gio: 9, phut: 0, tuan: 1, thang: 10, nam: 2026 };
    s.thoiTiet = 'nang';
    const t0 = s.tien;
    const kq1 = lamViecNghe(s);
    if (!kq1.ok) throw new Error(kq1.lyDo);
    if (s.tien <= t0) throw new Error('không kiếm được tiền');
    const donNang = kq1.soDon;
    s.thoiTiet = 'mua';
    const kq2 = lamViecNghe(s);
    if (kq2.soDon <= donNang) throw new Error('mưa không tăng đơn: ' + kq2.soDon + ' <= ' + donNang);
    if (s.thongKe.don < donNang + 2) throw new Error('thống kê đơn sai');
  });
  t('Shipper ngoài ca (5h sáng) bị chặn', () => {
    const s = taoNguoiChoiSau('saigon', 'Bin', 'shipper');
    s.thoiGian = { ngay: 2, thu: 3, gio: 5, phut: 0, tuan: 1, thang: 10, nam: 2026 };
    const kq = lamViecNghe(s);
    if (kq.ok) throw new Error('5h sáng mà chạy được?');
  });
  t('Phụ quán kíp sáng: lương kíp + tip theo kỹ năng nấu', () => {
    const s = taoNguoiChoiSau('hanoi', 'Còi', 'ban_quan');
    s.thoiGian = { ngay: 2, thu: 3, gio: 7, phut: 0, tuan: 1, thang: 10, nam: 2026 };
    const t0 = s.tien;
    const kq = lamViecNghe(s);
    if (!kq.ok) throw new Error(kq.lyDo);
    if (s.tien - t0 < 25_000) throw new Error('kíp ít hơn 25k');
    s.kyNang.nauAn = 3;
    const kq2 = lamViecNghe(s);
    const tien2 = s.tien - (t0 + kq.tien);
    if (tien2 <= kq.tien) throw new Error('kỹ năng cao không tăng tip');
    if (s.thongKe.kip !== 2) throw new Error('thống kê kíp sai');
  });
  t('Phụ quán chiều muộn bị chặn (ca 5h-13h)', () => {
    const s = taoNguoiChoiSau('hanoi', 'Còi', 'ban_quan');
    s.thoiGian = { ngay: 2, thu: 3, gio: 15, phut: 0, tuan: 1, thang: 10, nam: 2026 };
    if (lamViecNghe(s).ok) throw new Error('15h mà trực kíp sáng?');
  });
  t('Dân văn phòng giữ hành vi cũ + đi làm đúng luồng (back-compat)', () => {
    const s = taoNguoiChoiSau('saigon', 'Nam', 'van_phong');
    s.thoiGian = { ngay: 2, thu: 3, gio: 8, phut: 0, tuan: 1, thang: 10, nam: 2026 };
    s.questNgay = { ngay: 2, viec: [{ id: 'tam_giat', ten: 'Tắm giặt', thuong: 10_000, xong: false }], thuongHet: 50_000, daLanhHet: false };
    const t0 = s.tien;
    const kq = diLamNghe(s);
    if (!kq.ok) throw new Error(kq.lyDo);
    eq(s.tien, t0 + 80_000, 'luong ca goc');
  });
  t('Thăng chức văn phòng: đủ điều kiện → lương 120k + 2 LP', () => {
    const s = taoNguoiChoiSau('saigon', 'Nam', 'van_phong');
    s.kyNang.vanPhong = 2.5;
    s.npc.find(n => n.id === 'duc').quanHe = 40;
    const kq = thangChuc(s);
    if (!kq.ok) throw new Error(kq.lyDo);
    eq(s.luong.ca, 120_000, 'luong moi');
    eq(s.dream.lp, 2, 'LP');
    if (!s.diary.some(d => d.loai === 'thang_chuc')) throw new Error('nhật ký thiếu thăng chức');
  });
  t('Thăng chức thiếu kỹ năng bị chặn kèm lý do rõ', () => {
    const s = taoNguoiChoiSau('saigon', 'Nam', 'van_phong');
    const kq = thangChuc(s);
    if (kq.ok) throw new Error('kỹ năng 1 mà thăng được?');
    if (!kq.lyDo.includes('cấp')) throw new Error('lý do mơ hồ');
  });
  t('NPC giận khi bỏ hẹn: mất 15 Bạn + 20 Mến, dịu lại sau 2 ngày', () => {
    const s = taoNguoiChoiSau('danang', 'Xu', 'van_phong');
    const mai = s.npc.find(n => n.id === 'mai');
    mai.ban = 50; mai.yeu = 30;
    npcHenLo(s, 'mai');
    if (mai.tamTrang !== 'đang giận') throw new Error('không giận');
    if (mai.ban !== 35 || mai.yeu !== 10) throw new Error('mất điểm sai: ' + mai.ban + '/' + mai.yeu);
    mai.gapGanNhat = s.thoiGian.ngay;
    s.thoiGian.ngay += 3;
    for (let i = 0; i < 30; i++) npcSongSau(s, 60);
    if (mai.tamTrang === 'đang giận' && !mai.ghiNho.some(g => g.loai === 'hen_lo')) throw new Error('không ghi nhớ việc bỏ hẹn');
  });
  t('Nhắn tin theo tính cách: người yêu Mai có câu riêng, giận có câu trách', () => {
    const s = taoNguoiChoiSau('saigon', 'Xu', 'van_phong');
    const mai = s.npc.find(n => n.id === 'mai');
    s.banGai = { npcId: 'mai', ngayChot: 1 };
    const tinYeu = tinNhanTheoTamTrang(mai, s);
    const sFA = taoNguoiChoiSau('saigon', 'Xu', 'van_phong');
    const maiFA = sFA.npc.find(n => n.id === 'mai');
    const tinFA = tinNhanTheoTamTrang(maiFA, sFA);
    const boYeu = ['Yêu anh nhiều nha 💕', 'Chiều đón em ăn bún bò Huế nhé?'];
    const boFA = ['Chiều nay ăn lẩu không?', 'Lương về chưa vậy?', 'Cuối tuần đi cà phê bệt nha'];
    if (!boYeu.includes(tinYeu)) throw new Error('người yêu không có câu riêng: ' + tinYeu);
    if (!boFA.includes(tinFA)) throw new Error('FA không đúng bộ câu: ' + tinFA);
    mai.tamTrang = 'đang giận';
    const tinGian = tinNhanTheoTamTrang(mai, s);
    if (!tinGian.includes('hẹn') && !tinGian.includes('tới')) throw new Error('giận không trách: ' + tinGian);
  });
  t('Lịch âm: đếm tới Tết đúng mốc (1/10/2026 còn ~128 ngày)', () => {
    const s = taoNguoiChoiSau('saigon', 'Xu', 'van_phong');
    const { conLaiTet } = ngayAmLich(s);
    if (conLaiTet < 120 || conLaiTet > 140) throw new Error('mốc sai: ' + conLaiTet);
  });
  t('Tết kích hoạt đúng mốc: mùng 1 lì xì +300k chỉ 1 lần', () => {
    const s = taoNguoiChoiSau('saigon', 'Xu', 'van_phong');
    s.thoiGian = { ngay: 6, thu: 7, gio: 8, phut: 0, tuan: 20, thang: 2, nam: 2027 };
    const t0 = s.tien;
    const ra1 = kiemTraTet(s);
    const liXi = ra1.find(x => x.dem === 0);
    if (!liXi) throw new Error('mùng 1 không có lì xì');
    if (s.tien - t0 < 300_000) throw new Error('không nhận lì xì: +' + (s.tien - t0));
    const ra2 = kiemTraTet(s);
    if (ra2.find(x => x.dem === 0)) throw new Error('lì xì 2 lần!');
    if (s.tien !== t0 + ra1.reduce((a, x) => a + (x.tien || 0), 0)) throw new Error('tiền phát sinh lần 2');
  });
  t('Trọn mốc Tết: giao thừa → mùng 7 đều bắn đúng thứ tự', () => {
    const s = taoNguoiChoiSau('saigon', 'Xu', 'van_phong');
    s.thoiGian = { ngay: 5, thu: 6, gio: 8, phut: 0, tuan: 20, thang: 2, nam: 2027 };
    const demDaBắn = new Set();
    for (let d = 0; d < 10; d++) {
      const ra = kiemTraTet(s);
      ra.forEach(x => demDaBắn.add(x.dem));
      s.thoiGian.ngay += 1;
    }
    if (!demDaBắn.has(1)) throw new Error('thiếu giao thừa');
    if (!demDaBắn.has(0)) throw new Error('thiếu mùng 1');
    if (!demDaBắn.has(-6)) throw new Error('thiếu mùng 7');
  });
  t('NPC bỏ bê 4 ngày: nhắn tin nhắc + quan hệ tụt', () => {
    const s = taoNguoiChoiSau('saigon', 'Xu', 'van_phong');
    const linh = s.npc.find(n => n.id === 'linh');
    linh.quanHe = 50; linh.gapGanNhat = 1;
    s.thoiGian.ngay = 5;
    let coNhắn = false;
    for (let i = 0; i < 20; i++) {
      npcSongSau(s, 60);
      if (s.diary.some(d => d.noiDung.includes('im lặng ghê'))) { coNhắn = true; break; }
    }
    if (!coNhắn) throw new Error('4 ngày không nhắn gì');
  });
  t('Làm việc với NPC sau: cảm xúc lây — NPC vui thêm +4, NPC mệt bớt 4 (chênh 8)', () => {
    const sVui = taoNguoiChoiSau('saigon', 'Xu', 'van_phong');
    sVui.tien = 500_000;
    sVui.npc.find(n => n.id === 'linh').tamTrang = 'vui vẻ';
    const t1 = sVui.chiSo.vui;
    lamVoiNpcSau(sVui, 'linh', 'tro_chuyen');
    const them = sVui.chiSo.vui - t1; // +8 trò chuyện +4 lây = +12
    const sMet = taoNguoiChoiSau('saigon', 'Xu2', 'van_phong');
    sMet.tien = 500_000;
    sMet.npc.find(n => n.id === 'linh').tamTrang = 'mệt vì tăng ca';
    const t2 = sMet.chiSo.vui;
    lamVoiNpcSau(sMet, 'linh', 'tro_chuyen');
    const them2 = sMet.chiSo.vui - t2; // +8 - 4 = +4
    if (them - them2 < 6) throw new Error('lây yếu: ' + them + ' vs ' + them2);
  });
  return kq;
}

if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  const kq1 = chayTest();
  const kq2 = chayTestSau();
  const kq = [...kq1, ...kq2];
  for (const [st, ten] of kq) console.log(st + ' | ' + ten);
  const fail = kq.filter(x => x[0] === 'FAIL').length;
  console.log('---');
  console.log(kq.length - fail + '/' + kq.length + ' PASS');
  if (fail > 0) process.exit(1);
}
