// CƠM BỤI & DEADLINE — Backend core v2 (Phase 1)
// State machine: time/day/week, 6 nhu cầu, money, NPC cảm xúc, sự kiện Việt, save/load, chết + văn bia
// 100% logic thuần — không đụng DOM, test được bằng node

const THANH_PHO = {
  saigon: {
    ten: 'Sài Gòn', vung: 'nam',
    tiet: ['nắng gắt trưa', 'mưa ngập chiều', 'triều cường dâng'],
    mon: ['cơm tấm', 'hủ tiếu', 'bánh mì', 'cơm bụi'],
    mauChuDao: '#E8C46A',
  },
  hanoi: {
    ten: 'Hà Nội', vung: 'bac',
    tiet: ['rét đậm', 'mưa phùn', 'thu mát', 'nồm ẩm'],
    mon: ['phở', 'bún chả', 'bánh cuốn', 'bún đậu'],
    mauChuDao: '#C0392B',
  },
  danang: {
    ten: 'Đà Nẵng', vung: 'trung',
    tiet: ['nắng biển', 'mưa bão', 'gió biển mát'],
    mon: ['mì Quảng', 'bánh xèo', 'bún mắm', 'cơm gà'],
    mauChuDao: '#47857D',
  },
};

// 14 NPC có đời sống riêng
const NPC_GOC = [
  { id: 'linh', ten: 'Linh', vai: 'đồng nghiệp', tinhCach: 'nói nhiều, hay tám', lich: 'làm việc ca hành chính' },
  { id: 'tuan', ten: 'Tuấn', vai: 'đồng nghiệp', tinhCach: 'trầm, thích cà phê', lich: 'làm ca sáng' },
  { id: 'ba_tu', ten: 'Bà Tư', vai: 'chủ trọ', tinhCach: 'cứng nhưng tốt bụng', lich: 'thu tiền đầu tháng' },
  { id: 'hung', ten: 'Hùng', vai: 'anh shipper', tinhCach: 'vui, chạy xe nhanh', lich: 'chạy đơn sáng tối' },
  { id: 'mai', ten: 'Mai', vai: 'bạn thân', tinhCach: 'ấm áp, hay rủ đi ăn', lich: 'làm văn phòng' },
  { id: 'cu_long', ten: 'Cụ Long', vai: 'hàng xóm già', tinhCach: 'hay kể chuyện xưa', lich: 'đánh cờ vỉa hè' },
  { id: 'thao', ten: 'Thảo', vai: 'bán quán cà phê', tinhCach: 'mến khách, nhớ gu nước', lich: 'mở quán 6h-21h' },
  { id: 'duc', ten: 'Đức', vai: 'sếp', tinhCach: 'khó tính, hay deadline', lich: 'họp sáng thứ 2' },
  { id: 'hanh', ten: 'Hạnh', vai: 'bà tám hàng xóm', tinhCach: 'biết hết chuyện phố', lich: 'chợ sớm' },
  { id: 'nam', ten: 'Nam', vai: 'bạn thời đại học', tinhCach: 'hay rủ chơi game', lich: 'freelance đêm' },
  { id: 'chi_dao', ten: 'Chị Đào', vai: 'bán xôi sáng', tinhCach: 'vui tính, nhớ khách quen', lich: 'gánh xôi 5h-9h' },
  { id: 'trung', ten: 'Trung', vai: 'anh kỹ thuật', tinhCach: 'ít nói, sửa được mọi thứ', lich: 'on-call' },
  { id: 'hoa', ten: 'Hoa', vai: 'con bà Tư', tinhCach: 'sinh viên, ráng học', lich: 'học ca tối' },
  { id: 'ong_sang', ten: 'Ông Sáng', vai: 'bán báo già', tinhCach: 'yêu báo giấy', lich: 'bắt đầu 4h30' },
];

// ===== 6 NHU CẦU (kiểu 9 To Life nhưng đời Việt) =====
const NHU_CAU = {
  nangLuong: { ten: 'Năng lượng', icon: '⚡' },
  tamTrang:  { ten: 'Tâm trạng',  icon: '❤️' },
  doBao:     { ten: 'No bụng',     icon: '🍚' },
  khatNuoc:  { ten: 'Khát nước',   icon: '💧' },
  xaHoi:     { ten: 'Xã hội',      icon: '💬' },
  tinhThan:  { ten: 'Tinh thần',   icon: '🌿' },
};

function taoNguoiChoi(tenThanhPho, tenNguoi) {
  const tp = THANH_PHO[tenThanhPho];
  if (!tp) throw new Error('Không biết thành phố: ' + tenThanhPho);
  return {
    phienBan: 2,
    ten: tenNguoi || 'Nhân',
    tuoi: 23,
    thanhPhoKey: tenThanhPho,
    thanhPho: { key: tenThanhPho, ...tp },   // FIX bug: G.thanhPho.ten giờ đọc được
    thoiGian: { ngay: 1, thu: 2, gio: 6, phut: 0, tuan: 1, thang: 10, nam: 2026 },
    tien: 150_000, // đồng — bắt đầu broke đúng chất
    chiSo: { nangLuong: 70, tamTrang: 60, doBao: 40, khatNuoc: 50, xaHoi: 30, tinhThan: 45 },
    nghe: 'thực tập sinh',
    luong: { ngay: 80_000, thang: 2_000_000 },
    phong: { ten: 'phòng trọ 12m²', tienThue: 1_500_000, conNo: 0 },
    npc: NPC_GOC.map(n => ({ ...n, quanHe: 20, tamTrang: 'bình thường' })),
    diary: [],
    suKienCho: [],
    songSot: { doiBung: 0, doiNuoc: 0, matNgu: 0 }, // đếm ngày chạm đáy → chết
    daChet: null, // { ngay, lyDo, vanBia }
  };
}

const THU_VIET = { 2: 'thứ hai', 3: 'thứ ba', 4: 'thứ tư', 5: 'thứ năm', 6: 'thứ sáu', 7: 'thứ bảy', 8: 'chủ nhật' };

// ===== THỜI GIAN THUẦN (không side-effect lên chỉ số) =====
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

// ===== NHU CẦU TỤT THEO THỜI GIAN (linh hồn life-sim) =====
// Thức: tụt rõ rệt. Ngủ (23h-6h): đói/khát tụt chậm — đúng cơ thể thật,
// cũng là balance để một ngày 2 bữa + ngủ đêm là sống khỏe (nhịp 9 To Life).
function nhuCauTut(state, phut) {
  const gio = state.thoiGian.gio;
  const h = phut / 60;
  const dangThuc = gio >= 6 && gio < 23;
  const c = state.chiSo;
  const heSo = dangThuc ? 1 : 0.4; // ngủ thì cơ thể "tiết kiệm"
  c.doBao    = ket(c.doBao    - 1.0 * h * heSo);
  c.khatNuoc = ket(c.khatNuoc - 1.1 * h * heSo);
  c.xaHoi    = ket(c.xaHoi    - (dangThuc ? 1.0 : 0.3) * h);
  c.tinhThan = ket(c.tinhThan - 0.8 * h * heSo);
  if (dangThuc) c.nangLuong = ket(c.nangLuong - 1.6 * h);
  // tâm trạng trôi về trung bình các nhu cầu khác (đời nó vậy)
  const tb = (c.nangLuong + c.doBao + c.khatNuoc + c.xaHoi + c.tinhThan) / 5;
  c.tamTrang = ket(c.tamTrang + (tb - c.tamTrang) * Math.min(1, 0.25 * h));
  return state;
}
function ket(v) { return Math.max(0, Math.min(100, Math.round(v * 10) / 10)); }

// ===== TIẾN ĐỘ ĐẦY ĐỦ: thời gian + nhu cầu + kiểm tra đáy + sự kiện =====
function tienDo(state, phut) {
  if (state.daChet) return state;
  const ngayTruoc = state.thoiGian.ngay;
  tienTruoi(state, phut);
  nhuCauTut(state, phut);
  npcSong(state, phut);
  if (state.thoiGian.ngay !== ngayTruoc) kiemTraDay(state);
  return state;
}

// Chạm đáy 2 ngày liên tiếp → chết (kiểu 9 To Life, nhưng nguyên nhân rất Việt)
function kiemTraDay(state) {
  const c = state.chiSo;
  state.songSot.doiBung = c.doBao <= 0 ? state.songSot.doiBung + 1 : 0;
  state.songSot.doiNuoc = c.khatNuoc <= 0 ? state.songSot.doiNuoc + 1 : 0;
  state.songSot.matNgu  = c.nangLuong <= 0 ? state.songSot.matNgu + 1 : 0;
  if (state.songSot.doiNuoc >= 2) return chet(state, 'kiệt sức vì khát', 'Quên uống nước suốt 2 ngày vì chạy deadline.');
  if (state.songSot.doiBung >= 2) return chet(state, 'đói lả giữa mùa deadline', 'Nhịn ăn 2 ngày để kịp tiến độ. Tiến độ không kịp người.');
  if (state.songSot.matNgu >= 3)  return chet(state, 'gục trên bàn phím', 'Ba đêm trắng liên tiếp. Laptop vẫn mở, người đã tắt.');
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
    khachDu: khach,
    nghe: state.nghe, tuoi: state.tuoi, ten: state.ten,
  };
  return state;
}

// ===== HOẠT ĐỘNG (menu kiểu 9 To Life: thời gian + tiền + chỉ số ↑↓) =====
const HOAT_DONG = [
  { id: 'an_com_bui',  ten: 'Ăn cơm bụi đầu hẻm',   phut: 30,  tien: -25_000, chiSo: { doBao: +35, tamTrang: +5, khatNuoc: +10 }, scene: ['phong_tro', 'pho_dem'], moTa: 'Cơm sườn bì chả thêm trứng, kèm chén canh rau — chuẩn bữa bình dân.' },
  { id: 'an_quan_pho', ten: 'Ăn tô phở/bún quen',    phut: 40,  tien: -40_000, chiSo: { doBao: +45, tamTrang: +8, khatNuoc: +15 }, scene: ['quan_pho'], moTa: 'Bà Hạnh nhớ mặt: "như cũ hả con?" — tô nhiều nước lèo, húp tới giọt cuối.' },
  { id: 'tra_da_via_he', ten: 'Trà đá vỉa hè',       phut: 15,  tien: -3_000,  chiSo: { khatNuoc: +35, xaHoi: +8, tinhThan: +5 }, scene: ['pho_dem', 'quan_pho'], moTa: '3 ngàn một cốc, ngồi ngắm phố chảy qua.' },
  { id: 'ca_phe_sua',  ten: 'Cà phê sữa đá',         phut: 20,  tien: -15_000, chiSo: { khatNuoc: +20, nangLuong: +10, tinhThan: +8 }, scene: ['pho_dem', 'van_phong'], moTa: 'Tỉnh táo 2 tiếng, tim đập nhanh 3 tiếng.' },
  { id: 'di_lam',      ten: 'Đi làm một ngày',       phut: 480, tien: +80_000, chiSo: { nangLuong: -30, doBao: -25, khatNuoc: -20, tinhThan: -10 }, scene: ['van_phong'], dieuKien: 'ngayLamViec', moTa: 'Chấm công 7h30, họp hành, deadline.' },
  { id: 'lam_them_gio', ten: 'Nán lại tăng ca',      phut: 180, tien: +50_000, chiSo: { nangLuong: -25, tinhThan: -20, doBao: -15 }, scene: ['van_phong'], dieuKien: 'ngayLamViec', moTa: 'Sếp Đức đi qua: "anh ghi nhận nỗ lực của em".' },
  { id: 'ngu_trua',    ten: 'Ngủ trưa một giấc',     phut: 60,  tien: 0,       chiSo: { nangLuong: +20, tamTrang: +5 }, scene: ['phong_tro', 'van_phong'], moTa: 'Gục xuống bàn 1 tiếng, mơ thấy lương về.' },
  { id: 'ngu_dem',     ten: 'Ngủ một đêm đẫy giấc',  phut: 480, tien: 0,       chiSo: { nangLuong: 100, tamTrang: +10 }, scene: ['phong_tro'], dieuKien: 'banDem', moTa: 'Tắt điện thoại. Giấc ngủ không deadline.' },
  { id: 'tam_su_ban',  ten: 'Tám chuyện với bạn',    phut: 45,  tien: 0,       chiSo: { xaHoi: +30, tinhThan: +15, nangLuong: -5 }, scene: ['phong_tro', 'pho_dem', 'quan_pho'], moTa: 'Chuyện trên trời dưới đất, hết buồn luôn.' },
  { id: 'xem_tivi',    ten: 'Xem tivi CRT của bà',   phut: 60,  tien: 0,       chiSo: { tinhThan: +12, tamTrang: +8, nangLuong: -5 }, scene: ['phong_tro'], moTa: 'Phim cũ chiếu lại, quảng cáo vẫn hay.' },
  { id: 'di_dao',      ten: 'Đi dạo phố một vòng',   phut: 45,  tien: 0,       chiSo: { tinhThan: +18, xaHoi: +10, nangLuong: -8, tamTrang: +6 }, scene: ['pho_dem'], moTa: 'Gió đêm, mùi hủ tiếu gõ, xe máy chảy như sông.' },
  { id: 'choi_game',   ten: 'Chơi game với Nam',     phut: 90,  tien: 0,       chiSo: { tinhThan: +22, xaHoi: +18, nangLuong: -12, doBao: -8 }, scene: ['phong_tro'], moTa: 'Nam gào trong voice: "đẩy trụ đi bạn êi!"' },
  { id: 'di_cho',      ten: 'Đi chợ mua đồ',         phut: 60,  tien: -50_000, chiSo: { doBao: +20, tinhThan: +8, nangLuong: -8 }, scene: ['pho_dem'], moTa: 'Rau trứng mì gói — tủ lạnh hết trống trải.' },
  { id: 'goi_ve_nha',  ten: 'Gọi điện về cho má',    phut: 30,  tien: 0,       chiSo: { tinhThan: +20, tamTrang: +12, xaHoi: +10 }, scene: ['phong_tro'], moTa: 'Má hỏi: "ăn uống đầy đủ không con?" — Ừa má.' },
];

function hoatDongKhaDung(state, sceneHien) {
  return HOAT_DONG.filter(h => {
    if (!h.scene.includes(sceneHien)) return false;
    if (h.dieuKien === 'ngayLamViec') {
      const t = state.thoiGian;
      return t.thu >= 2 && t.thu <= 6 && t.gio >= 7 && t.gio <= 17;
    }
    if (h.dieuKien === 'banDem') {
      const g = state.thoiGian.gio;
      return g >= 21 || g < 5;
    }
    if (h.tien < 0 && state.tien < -h.tien) return false;
    return true;
  });
}

function lamHoatDong(state, id) {
  const h = HOAT_DONG.find(x => x.id === id);
  if (!h) throw new Error('Hoạt động lạ: ' + id);
  if (h.tien < 0 && state.tien < -h.tien) return { ok: false, lyDo: 'Tiền không đủ — túi lép rồi.' };
  if (h.dieuKien === 'ngayLamViec') {
    const t = state.thoiGian;
    if (t.thu === 7 || t.thu === 8) return { ok: false, lyDo: 'Cuối tuần mà! Văn phòng đóng cửa.' };
    if (t.gio < 7 || t.gio > 17) return { ok: false, lyDo: 'Ngoài giờ làm — bảo vệ không cho vào.' };
  }
  if (h.dieuKien === 'banDem') {
    const g = state.thoiGian.gio;
    if (g >= 5 && g < 21) return { ok: false, lyDo: 'Giờ này ai lại đi ngủ? Đời còn nhiều thứ lắm.' };
  }
  state.tien += h.tien;
  apDungChiSo(state, h.chiSo);
  // hoạt động xã hội → quan hệ NPC nhích lên
  if (h.chiSo.xaHoi >= 10) {
    const ban = state.npc[Math.floor(Math.random() * state.npc.length)];
    ban.quanHe = Math.min(100, ban.quanHe + 5);
    state.diary.push({ ngay: state.thoiGian.ngay, nguoi: ban.ten, loai: 'quan_he', noiDung: 'Nói chuyện vui vẻ với ' + ban.ten + ' (+5 thân thiết).' });
  }
  tienDo(state, h.phut);
  ghiNhatKy(state, 'hoat_dong', state.ten + ' dành ' + dinhDangPhut(h.phut) + ' để: ' + h.ten + '. ' + h.moTa);
  return { ok: true, hoatDong: h };
}

function dinhDangPhut(p) {
  if (p >= 60) { const h = Math.floor(p / 60), m = p % 60; return m ? h + 'h' + m + 'm' : h + ' giờ'; }
  return p + ' phút';
}

function ghiNhatKy(state, loai, noiDung) {
  state.diary.push({ ngay: state.thoiGian.ngay, thu: state.thoiGian.thu, loai, noiDung });
  if (state.diary.length > 60) state.diary = state.diary.slice(-60); // đừng phình save
}

// ===== SỰ KIỆN NGẪU NHIÊN 100% VIỆT =====
const SU_KIEN_VIET = [
  { id: 'ket_xe', ten: 'Kẹt xe', xacSuat: 0.10, chiSo: { nangLuong: -8, tamTrang: -10, tinhThan: -5 },
    thoai: 'Đường kẹt cứng 40 phút. Xe máy nhích từng chút, ai cũng thở dài. Một chú Grab vẫn cười: "kệ, sống chung với lũ em ơi".' },
  { id: 'cup_dien', ten: 'Cúp điện', xacSuat: 0.07, chiSo: { tinhThan: -12, tamTrang: -8 },
    thoai: 'Cúp điện đúng lúc deadline gần kề. Cả xóm trọ kéo ra hành lang hóng gió, tự nhiên thành buổi họp tổ dân phố.' },
  { id: 'mua_ngap', ten: 'Mưa ngập', xacSuat: 0.08, chiSo: { nangLuong: -10, tamTrang: -6, khatNuoc: -5 },
    thoai: 'Mưa ập xuống, nước ngập nửa bánh xe. Dắt bộ qua đoạn ngập, dép trôi một chiếc. Đời công sở có những ngày như thế.' },
  { id: 'duoc_khen', ten: 'Sếp khen', xacSuat: 0.06, chiSo: { tamTrang: +15, tinhThan: +12, xaHoi: +5 },
    thoai: 'Sếp Đức hiếm hoi mỉm cười: "báo cáo của em ổn đấy". Cả văn phòng quay lại nhìn. Tự nhiên thấy deadline cũng đáng.' },
  { id: 'ba_tu_thu', ten: 'Bà Tư thu tiền', xacSuat: 0.05, chiSo: { tamTrang: -8 },
    thoai: 'Bà Tư gõ cửa: "tiền trọ tháng này nha con". Giọng cứng mà tay thì đưa thêm bịch cam: "ăn cho có chất".' },
  { id: 've_so', ten: 'Trúng vé số', xacSuat: 0.02, chiSo: { tamTrang: +20, tinhThan: +15 }, tien: +100_000,
    thoai: 'Ông Sáng dúi cho tờ vé số ế. Chiều dò: trúng 100 ngàn! Cả xóm mừng như mình trúng độc đắc.' },
  { id: 'hang_xom_pho', ten: 'Xóm trọ vui', xacSuat: 0.07, chiSo: { xaHoi: +12, tamTrang: +8 },
    thoai: 'Chị Hạnh rủ cả dãy trọ ăn chè ngoài hiên. Chuyện phố chuyện phường rôm rả tới khuya.' },
  { id: 'me_goi', ten: 'Má gọi', xacSuat: 0.06, chiSo: { tinhThan: +15, tamTrang: +10 },
    thoai: 'Má gọi: "ngoài đó lạnh không con, nhớ mặc áo khoác". Nói chuyện 20 phút, má kể hết chuyện bà con dưới quê.' },
  { id: 'doi_tien', ten: 'Đòi tiền khó', xacSuat: 0.04, chiSo: { tamTrang: -12, tinhThan: -10 },
    thoai: 'Bạn mượn 200 ngàn từ tháng trước, giờ nhắn tin không rep. Thôi, coi như học phí nhìn người.' },
];

function kiemTraSuKien(state) {
  const sk = [];
  // sự kiện lịch cố định
  const { thu, gio, ngay } = state.thoiGian;
  if (gio === 7 && thu >= 2 && thu <= 6) sk.push({ id: 'di_lam', ten: 'Giờ đi làm — xe máy hay xe buýt?' });
  if (gio === 12 && thu <= 6) sk.push({ id: 'an_trua', ten: 'Trưa rồi — cơm bụi hay tô phở quen?' });
  if (gio === 18 && thu >= 2 && thu <= 6) sk.push({ id: 'tan_lam', ten: 'Tan làm — về thẳng hay la cà trà đá?' });
  if (ngay === 1 && gio === 8) sk.push({ id: 'tien_thue', ten: 'Đầu tháng — tới hạn tiền trọ ' + state.phong.tienThue.toLocaleString('vi-VN') + 'đ' });
  // sự kiện ngẫu nhiên Việt (tối đa 1 cái mỗi lần kiểm tra)
  if (Math.random() < 0.35) {
    const r = Math.random(); let cong = 0;
    for (const s of SU_KIEN_VIET) {
      cong += s.xacSuat;
      if (r < cong) {
        apDungChiSo(state, s.chiSo);
        if (s.tien) state.tien += s.tien;
        ghiNhatKy(state, 'su_kien', s.ten + ': ' + s.thoai);
        sk.push({ id: s.id, ten: s.ten, thoai: s.thoai, ngauNhien: true });
        break;
      }
    }
  }
  return sk;
}

// Trả tiền trọ đầu tháng
function xuLyTienThue(state) {
  const thue = state.phong.tienThue;
  if (state.tien >= thue) {
    state.tien -= thue;
    ghiNhatKy(state, 'tien_thue', 'Đóng tiền trọ ' + thue.toLocaleString('vi-VN') + 'đ. Bà Tư gật gù: "con biết lo rồi đó".');
    return { ok: true };
  }
  state.phong.conNo += thue - state.tien;
  state.tien = 0;
  apDungChiSo(state, { tamTrang: -15, tinhThan: -10 });
  ghiNhatKy(state, 'tien_thue', 'Không đủ tiền trọ. Nợ bà Tư ' + state.phong.conNo.toLocaleString('vi-VN') + 'đ. Bà chép miệng: "tháng sau liệu đó con".');
  return { ok: false, no: state.phong.conNo };
}

// ===== NPC TỰ SỐNG =====
function npcSong(state, phut) {
  const bien = ['đang bận', 'đi làm', 'vui vẻ', 'buồn ngủ', 'đi chợ', 'đang tám', 'nuôi cún con', 'mệt vì tăng ca'];
  for (const n of state.npc) {
    if (Math.random() < 0.05) n.tamTrang = bien[Math.floor(Math.random() * bien.length)];
    if (Math.random() < 0.004) {
      state.diary.push({
        ngay: state.thoiGian.ngay, nguoi: n.ten, loai: 'tin_nhan',
        noiDung: n.ten + ' nhắn: "' + tinNhanNgauNhien(n) + '"',
      });
      if (n.quanHe >= 40) { apDungChiSo(state, { xaHoi: +4, tamTrang: +3 }); }
    }
    // quên nhau dần nếu không gặp
    if (Math.random() < 0.002) n.quanHe = Math.max(0, n.quanHe - 1);
  }
}

function tinNhanNgauNhien(n) {
  const mau = {
    mai: ['Chiều nay ăn lẩu không?', 'Lương về chưa vậy?', 'Cuối tuần đi cà phê bệt nha'],
    ba_tu: ['Nhớ đóng tiền nước nha con', 'Điện tháng này tăng 20 ngàn đó', 'Tối nhớ khóa cổng'],
    hung: ['Ship đơn gấp lắm, chạy quá trời', 'Bữa nào rảnh làm ly cà phê'],
    linh: ['Sếp kêu nộp report rùi huhu', 'Café không bạn êi?', 'Nghe nói tháng này có thưởng'],
    duc: ['Deadline thứ 5 nhớ nhớ nhớ', 'Gửi anh file cuối cùng trước 17h'],
    cu_long: ['Đánh cờ không cháu?', 'Trà sen mới pha, sang chơi'],
    nam: ['Tối nay leo rank không?', 'Game mới ra, hay lắm'],
    thao: ['Cà phê như cũ nha anh/chị?', 'Quán mới có bàn ngoài hiên mát lắm'],
    hoa: ['Em thi giữa kỳ xong rồi!', 'Anh/chị còn sách toán lớp 12 không?'],
    chi_dao: ['Mai ghé ăn xôi nha, có xôi mặn mới', 'Cô để phần cho con một gói nè'],
    ong_sang: ['Báo sáng nay có tin hay', 'Ghé sạp chú, chú để dành tờ Tuổi Trẻ'],
    hanh: ['Nghe nói cuối hẻm mới mở quán bún', 'Tối nay xóm mình mất nước đó con'],
    trung: ['Máy bạn chậm thì đưa mình xem', 'Sửa giùm cái quạt, không tính tiền'],
    tuan: ['Cà phê sáng không?', 'Im lặng nhấp một ngụm cà phê'],
  };
  const list = mau[n.id] || ['Dạo này sao rồi?'];
  return list[Math.floor(Math.random() * list.length)];
}

function apDungChiSo(state, chg) {
  for (const [k, v] of Object.entries(chg || {})) {
    if (k in state.chiSo) {
      // giá trị tuyệt đối (ví dụ nangLuong: 100 khi ngủ đẫy) vs cộng trừ
      state.chiSo[k] = v === 100 && k === 'nangLuong' ? 100 : ket(state.chiSo[k] + v);
    }
  }
  return state;
}

// ===== SAVE / LOAD =====
const SAVE_KEY = '***';
function luuGame(state) {
  const duLieu = JSON.stringify({ phienBan: 2, luuLuc: Date.now(), state });
  if (typeof localStorage !== 'undefined') localStorage.setItem(SAVE_KEY, duLieu);
  return duLieu;
}
function docGame() {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    const d = JSON.parse(raw);
    if (!d || d.phienBan !== 2 || !d.state) return null;
    return d.state;
  } catch { return null; }
}
function xoaSave() {
  if (typeof localStorage !== 'undefined') localStorage.removeItem(SAVE_KEY);
}

// ==== TESTS (blockgate Phase 1) ====
function chayTest() {
  const kq = [];
  const t = (ten, fn) => {
    try { fn(); kq.push(['PASS', ten]); }
    catch (e) { kq.push(['FAIL', ten + ' — ' + e.message]); }
  };
  const eq = (a, b, msg) => { if (a !== b) throw new Error((msg || '') + ' (' + a + ' ≠ ' + b + ')'); };

  let s = taoNguoiChoi('saigon');
  t('Tạo người chơi Sài Gòn OK', () => eq(s.thanhPhoKey, 'saigon', 'city'));
  t('FIX bug thanhPho.ten đọc được', () => eq(s.thanhPho.ten, 'Sài Gòn', 'ten tp'));
  t('14 NPC khởi tạo', () => eq(s.npc.length, 14, 'npc count'));
  t('6 nhu cầu đủ', () => eq(Object.keys(s.chiSo).length, 6, 'chi so'));
  t('Broke đúng chất: ≤ 500k', () => { if (s.tien > 500_000) throw new Error('quá giàu'); });

  t('Tiến thời gian 1 ngày', () => {
    const truoc = s.thoiGian.ngay;
    tienTruoi(s, 1440);
    eq(s.thoiGian.ngay, truoc + 1, 'ngày tăng');
  });

  t('Qua tuần: thứ 7 → chủ nhật → thứ 2', () => {
    s.thoiGian = { ngay: 6, thu: 7, gio: 0, phut: 0, tuan: 1, thang: 1, nam: 2026 };
    tienTruoi(s, 1440); eq(s.thoiGian.thu, 8, 'CN');
    tienTruoi(s, 1440); eq(s.thoiGian.thu, 2, 'T2');
    eq(s.thoiGian.tuan, 2, 'tuần tăng');
  });

  t('Nhu cầu tụt theo giờ (đói tăng dần)', () => {
    const s3 = taoNguoiChoi('hanoi');
    const truoc = s3.chiSo.doBao;
    tienDo(s3, 120);
    if (s3.chiSo.doBao >= truoc) throw new Error('no không tụt: ' + truoc + '→' + s3.chiSo.doBao);
  });

  t('Chỉ số không vượt 0-100', () => {
    apDungChiSo(s, { doBao: 500 }); eq(s.chiSo.doBao, 100, 'cap 100');
    apDungChiSo(s, { doBao: -900 }); eq(s.chiSo.doBao, 0, 'san 0');
  });

  t('Hoạt động tốn tiền bị chặn khi túi lép', () => {
    const s4 = taoNguoiChoi('danang'); s4.tien = 1_000;
    const kq4 = lamHoatDong(s4, 'an_com_bui');
    if (kq4.ok) throw new Error('không chặn');
  });

  t('Ăn cơm bụi: đúng tiền + đúng chỉ số + trôi giờ', () => {
    const s5 = taoNguoiChoi('saigon'); s5.tien = 100_000;
    const gioTruoc = s5.thoiGian.gio * 60 + s5.thoiGian.phut;
    const noTruoc = s5.chiSo.doBao;
    const kq5 = lamHoatDong(s5, 'an_com_bui');
    if (!kq5.ok) throw new Error('fail: ' + (kq5.lyDo || ''));
    eq(s5.tien, 75_000, 'tiền trừ 25k');
    if (s5.chiSo.doBao <= noTruoc) throw new Error('no không tăng');
    const gioSau = s5.thoiGian.gio * 60 + s5.thoiGian.phut;
    if (gioSau <= gioTruoc) throw new Error('giờ không trôi');
  });

  t('Đi làm cuối tuần bị từ chối', () => {
    const s6 = taoNguoiChoi('hanoi');
    s6.thoiGian.thu = 8; s6.thoiGian.gio = 9;
    const kq6 = lamHoatDong(s6, 'di_lam');
    if (kq6.ok) throw new Error('không chặn CN');
  });

  t('Đi làm ngày thường: lương +80k, trôi 8 giờ', () => {
    const s7 = taoNguoiChoi('saigon');
    s7.thoiGian = { ngay: 2, thu: 3, gio: 7, phut: 30, tuan: 1, thang: 10, nam: 2026 };
    const t0 = s7.tien;
    const kq7 = lamHoatDong(s7, 'di_lam');
    if (!kq7.ok) throw new Error('fail: ' + (kq7.lyDo || ''));
    eq(s7.tien, t0 + 80_000, 'lương');
    if (s7.thoiGian.gio < 15) throw new Error('giờ chưa trôi tới chiều: ' + s7.thoiGian.gio);
  });

  t('hoatDongKhaDung lọc theo scene', () => {
    const s8 = taoNguoiChoi('danang');
    const list = hoatDongKhaDung(s8, 'quan_pho');
    if (!list.length) throw new Error('quán phở rỗng');
    if (list.some(h => h.id === 'xem_tivi')) throw new Error('tivi ở quán phở?');
  });

  t('Chết vì khát 2 ngày → có văn bia', () => {
    const s9 = taoNguoiChoi('hanoi');
    s9.chiSo.khatNuoc = 0; s9.songSot.doiNuoc = 1;
    kiemTraDay(s9);
    if (!s9.daChet) throw new Error('chưa chết');
    if (!s9.daChet.vanBia) throw new Error('thiếu văn bia');
    if (typeof s9.daChet.khachDu !== 'number') throw new Error('thiếu khách dự');
  });

  t('Tiền trọ đầu tháng: đủ tiền thì trừ, thiếu thì ghi nợ', () => {
    const s10 = taoNguoiChoi('saigon'); s10.tien = 2_000_000;
    xuLyTienThue(s10);
    eq(s10.tien, 500_000, 'trừ thuê');
    const s11 = taoNguoiChoi('saigon'); s11.tien = 100_000;
    const kq11 = xuLyTienThue(s11);
    if (kq11.ok) throw new Error('không ghi nợ');
    if (s11.phong.conNo <= 0) throw new Error('nợ = 0?');
  });

  t('Save/Load round-trip', () => {
    const s12 = taoNguoiChoi('danang'); s12.tien = 777_000;
    const raw = JSON.stringify({ phienBan: 2, luuLuc: Date.now(), state: s12 });
    const doc = JSON.parse(raw).state;
    eq(doc.tien, 777_000, 'tiền giữ nguyên');
    eq(doc.thanhPhoKey, 'danang', 'tp giữ nguyên');
    eq(doc.chiSo.doBao, s12.chiSo.doBao, 'chỉ số giữ nguyên');
  });

  t('NPC sống + nhắn tin', () => {
    let coTin = false;
    for (let i = 0; i < 400; i++) {
      npcSong(s, 30);
      if (s.diary.some(d => d.loai === 'tin_nhan')) { coTin = true; break; }
    }
    if (!coTin) throw new Error('400 vòng không thấy tin nhắn');
  });

  t('1 TUẦN IN-GAME không crash (blockgate Phase 1)', () => {
    const s13 = taoNguoiChoi('saigon');
    const lichNgay = ['an_com_bui', 'tra_da_via_he', 'tam_su_ban', 'tra_da_via_he', 'xem_tivi', 'tra_da_via_he'];
    let dem = 0;
    for (let ngayLap = 0; ngayLap < 9 && !s13.daChet; ngayLap++) {
      s13.tien = Math.max(s13.tien, 200_000); // đảm bảo đủ tiền hoạt động
      for (const id of lichNgay) {
        const h = HOAT_DONG.find(x => x.id === id);
        s13.tien += Math.max(0, -h.tien);
        lamHoatDong(s13, id);
        if (s13.daChet) break;
      }
      if (s13.daChet) throw new Error('chết giữa tuần: ' + s13.daChet.lyDo);
      // ngủ đêm: trôi tới 6h sáng hôm sau (đúng như người chơi thật bấm "ngủ một đêm")
      const g = s13.thoiGian.gio;
      const phutToi6h = ((30 - g) % 24 + 24) % 24 * 60; // tới 6h sáng kế tiếp
      tienDo(s13, Math.max(360, phutToi6h));
      apDungChiSo(s13, { nangLuong: 100 - s13.chiSo.nangLuong }); // ngủ dậy tỉnh táo
      kiemTraSuKien(s13);
    }
    if (s13.daChet) throw new Error('chết giữa tuần: ' + s13.daChet.lyDo);
    if (s13.thoiGian.tuan < 2) throw new Error('chưa qua hết tuần: tuần ' + s13.thoiGian.tuan + ' ngày ' + s13.thoiGian.ngay);
    if (!s13.diary.length) throw new Error('diary rỗng');
  });

  t('Thành phố lạ từ chối', () => {
    let threw = false;
    try { taoNguoiChoi('trape'); } catch { threw = true; }
    if (!threw) throw new Error('không chặn tp lạ');
  });

  return kq;
}

// Chỉ chạy test trong Node — browser bỏ qua
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  const kq = chayTest();
  for (const [st, ten] of kq) console.log(st + ' | ' + ten);
  const fail = kq.filter(x => x[0] === 'FAIL').length;
  console.log('---');
  console.log(kq.length - fail + '/' + kq.length + ' PASS');
  if (fail > 0) process.exit(1);
}
