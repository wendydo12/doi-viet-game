#!/usr/bin/env python3
"""Cắt 6 portrait nữ từ sheet meowa → assets/portrait/nu_0X.png (nền trong suốt)."""
from PIL import Image
import os

im = Image.open('outputs/nu_raw.png').convert('RGBA')
W, H = im.size
px = im.load()

# màu nền be — lấy từ góc
bg = px[2, H-3][:3]
print('nguồn', im.size, 'nền', bg)

def key_bg(img, tol=40):
    d = img.getdata()
    out = []
    for r, g, b, a in d:
        dist = abs(r-bg[0]) + abs(g-bg[1]) + abs(b-bg[2])
        out.append((0, 0, 0, 0) if dist < tol else (r, g, b, 255))
    img = img.copy()
    img.putdata(out)
    return img

os.makedirs('assets/portrait', exist_ok=True)
# chia 6 cột đều, lấy dải dưới 65% chiều cao (vision: nhân vật ở 70-100%)
for i in range(6):
    x0 = int(W * i / 6) + 2
    x1 = int(W * (i+1) / 6) - 2
    crop = im.crop((x0, int(H*0.60), x1, H))
    crop = key_bg(crop)
    bb = crop.getbbox()
    if bb: crop = crop.crop(bb)
    # chuẩn hóa 64x64 (giữ tỉ lệ, pad trong suốt)
    cw, ch = crop.size
    sc = min(64/cw, 64/ch)
    nw, nh = max(1,int(cw*sc)), max(1,int(ch*sc))
    crop = crop.resize((nw, nh), Image.NEAREST)
    out = Image.new('RGBA', (64, 64), (0,0,0,0))
    out.paste(crop, ((64-nw)//2, 64-nh))
    out.save(f'assets/portrait/nu_0{i+1}.png')
    print(f'nu_0{i+1}', crop.size, '-> 64x64')
print('DONE')
