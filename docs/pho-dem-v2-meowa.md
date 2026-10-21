# PHỐ ĐÊM v2 — art meowa chuẩn pixel 9 To Life (21/10/2026 tối)

## Phu quân yêu cầu
"Fix lại cái phố đêm trở về life sim, cho giống pixel art 8bit trong vid, dùng meowa.ai làm art pixel — y chang 9 To Life."

## Cách làm
1. **Trích style từ 2 video**: side-view 2D, sprite nhỏ có outline đen, mỗi vật 2-4 tông màu,
   dithering nhẹ, đêm navy-tím + đèn vàng ấm. Bảng màu lưu ở `docs/palette-9tolife.json`.
2. **5 job meowa `xlarge_4_3`** (125 credit) → chọn PA E: phố đêm Việt, sân trống rộng,
   biển hiệu trống, không chữ vô nghĩa.
3. **Hậu kỳ PIL** (`tools/bg_palette_snap.py`, `tools/bg_punch.py`):
   resize 320x240 → composite nền trời đêm (meowa ép remove-bg) → snap về 25 màu chuẩn
   → tăng tương phản 1.10 / bão hoà 1.12. Xuất `assets/bg/pho-dem.png`.
4. **Engine** (`src/render8.js`): `BG_ANH` nạp ảnh async + fallback vẽ tay nếu thiếu ảnh;
   phủ hiệu ứng code: quầng đèn nhấp nháy, 9 hạt bụi trôi, mèo ngồi vỉa hè,
   phản chiếu nhân vật trên đường ướt, rim light ấm phía hướng đèn, nhấp nhô khi bước.
5. **Nhân vật**: outline 8 hướng (kín góc chéo), khe 2 chân nới 3px (outline không dính),
   áo teal sáng hơn + quần tối hơn để tách khỏi nền.
6. **Di chuyển**: thêm `vungDi` theo cảnh → phố đêm chỉ đi trên dải vỉa hè/lòng đường;
   sửa lỗi kẹt "đi mãi không tới" do đích bị kẹp ra ngoài vùng đi.
7. **Canvas hiển thị 3x** (min(94vw, 960px), `image-rendering: pixelated`) cho pixel to như vid.

## Kết quả QA (đo thật trong browser)
- 4 cảnh render đủ, không cảnh nào đen/thiếu hình.
- Bấm sạp bún → nhân vật đi tới → hộp thoại "Quán" hiện ✅
- Bấm cổng hẻm trái → chuyển về phòng trọ ✅
- Vision soi: phản chiếu đọc ra, rim light nằm đúng phía đèn, phố đêm 8/10 độ giống life-sim.

## Việc còn lại (chờ phu quân quyết)
- 3 cảnh phòng trọ / quán phở / văn phòng vẫn vẽ bằng code nên **lệch tông** so với phố đêm mới.
  Muốn đồng bộ thì chạy tiếp meowa cho 3 cảnh đó (~75 credit).
- Sạp bún hiện chỉ là điểm bấm; nếu muốn có NPC bán hàng + bong bóng thoại thì làm phase sau.
