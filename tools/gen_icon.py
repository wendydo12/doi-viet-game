# Sinh icon PWA — pixel art 8-bit, lưới 64x64 upscale NEAREST
# 3 motif: BÚT TÔ (trên-trái, 41% rule of thirds) + ĐỒNG HỒ (trên-phải) + 3 HẠT CƠM (trung tâm dưới)
# Nền phẳng, 60-30-10: navy 60 / kem 30 / vàng 10
from PIL import Image, ImageDraw

G = 64
img = Image.new('RGBA', (G, G), (20, 26, 48, 255))   # --nen #141A30
d = ImageDraw.Draw(img)
KEM = (242, 242, 242, 255)
VANG = (233, 192, 75, 255)
VNG = (91, 108, 181, 255)
DO = (214, 69, 65, 255)
CAM = (230, 126, 34, 255)
XL = (111, 224, 106, 255)
NAVY2 = (42, 49, 87, 255)

# khung viền 2px
d.rectangle([1, 1, 62, 62], outline=VNG, width=2)

# ===== BÚT TÔ sandwich (trên-trái, golden spot ~x26 y26) =====
bx, by = 8, 8
# vỏ trên
d.rectangle([bx, by, bx + 24, by + 5], fill=VANG)
# thân kem
d.rectangle([bx, by + 5, bx + 24, by + 16], fill=KEM)
# nhân: 4 sọc dọc
nh = [DO, XL, CAM, DO]
for i, m in enumerate(nh):
    d.rectangle([bx + 2 + i * 5, by + 7, bx + 4 + i * 5, by + 14], fill=m)
# vỏ dưới
d.rectangle([bx, by + 16, bx + 24, by + 21], fill=VANG)

# ===== ĐỒNG HỒ DEADLINE (trên-phải) =====
cx, cy, r = 47, 19, 9
d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=NAVY2, outline=VANG, width=2)
# các vạch 12/3/6/9
d.point((cx, cy - r + 2), fill=VANG); d.point((cx, cy + r - 2), fill=VANG)
d.point((cx - r + 2, cy), fill=VANG); d.point((cx + r - 2, cy), fill=VANG)
# kim: 12h (deadline!) + kim phút 2h
d.line([cx, cy, cx, cy - 6], fill=KEM, width=2)
d.line([cx, cy, cx + 5, cy + 3], fill=KEM, width=2)
d.rectangle([cx - 1, cy - 1, cx + 1, cy + 1], fill=VANG)

# ===== 3 HẠT CƠM — tách rời, rõ ràng (dưới-giữa) =====
# mỗi hạt = khối 5x3 nghiêng nhẹ, cách nhau 4px
for i, (hx, hy) in enumerate([(16, 44), (29, 47), (42, 44)]):
    d.rectangle([hx, hy, hx + 5, hy + 3], fill=KEM)
    d.rectangle([hx + 1, hy + 3, hx + 5, hy + 4], fill=VANG)  # bóng nhẹ

# ===== 2 vệt "bụi" trang trí (tinh thần Cơm BỤI) =====
d.rectangle([52, 34, 56, 35], fill=NAVY2)
d.rectangle([10, 33, 14, 34], fill=NAVY2)
d.rectangle([50, 46, 55, 47], fill=NAVY2)

img = img.resize((512, 512), Image.NEAREST)
img.save('assets/icon-512.png')
img.resize((192, 192), Image.NEAREST).save('assets/icon-192.png')
# apple-touch-icon: opaque trên nền navy
a = Image.new('RGBA', (180, 180), (20, 26, 48, 255))
a.paste(img.resize((180, 180), Image.NEAREST), (0, 0))
a.convert('RGB').save('assets/apple-touch-icon.png')
print('icons 64-grid OK')
