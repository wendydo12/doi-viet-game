# summarize.md — Phase 1: Sống đời trong nhà + đồng bộ (21/10/2026 tối)

## Tên game CHÍNH THỨC
**"Cơm Bụi & Deadline"** — phu quân duyệt tối 21/10.
Tagline: "Sáng chấm công, trưa cơm bụi, tối chạy deadline — đời mà."

## Đã làm
| # | Task | Status | Blockgate |
|---|---|---|---|
| 1.1 | core.js v2: 6 nhu cầu (NL/TT/No/Nước/XH/Tinh thần), tụt theo giờ (ngủ tiết kiệm 0.4x) | ✅ | node test |
| 1.2 | FIX bug treo: `G.thanhPho.ten` đọc được (thêm `thanhPhoKey` + object đầy đủ) | ✅ | test PASS |
| 1.3 | 14 HOAT_DONG kiểu 9 To Life: tên Việt + phút + tiền + chỉ số ↑↓ + điều kiện scene/giờ | ✅ | test PASS |
| 1.4 | Chết + văn bia Việt (khát 2 ngày / đói 2 ngày / 3 đêm trắng) — kiểu 9 To Life, không copy | ✅ | test PASS |
| 1.5 | Tiền trọ đầu tháng: đủ thì trừ, thiếu ghi nợ + tụt tâm trạng | ✅ | test PASS |
| 1.6 | 9 sự kiện ngẫu nhiên 100% Việt: kẹt xe, cúp điện, mưa ngập, sếp khen, bà Tư thu tiền, trúng vé số, xóm trọ, má gọi, đòi tiền khó | ✅ | browser test |
| 1.7 | Save/Load localStorage + auto-save 60s + nút "Chơi tiếp" ở menu | ✅ | round-trip PASS |
| 1.8 | index.html mới: HUD 6 thanh nhu cầu, menu hoạt động theo scene, panel di chuyển 4 cảnh, nhật ký, màn văn bia | ✅ | browser test |
| 1.9 | game.js v2: hook bamHoatDong/sauKhiDoiScene, thời gian thật (20s=10p game), sự kiện theo giờ | ✅ | browser test |
| 1.10 | **Khôi phục ảnh nền Meowa phố đêm** (commit revert 0.9 làm mất file) + dongBoTong() grade ấm/vignette cho 3 cảnh code | ✅ | BG loaded: True |
| 1.11 | Nối 4 cảnh: phòng trọ ⇄ phố đêm ⇄ quán phở ⇄ văn phòng (nút di chuyển + chạm cửa trong cảnh) | ✅ | browser test |

## Kết quả QA thật
- Backend: **20/20 PASS** (`node src/core.js`)
- Browser thật: ăn cơm bụi (−25k, No +35), đi làm (7h30→15h30, +80k), màn văn bia hiện đúng ("kiệt sức vì khát" + trích dẫn + số khách)
- **Blockgate 1 tuần in-game**: chơi như người thật 9 ngày — lương tích 150k→431k, thứ 7/CN nghỉ đúng, không chết, qua tuần 2, save/load OK
- Vision art: phố đêm Meowa 8/10 (rim light + phản chiếu + bụi); phòng trọ/văn phòng 6-6.5/10 (đã grade đồng tông)

## Cân bằng đã tinh chỉnh (số liệu thật từ test)
- Khát tụt 1.1/h thức (uống 1.4→1.1 vì 8h đi làm −20 nước làm người chơi chết khát ngày 5)
- Ăn cơm bụi/phở kèm canh/nước lèo → +Nước 10/15 (đúng đời thật: bữa Việt có canh)
- Trà đá +35 nước (quốc dân)

## Phase 2 cần làm
1. Chọn nghề (văn phòng/shipper/quán) + lương theo nghề + thăng chức theo quan hệ với sếp Đức
2. Sự kiện theo lịch: Tết (Phase 4), đám giỗ, cưới hỏi — cần lịch âm
3. NPC cảm xúc sâu: Friend/Love riêng (Mai/Thảo/Hoa), giận khi cho leo cây (hẹn mà không tới)
4. Nâng art 3 cảnh code → Meowa hoặc vẽ lại chi tiết (vision mới chấm 6-6.5, target 8)
5. Bóng đổ + rim light cho nhân vật ở cảnh trong nhà (vision feedback phố đêm)

## Git
- ce6b389 docs: chốt tên + scope Phase 1
- (commit sau) phase(1): backend v2 + UI mới + art khôi phục + QA pass

## Phase 1.5 — Nâng art chuẩn 9 To Life (21/10 tối khuya, theo 2 ảnh phu quân gửi)
- Phu quân gửi 2 ảnh tham chiếu (9 To Life phòng khách + Kairosoft-style store card) kèm lệnh "art ít ra cũng phải này"
- Rút chuẩn từ ảnh: grid pixel thống nhất, contact shadow, tỉ lệ nhân vật-nội thất ~1.7m, silhouette mạnh, chi tiết kể chuyện
- 3 job meowa xlarge_4_3 (75cr, còn 355): phòng trọ / quán phở / văn phòng — cả 3 đạt 8.5/10 thô, không rò chữ, đúng chất Việt (gạch bông, TV CRT đỏ, máy may, chăn hoa, xe phở bốc khói, ghế nhựa đỏ/xanh, cây nước úp bình, máy photo)
- Hậu kỳ: composite nền đêm → 320x240 → quantize 40 màu (tools pipeline như phố đêm)
- Engine: BG_ANH cho cả 4 cảnh + fallback vẽ code; charScale=3 (36x54) cho nội thất vs 2 (24x36) cho phố; vungDi theo cảnh; contact shadow ellipse + rim light mọi cảnh nền ảnh
- Vision QA sau fix: phòng trọ 8/10 (tỉ lệ OK, "người thật trong phòng thật"), văn phòng 8/10 (scale khớp 1.7m, bóng tiếp xúc có)
- QA gameplay lại: ăn cơm bụi → phở → đi làm (+80k, 8h→16h) → "Ngủ một đêm" ẩn đúng ngoài giờ → tap giường ra action ngủ ✅

## Phase 1.6 — Polish theo 3 ảnh chuẩn 9 To Life phu quân gửi (21/10 khuya)
- Chốt công nghệ: GIỮ Vanilla JS + Canvas (phu quân duyệt; 9 To Life gốc cũng là web game — không chuyển Godot)
- Chuẩn art xác nhận từ 3 ảnh: side-view 2D phẳng, sprite ~28-32px 3 đầu, palette 16-32 màu, outline 1px, dithering — game mình ĐANG đúng chuẩn
- Walk cycle Meowa thật (job ff599..., 25cr): 6 frame side-view ~7fps, 2 cỡ (54px nội thất / 36px phố), fallback char bitmap khi idle
- Portrait NPC trong hộp thoại (8 char meowa-r1 map theo 14 NPC) + mood box % kiểu 9 To Life (TUYỆT/ỔN/MỆT/KIỆT đổi mặt)
- Nhân vật phố đêm: filter saturate(0.82) brightness(0.88) → hòa ánh đêm, vision 8/10; phòng trọ walk vision 9/10 "nhận nhầm là cùng vũ trụ 9 To Life"
- QA: không lỗi JS, walk chạy 2 cảnh, tap-to-move OK

## Phase 1.7 — Pixel crush 8bit + tỉ lệ nhân vật chuẩn 9 To Life (21/10 khuya, theo feedback phu quân)
- Feedback: "nhân vật ko giống trong ảnh, to vs khung cảnh, ko phải 8bit — cần Y CHANG 9 To Life"
- ĐO LẠI ảnh 9 To Life thật bằng vision: scene chỉ ~135x81 px game, pixel cục ~4px màn hình, nhân vật ~20% chiều cao cảnh
- FIX 1 — **pixel crush**: vẽ 320x240 vào offscreen 160x120 (scale 0.5) → phóng NEAREST x2 lên canvas → khối 2x2 cục mịch đúng 8bit
- FIX 2 — **tỉ lệ**: charPx 48/240 = đúng 20% cho phố đêm; walk sheet scale động theo charPx; idle dùng frame 0 của walk sheet (cùng nhân vật, hết cảnh 2 sprite khác nhau)
- FIX 3 — vùng đi + viTriGoc theo chiều cao sprite mới
- Vision QA sau fix: phố đêm 8/10 ("tỉ lệ đúng dải 9 To Life, pixel cục 2x2 đạt, chân bám vỉa hè"), phòng trọ 8/10 ("hòa cảnh, cùng outline, walk-sheet side-view")
