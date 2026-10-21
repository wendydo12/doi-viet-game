# summarize.md — Phase 0 (21/10/2026)

## Đã làm (bảng task)
| # | Task | Status | Blockgate |
|---|---|---|---|
| 0.1 | plan.md + design tokens VN | ✅ | File + tokens đủ |
| 0.2 | Nghiên cứu 9 To Life + 7 ảnh VN → GDD nền tảng | ✅ | Vault `gdd-doi-viet-nen-tang-2026-10-21.md` |
| 0.3 | Backend core (state, time, money, NPC, event) | ✅ | `node src/core.js` → 10/10 PASS |
| 0.4 | Render engine v1 canvas thuần | ✅→v3 | Browser :8210 render, di chuyển OK |
| 0.5 | UI: HUD + hộp thoại + chọn thành phố | ✅ | HUD cập nhật, dialog hoạt động |
| 0.6 | **meowa.ai asset đợt 1** (theo chỉ thị phu quân: 16-bit đẹp) | ✅ | scene 511×369 + 8 char 48px + 8 food 64px, 65 credits |
| 0.7 | Server LAN + QR cho điện thoại | ✅ | `http://192.168.1.13:8210/` + `qr-choi-ngay.png` |

## Kết quả QA thật (browser thật)
- Canvas 320×240, 141 nhóm màu (scene 16-bit đa dạng)
- Chọn thành phố → menu đóng → HUD: "Ngày 1 · thứ hai · 06h00 | 150.000 đ"
- +1h → 07h00 đúng; đi làm → dialog + lương +80.000đ
- Nhân vật: outline sel-out + rim light đèn + scale 44px → soi vision 7/10 → 8/10 chuẩn demo

## Điểm cần nhớ (tech-facts)
- meowa: poll trả `{status, output.final_sprite_paths[]}` ở TOP-LEVEL (không phải jobs[0])
- media.meowa.ai chặn urllib → dùng curl + UA Chrome
- Browser harness: capture_screenshot hay timeout → dùng `canvas.toDataURL` thay
- Char 44px + outline 4 hướng brightness(0) + rim clip rect 48x16 sepia — đọc rõ trên scene

## Phase 1 cần cẩn thận
- core.js `taoNguoiChoi` chưa gắn `thanhPho.ten` (game.js đọc `G.thanhPho.ten` — sẽ undefined; sửa khi làm Phase 1)
- Time loop + save/load là nền — phải test kỹ trước khi thêm NPC schedule
- meowa credits: còn ~565/670 — mỗi job xlarge 25cr, cần lập `credits-log/credits.md`
- Sprite char meowa 8 frame: cần biết frame nào là hướng nào trước khi làm walk animation

## Git
- e3dd9d3 phase(0) plan
- d93b312 phase(0) core+render+server+QR
- 52929e4 phase(0) chốt meowa 16-bit
- gitnexus: indexed (13+ nodes)

## Phase 0.9 — Phố đêm art meowa (21/10 tối)
- Nền `assets/bg/pho-dem.png` (320x240, 25 màu) từ job meowa `job_0ebc22ce...` (125cr đã dùng, còn 480)
- render8.js: BG_ANH + fallback, quầng đèn, bụi, mèo, phản chiếu, rim light, vungDi theo cảnh
- Nhân vật: outline 8 hướng, khe chân 3px, bob khi bước; canvas hiển thị 3x (960x720)
- Test thật: tap sàn → đi bộ; tap sạp → action Quán; tap cổng → về phòng trọ. Commit 8b588fb
- Còn lệch tông 3 cảnh cũ (phòng trọ/quán phở/văn phòng) — chờ phu quân duyệt làm tiếp
