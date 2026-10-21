# PLAN — Game "Phố Đêm Trở Về" (tên dự phòng, 100% VN) — 21/10/2026

## Concept một dòng
Life-sim pixel art kiểu 9 To Life nhưng **100% Việt Nam**: người chơi chọn thành phố
(TPHCM / Hà Nội / Đà Nẵng), sống đời thường — đi làm, đi trọ, đi quán — với 14+
NPC có đời sống riêng, sự kiện đậm chất Việt (Tết, mưa ngập, đám giỗ, chuyến xe cuối).

## Quyết định đã chốt với phu quân
- Cơ chế: kiểu 9 To Life — mỗi ngày có giờ, vòng lặp tuần, NPC dày + sự kiện
- Platform: **web game HTML5** (chạy link/QR được NGAY) — PWA sau
- Tông: **nghiêm túc hoài niệm ấm áp**, comedic nhẹ
- Pixel: **meowa.ai** (xlarge_4_3 cho texture sắc) + pxl làm bổ trợ
- Tên game + tên đồ vật + code đồ: **100% Việt, tự sáng tạo**
- Back-end vững TRƯỚC → front-end → UI/UX (quy tắc sắt chàng)

## PHASES

### Phase 0 — Dựng nền + link/QR test được NGAY (làm trước, ưu tiên chàng)
**Goal:** bản chơi được sớm nhất: 1 phòng trọ + chọn thành phố + đi làm cơ bản.
| # | Task | Blockgate |
|---|---|---|
| 0.1 | Viết `plan.md` + design tokens VN (bảng màu PikLab: vàng nghệ, teal cổ vịt, nâu gỗ, đỏ đô, kem ngà) | File tồn tại + tokens đủ 5 nhóm |
| 0.2 | GDD nền tảng (nghiên cứu 9 To Life + 7 ảnh VN — đã làm) | `docs/gdd-nen-tang.md` có concept + pillars |
| 0.3 | Backend core: game state machine (time/day/week, money, stats, npc-list, event-queue) | Node test chạy pass (`node test/core.test.js`) |
| 0.4 | Canvas render engine: draw room + player + move | Browser mở :8080 thấy phòng + di chuyển được |
| 0.5 | UI: HUD (giờ/tiền/tham số) + hộp thoại + chọn thành phố | Chọn city → map đổi màu/nội thất |
| 0.6 | meowa asset đợt 1: nhân vật + đồ phòng trọ VN (ghế nhựa, gạch bông, tủ kính) | Sprite dán vào game, feet-Y khớp |
| 0.7 | **Deploy LAN + QR**: server local + QR code để chàng mở điện thoại chơi | QR scan mở game trên điện thoại |

### Phase 1 — Sống đời trong nhà (backend vững)
Time/day/week loop + money + stats (năng lượng/tâm trạng/đói) + mối quan hệ.
- Save/Load (localStorage + export code)
- NPC sheet 14 người có lịch trình riêng
- Blockgate: 1 tuần in-game chạy trọn không crash + save/load pass

### Phase 2 — Đi làm + sự kiện
Chọn nghề (văn phòng/shipper/quán bar), mini-game đi làm, sự kiện ngẫu nhiên (mưa ngập, tủ lạnh hỏng, đám giỗ...)
- Blockgate: 10 sự kiện khác nhau xuất hiện đúng điều kiện + lương về đúng ngày

### Phase 3 — NPC có cảm xúc (linh hồn 9 To Life)
NPC tự bận, tự nhắn tin, nhớ/ghi hận, cảm xúc lây
- Blockgate: để im 3 ngày in-game → nhận ≥2 tin nhắn NPC đúng personality

### Phase 4 — Tết + đời VN đặc trưng
Lịch âm, Tết về quê, lì xì, chơi bài, đám giỗ, cưới hỏi
- Blockgate: chạy tới ngày 23 Tết → sự kiện Tết kích hoạt + vẫn chơi được

### Phase 5 — Polish + distribution
Âm thanh VN, PWA, deploy public + QR final
- Blockgate: PWA install trên điện thoại + Lighthouse ≥85

## KHÔNG LÀM (cut scope rõ)
- Không 3D, không isometric (side-view như 9 To Life)
- Không microtransactions, không login cloud — save local
- Không build mobile native trong Phase 0-5 (PWA đủ)

## PITFALLS nhà
- Fe sprite: khớp feet-Y/center trước khi dán (meowa bg flood-fill)
- Pixel check bằng pixel-scan chứ không tin vision với object nhỏ
- Không commit asset nặng (chỉ sprite nhỏ + code)
- Tên mọi thứ phải 100% Việt — không chữ Anh nào rò vào game UI
