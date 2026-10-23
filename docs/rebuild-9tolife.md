# REBUILD — "Cơm Bụi & Deadline" theo đúng chất 9 To Life (VN, 3 thành phố)

Chốt từ phu quân 23/10/2026:
- Life-sim **tương tác thật**: đi lại (tap-to-move), trò chuyện đồng nghiệp/bạn bè,
  làm quen → bạn → yêu → **sinh hoạt với người yêu**.
- **Sự kiện random hên xui**: tai nạn, may rủi, tình huống dở khóc dở cười.
- Bối cảnh **Việt Nam, chọn 1 trong 3**: TP.HCM / Đà Nẵng / Hà Nội —
  **quang cảnh KHÁC NHAU rõ rệt**, văn hóa sinh hoạt từng vùng.
- Đồ họa: **2D pixel flat side-view, outline mảnh 1px, shading 2-3 tông, palette trầm**.
  CẤM: 3D, 2.5D isometric, nét đậm, painterly/bloom/glow (như ảnh mẫu bị loại).
- Art pipeline: aseprite MCP / pxl skill / meowa — nhưng PHẢI qua vòng vision QA
  chống lệch style (meowa hay ra painterly → nếu dùng phải prompt ép flat + reject nếu sai).

## Hiện trạng (đã có, giữ lại)
- core.js 694 dòng: 3 thành phố (thời tiết/món/màu riêng), 14 NPC có quanHe/ban/yeu,
  action NPC (trò chuyện/mời trà đá/tặng quà/thả thính/hẹn hò), SU_KIEN_VIET random,
  quest ngày 3 việc + thưởng, dream LP, ca làm, tiền trọ nợ, chết + văn bia. Test 21/21.
- render8.js: canvas 320×240, pixel-crush 160×120 NEAREST (đúng chất 8-bit cục to),
  tap-to-move + walk sheet, 5 scenes (phòng trọ/quán phở/văn phòng/bia hơi/phố đêm).
- game.js: HUD, dialog, action list, toast, mute, SFX/BGM.

## Thiếu (cần làm) — 6 phase
### Phase A — Design system 9 To Life (render8 + game.js + CSS)
- Palette chuẩn từ phân tích: navy UI #1E2A4E/#0E1220, vàng #F0C040, stat xanh #35B04A,
  hồng accent #D44A8A, bevel sáng-trên/tối-dưới 1px, drop-shadow chữ 1px.
- Stat bar: track đen + fill + **tick chia 25%** + icon 8×8 pixel tự vẽ (bỏ emoji).
- Quest banner vàng kem #F4E4A0: đỏ "today 0/3" + nội dung + thưởng xanh; 3 checkbox.
- Dialog modal chuẩn: viền trắng 3px + viền trong tối + ruột gradient #4D5AA8→#3F4C96
  dither + title vàng + nút OK gradient dither.
- Tab bar 6 tab: VIỆC / PHỐ / PHONG CÁCH / NGƯỜI / ĐỜI / MƠ (icon pixel từng tab,
  active = nhãn vàng + gạch trắng).
- Header mục + LP pips ("Giấc mơ ... 0 LP").
### Phase B — Scene theo thành phố (render8)
Mỗi thành phố 5 scene KHÁC NHAU thật sự:
- **Sài Gòn**: phòng trọ hẻm (cửa sắt, gác lửng, dây điện) / quán cơm tấm vỉa hè /
  văn phòng quận 1 / phố đêm Bùi Viện-style / hẻm ngập triều cường.
- **Hà Nội**: phòng trọ phố cổ (nhà vàng, cửa gỗ) / quán phở gánh / văn phòng /
  bờ hồ Gươm (Tháp Rùa, cây sữa, ông đồ) / bia hơi Tạ Hiện.
- **Đà Nẵng**: phòng trọ gần biển / quán mì Quảng / văn phòng / bãi biển Mỹ Khê
  (cầu Rồng xa, dừa, thuyền thúng) / chợ Hàn.
- Prop đặc trưng từng vùng vẽ code-pixel (tile 16px) + weather riêng (nồm/rét/gió Lào...).
### Phase C — NPC sống trong scene
- NPC có mặt trong scene (không chỉ trong list): đứng/ngồi đúng chỗ, idle bob,
  **bubble thoại typewriter tự nói** (ambient chatter theo tính cách),
  icon cảm xúc trên đầu (giận đỏ/sao xanh marker người đang tương tác).
- Tap vào NPC → nhân vật **tự đi tới** (tap-to-move có sẵn) → mở menu tương tác.
- Relationship stages: 0-19 người lạ → 20-49 quen → 50-79 bạn → 80+ yêu
  (chỉ 1 người; tỏ tình cần điều kiện). Người yêu: nắm tay đi dạo scene,
  hẹn hò quán, sinh hoạt chung phòng trọ, ghen/hờn dỗi random theo tính cách.
### Phase D — Random events hên xui kiểu VN (core)
- Mở rộng SU_KIEN_VIET (~30 sự kiện): trúng số cào, rớt ví, CSGT thổi phạt,
  xe chết máy giữa mưa, chó rượt, gặp người yêu cũ, sếp nhắn 11h đêm,
  hàng xóm hát karaoke, cúp điện, wifi sập, được bà chủ trọ giảm tiền...
- Mỗi sự kiện → dialog modal đúng style + đổi stat/tiền + ghi diary + có thể CHẾT (hài đen).
- Sự kiện phụ thuộc thành phố + thời tiết + giờ (triều cường chỉ Sài Gòn, nồm chỉ Hà Nội...).
### Phase E — Death & legacy (core + render)
- Chết → màn **tang lễ** đúng 9 To Life: đêm sao, bia mộ R.I.P + ♥số khách,
  NPC quanHe>=40 đến đưa tang (đứng 2 bên, khóc), panel epitaph hài đen tự sinh
  (tên/nghề/tuổi/nguyên nhân/trích dẫn/tiết lộ xấu hổ/người ở lại/số khách),
  2 nút "Lưu thành ảnh" / "Tạo cuộc đời mới" + **legacy perks truyền đời** (LP).
### Phase F — QA & ship
- Vision self-review từng scene (crop NEAREST, chấm, sửa, ≥2 vòng) — tiêu chí:
  flat side-view? outline 1px? 2-3 tông? KHÔNG glow/perspective? → reject painterly.
- Test core node (mở rộng bộ test cho relationship/events/legacy), balance bot 9 ngày × 3 thành phố.
- Commit từng phase; deploy Vercel lại (SW bump version).

## Tiêu chí "y chang 9 To Life" (checklist mọi frame)
1. Side-view phẳng, không perspective sâu
2. Outline 1px quanh sprite/đồ vật
3. Shading 2-3 tông, không gradient mềm, không bloom
4. Dither checkerboard cho texture (tường, màn hình, quầng đèn)
5. Palette trầm ~35 màu, vàng/hồng/xanh lá accent đúng hex phân tích
6. Font bitmap + shadow đen 1px
7. Pixel cục to (hệ 160×120 upscale NEAREST)
