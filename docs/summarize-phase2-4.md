# summarize.md — Phase 2-4 HOÀN THÀNH (24/10/2026)

## Tên game
**"Cơm Bụi & Deadline"** — life-sim 8-bit Việt, chuẩn 9 To Life.
Live: https://doi-viet-game.vercel.app · GitHub: wendydo12/doi-viet-game

## Đã hoàn thành đợt này (Phase 2 + 3 + 4 của plan.md)

### Phase 2 — HỆ NGHỀ SÂU (hết giả "(Phase 3)")
| Nghề | Ca | Kiếm | Thăng bậc |
|---|---|---|---|
| Dân văn phòng | 7h30–17h30 | 80k/ca trọn ca | Thực tập → Nhân viên chính 120k → Trưởng nhóm 180k → Phó phòng 260k (cần Văn phòng cấp + quan hệ sếp Đức) |
| Shipper | 6h–22h | ~35k/đơn × 3-6 đơn | Mới → Quen đường → Giao hỏa tốc → Chủ nhóm (theo Giao tiếp). MƯA TĂNG ĐƠN (đúng đời) |
| Phụ quán phở | 5h–13h | 25k kíp + tip 8k + 12k×cấp Nấu | Phụ bưng → Chân lùa pha phín → Vai trên bếp → Quán của riêng mình |

- Menu chọn nghề hiện LƯONG + CA thật (không còn chữ giả)
- Lời chào khác nhau theo nghề (Sếp Đức / Hùng shipper / Bà Hạnh tạp dề)
- Tab LÀM: nút làm việc RIÊNG theo nghề, chặn đúng scene + giờ + thứ
- Thăng chức = SỰ KIỆN bấm nút trong tab SỐNG: hiện điều kiện thiếu màu đỏ, đủ → nút sáng, +2 LP
- Thống kê nghề: số đơn đã chạy / số kíp đã trực

### Phase 3 — NPC ĐỜI SỐNG SÂU
- **Ghi nhớ hành vi**: nhận quà / hẹn hò / bỏ hẹn đều được ghi vào `ghiNho` (6 dòng gần nhất)
- **Bỏ hẹn → GIẬN**: −15 Bạn −20 Mến, trạng thái "đang giận", nhắn tin TRÁCH theo tính cách riêng từng người
- **Giận tự nguôi** sau 2 ngày (40%/lần check)
- **Bỏ bê 4 ngày** → NPC nhắn "dạo này im lặng ghê..." + quan hệ tụt 3
- **Cảm xúc LÂY**: NPC "mệt vì tăng ca" gặp bạn → bạn −4 vui; NPC "vui vẻ" → +4
- **Tin nhắn người yêu riêng**: Mai có bộ câu 💕 khi thành đôi

### Phase 4 — TẾT + LỊCH ÂM
- `ngayAmLich()` đếm ngày tuyệt đối từ 1/10/2026 → Tết 6/2/2027 (ĐÚNG dương lịch thật)
- **9 mốc Tết** bắn đúng thứ tự, mỗi mốc 1 lần/life:
  - −14: Cậu Tét dạo (gói bánh chưng)
  - −8: 23 Tết Táo quân (thả cá chép)
  - −4: Tất niên xóm trọ (nồi thịt kho tàu bà Tư)
  - −1: GIAO THỪA (pháo hoa, lấy may)
  - **0: MÙNG 1 — LÌ XÌ +300k** (chúc thọ bà Tư)
  - +1: Mùng 2 đánh bài họ hàng (thắng 50k)
  - +2: Mùng 3 đi chùa lấy lộc
  - +4: Mùng 5 tắt Tết
  - +6: Mùng 7 cả phố mở cửa — "Tết hết rồi..."
- **Đếm ngược Tết** trên tab SỐNG: hiện từ 30 ngày trước; mùng 1 đổi thành "HÔM NAY MÙNG 1 TẾT"
- Toast 🧨 + hộp thoại "Tết trong hẻm" + SFX tiền khi lì xì

## FIX kỹ thuật đợt này
1. **Cache-busting script `?v=8`** — page giữ HTTP cache bản cũ dù file đã đổi (triệt để theo skill vanilla-web-game-ops); SW v8 precache theo `?v=8`
2. Giờ ca format chuẩn `07h30 – 17h30` (trước "17.5h")
3. Mùng 1 Tết hiển thị riêng (trước "Còn 0 ngày" gây hiểu nhầm)

## QA
- **node: 39/39 PASS** (24 cũ + 15 mới: 3 nghề chạy tiền thật, chặn ngoài ca, thăng chức đủ/thiếu ĐK, giận + nguôi, tin nhắn tính cách, âm lịch mốc 125 ngày, lì xì đúng 1 lần, thứ tự mốc Tết, bỏ bê nhắn tin, cảm xúc lây chênh 8)
- **QA CDP browser thật: 11/11 PASS** — bấm nút nghề qua UI, tiền tăng thật, thăng chức qua nút, lì xì
- **Vision QA**: panel SỐNG sau thăng chức + Tết 9/10 — "Nghề: Nhân viên chính · lương ca 120.000đ", "Bậc kế tiếp: Trưởng nhóm — cần Văn phòng cấp 3.5 (2.5) · quan hệ sếp 55 (40)" đúng từng chữ

## Deploy
- Vercel production READY, alias https://doi-viet-game.vercel.app — curl xác nhận SW v8 + script ?v=8 LIVE
- GitHub: push lên https://github.com/wendydo12/doi-viet-game (repo mới tạo)

## Còn lại (nếu phu quân muốn tiếp)
- Mini-game đi làm (plan Phase 2 ghi nhưng gameplay chấm công hiện tại đã đủ vòng lặp)
- Đám giỗ / cưới hỏi (mốc lịch kế sau Tết)
- Lịch âm hiển thị ngày âm trên HUD
