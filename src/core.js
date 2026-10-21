// PHỐ ĐÊM TRỞ VỀ — Backend core v1 (Phase 0.3)
// State machine: time/day/week, money, stats, NPCs, event queue
// 100% logic thuần — không đụng DOM, test được bằng node

const THANH_PHO = {
  saigon: {
    ten: 'Sài Gòn',
    vung: 'nam',
    tiet: ['nắng gắt trưa', 'mưa ngập chiều', 'đông ôn hoà'],
    mon: ['cơm tấm', 'hủ tiếu', 'bánh mì'],
    mauChuDao: '#E8C46A',
  },
  hanoi: {
    ten: 'Hà Nội',
    vung: 'bac',
    tiet: ['rét đậm', 'mưa phùn', 'thu mát'],
    mon: ['phở', 'bún chả', 'bánh cuốn'],
    mauChuDao: '#C0392B',
  },
  danang: {
    ten: 'Đà Nẵng',
    vung: 'trung',
    tiet: ['nắng biển', 'bão tháng 10', 'mát gió biển'],
    mon: ['mì Quảng', 'bánh xèo', 'bún mắm'],
    mauChuDao: '#47857D',
  },
};

// 14 NPC có đời sống riêng (giống 9 To Life nhưng 100% Việt)
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
  { id: 'nam', ten: 'Nam', vai: 'bạn thời đại học', tinhCach: 'hay mời chơi game', lich: 'freelance đêm' },
  { id: 'chi_dao', ten: 'Chị Đào', vai: 'bán xôi sáng', tinhCach: 'vui tính, nhớ khách quen', lich: 'gánh xôi 5h-9h' },
  { id: 'trung', ten: 'Trung', vai: 'anh kỹ thuật', tinhCach: 'ít nói, sửa được mọi thứ', lich: 'on-call' },
  { id: 'hoa', ten: 'Hoa', vai: 'con bà Tư', tinhCach: 'sinh viên, ráng học', lich: 'học ca tối' },
  { id: 'ong_sang', ten: 'Ông Sáng', vai: 'bán báo già', tinhCach: 'yêu báo giấy', lich: 'bắt đầu 4h30' },
];

// Thuộc tính nhân vật người chơi
function taoNguoiChoi(tenThanhPho) {
  const tp = THANH_PHO[tenThanhPho];
  if (!tp) throw new Error('Không biết thành phố: ' + tenThanhPho);
  return {
    thanhPho: tenThanhPho,
    theGioi: { ...tp },
    thoiGian: { ngay: 1, thu: 2, gio: 6, phut: 0, tuan: 1, thang: 1, nam: 1998 },
    tien: 150_000, // đồng — bắt đầu broke đúng chất
    chiSo: { nangLuong: 70, tamTrang: 60, doBao: 40, dangSacMat: 50 },
    nghe: 'thực tập sinh',
    luong: { ngay: 80_000, cong: 1_500_000 },
    phong: { ten: 'phòng trọ 12m²', tientruoc: 500_000, conno: 0 },
    npc: NPC_GOC.map(n => ({ ...n, quanHe: 20, tamTrang: 'bình thường', nhacLai: [] })),
    diary: [],
    suKienCho: [],
  };
}

const THU_VIET = { 2: 'thứ hai', 3: 'thứ ba', 4: 'thứ tư', 5: 'thứ năm', 6: 'thứ sáu', 7: 'thứ bảy', 8: 'chủ nhật' };

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

// Sự kiện theo giờ/ngày — queue đơn giản
function kiemTraSuKien(state) {
  const { thu, gio } = state.thoiGian;
  const sk = [];
  if (gio === 7 && thu >= 2 && thu <= 6) sk.push({ id: 'di_lam', ten: 'Giờ đi làm', chiSo: { nangLuong: -10 } });
  if (gio === 12 && thu <= 6) sk.push({ id: 'an_trua', ten: 'Trưa rồi — cơm tấm hay cà phê?', chiSo: { doBao: +25 } });
  if (gio === 18 && thu <= 5) sk.push({ id: 'tan_lam', ten: 'Tan làm — về hay đi chơi?', chiSo: { tamTrang: +10 } });
  if (thu === 8 && gio === 9) sk.push({ id: 'tuan_moi', ten: 'Chủ nhật — lượn chợ hay nằm nhà' });
  return sk;
}

// NPC tự sống: mỗi lần nhảy thời gian, NPC có biến chuyển
function npcSong(state, phut) {
  const bien = ['đang bận', 'đi làm', 'đau bụng', 'vui vẻ', 'buồn ngủ', 'đi chợ', 'đang tám', 'nuôi cún con'];
  for (const n of state.npc) {
    if (Math.random() < 0.3) {
      n.tamTrang = bien[Math.floor(Math.random() * bien.length)];
      // 10%: nhắn tin cho mình
      if (Math.random() < 0.1) {
        state.diary.push({
          ngay: state.thoiGian.ngay,
          nguoi: n.ten,
          loai: 'tin_nhan',
          noiDung: n.ten + ' nhắn: "' + tinNhanNgauNhien(n) + '"',
        });
      }
    }
  }
}

function tinNhanNgauNhien(n) {
  const mau = {
    mai: ['Chiều nay ăn lẩu không?', 'Má ơi lương về chưa?'],
    ba_tu: ['Nhớ đóng tiền nước nha con', 'Điện trước tăng 20 ngàn đó'],
    hung: ['Ship đơn gấp lắm, chạy quá'],
    linh: ['Sếp kêu nộp report rùi huhu', 'Café không?'],
    duc: ['Deadline thứ 5 nhớ nhớ nhớ'],
    cu_long: ['Đánh cờ không?'],
  };
  const list = mau[n.id] || ['Tám chuyện gì chưa?'];
  return list[Math.floor(Math.random() * list.length)];
}

function apDungChiSo(state, chg) {
  for (const [k, v] of Object.entries(chg || {})) {
    if (k in state.chiSo) state.chiSo[k] = Math.max(0, Math.min(100, state.chiSo[k] + v));
  }
  return state;
}

// ==== TESTS (blockgate 0.3) ====
function chayTest() {
  const kq = [];
  const t = (ten, fn) => {
    try { fn(); kq.push(['PASS', ten]); }
    catch (e) { kq.push(['FAIL', ten + ' — ' + e.message]); }
  };
  const eq = (a, b, msg) => { if (a !== b) throw new Error(msg + ' (' + a + ' ≠ ' + b + ')'); };

  let s = taoNguoiChoi('saigon');
  t('Tạo người chơi Sài Gòn OK', () => eq(s.thanhPho, 'saigon', 'city'));
  t('14 NPC khởi tạo', () => eq(s.npc.length, 14, 'npc count'));
  t('Broke đúng chất: ≤ 500k', () => { if (s.tien > 500_000) throw new Error('quá giàu'); });

  t('Tiến thời gian 1 ngày', () => {
    const truoc = s.thoiGian.ngay;
    tienTruoi(s, 1440);
    eq(s.thoiGian.ngay, truoc + 1, 'ngày tăng');
  });

  t('Qua tuần: thứ 7 → chủ nhật → thứ 2', () => {
    s.thoiGian = { ngay: 6, thu: 7, gio: 0, phut: 0, tuan: 1, thang: 1, nam: 1998 };
    tienTruoi(s, 1440); eq(s.thoiGian.thu, 8, 'CN');
    tienTruoi(s, 1440); eq(s.thoiGian.thu, 2, 'T2');
    eq(s.thoiGian.tuan, 2, 'tuần tăng');
  });

  t('Sự kiện 7h sáng có đi làm', () => {
    s.thoiGian = { ngay: 2, thu: 2, gio: 7, phut: 0, tuan: 1, thang: 1, nam: 1998 };
    const sk = kiemTraSuKien(s);
    if (!sk.some(x => x.id === 'di_lam')) throw new Error('thiếu di_lam');
  });

  t('NPC sống + nhắn tin', () => {
    // ép random luôn触发
    let coTin = false;
    for (let i = 0; i < 50; i++) {
      npcSong(s, 30);
      if (s.diary.some(d => d.loai === 'tin_nhan')) { coTin = true; break; }
    }
    if (!coTin) throw new Error('50 vòng không thấy tin nhắn');
  });

  t('Áp dụng chỉ số không vượt 100', () => {
    apDungChiSo(s, { doBao: 200 });
    eq(s.chiSo.doBao, 100, 'cap 100');
  });

  t('Đổi thành phố Hà Nội OK', () => {
    const s2 = taoNguoiChoi('hanoi');
    eq(s2.thanhPho, 'hanoi', 'HN');
    if (!s2.thaoGian) {} // noop
  });

  t('Thành phố lạ từ chối', () => {
    let threw = false;
    try { taoNguoiChoi('trape'); } catch { threw = true; }
    if (!threw) throw new Error('không chặn tp lạ');
  });

  return kq;
}

const kq = chayTest();
for (const [st, ten] of kq) console.log(st + ' | ' + ten);
const fail = kq.filter(x => x[0] === 'FAIL').length;
console.log('---');
console.log(kq.length - fail + '/' + kq.length + ' PASS');
if (fail > 0) process.exit(1);
