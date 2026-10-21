# HIỂU ĐÚNG CƠ CHẾ 9 TO LIFE — chốt lại theo chỉ thị phu quân 21/10 tối

## Phu quân chốt: "y chang pixel 9 to life — có chuyển động đi lại + chọn action, KHÔNG phải ảnh tĩnh. 8bit là đủ"

## Cơ chế 9 To Life soi được từ video (đúng như phu quân nói)
1. **Scene mỗi bối cảnh 1 phòng** (bar, phòng, công viên...) — NHÌN NGANG side-view, KHÔNG isometric
2. **Nhân vật sprite NHỎ**: 16-24px cao (chiếm ~10% canvas) — KHÔNG phải 44px như thiếp vừa làm (quá to!)
3. **Tap-to-move + tap-action**: bấm NƠI/đối tượng → nhân vật ĐI TỰ ĐỘNG tới đó (walk animation khi đi, idle khi đứng)
4. **Bấm task từ list** (Feed the ducks 30m, Go for a jog 45m...) → nhân vật thực hiện, thời gian game nhảy, hiệu ứng stat
5. **Đổi bối cảnh** = chuyển phòng (TOWN tab → chọn bar/gym/phòng...). Mỗi phòng là 1 scene vẽ riêng
6. **NPC đứng trong scene**, có bong bóng thoại, có cảm xúc
7. **HUD**: trên = giờ + tiền + pause; dưới = stat bars + avatar %mood + task list + tab nav
8. **Đi đứng**: sprite chỉ có 2-3 frame walk (chân đổi tư thế) + idle (thở)
9. **8bit là đủ** — pixel to rõ, palette hạn chế

## Vậy game "Phố Đêm Trở Về" phải sửa
- ❌ Bỏ scene tĩnh meowa + nhân vật 44px quá to
- ✅ Scene vẽ pixel 8bit **thuần canvas** (như 9 To Life — vẽ tile + đồ vật theo code, không ảnh lớn)
- ✅ Nhân vật 16px, 2-3 frame walk + idle
- ✅ **Tap-to-move**: chạm điểm → đi tới (walk anim)
- ✅ **Tap-action**: bấm giường → ngủ; bấm bàn → ăn; bấm cửa → đổi bối cảnh
- ✅ **Đa bối cảnh**: phòng trọ / quán phở / văn phòng / phố — mỗi cái 1 scene
- ✅ HUD kiểu 9 To Life: trên giờ+tiền; dưới stat + task list + tabs

## Kế hoạch sửa ngay (Phase 0.8)
1. Vẽ lại engine render 8bit thuần (tile-based, phòng như 9 To Life)
2. Nhân vật 16px + walk/idle frames (tự vẽ bitmap, không meowa — vì 9 To Life dùng sprite code-based nhỏ)
3. Tap-to-move + tap-action + đổi bối cảnh (4 scene VN: phòng trọ, quán phở, văn phòng, phố đêm)
4. HUD lại đúng layout 9 To Life
