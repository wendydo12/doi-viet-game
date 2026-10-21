#!/usr/bin/env python3
"""Cắt 6 frame walk cycle từ sheet meowa → sprite trong suốt 2 cỡ (36px phố, 54px nội thất)."""
from PIL import Image
import math, os

SRC = 'outputs/canh-r2/walk_sheet_raw.png'
im = Image.open(SRC).convert('RGBA')
W, H = im.size
print('nguồn', im.size)

# Màu nền be ~#BCAAA0 → key theo khoảng cách màu
px = im.load()
bg = None
# lấy màu góc làm chuẩn nền
corners = [px[2,2][:3], px[W-3,2][:3], px[2,H-3][:3]]
bg = tuple(sum(c[i] for c in corners)//3 for i in range(3))
print('màu nền', bg)

def key_bg(img, tol=38):
    img = img.convert('RGBA')
    d = img.getdata()
    out = []
    for r,g,b,a in d:
        dist = abs(r-bg[0])+abs(g-bg[1])+abs(b-bg[2])
        out.append((0,0,0,0) if dist < tol else (r,g,b,255))
    img.putdata(out)
    return img

transparent = key_bg(im)

frames = []
for i in range(6):
    x = 33 + 80*i
    box = (x, 64, x+48, 186)  # chỉ lấy hàng trên (loại súng phun lửa dưới)
    f = transparent.crop(box)
    bb = f.getbbox()
    if bb:
        f = f.crop(bb)
    frames.append(f)
    print('frame', i+1, 'bbox chặt', bb, f.size)

# Đồng bộ kích thước: lấy chiều cao lớn nhất, canh baseline dưới
maxh = max(f.size[1] for f in frames)
maxw = max(f.size[0] for f in frames)
canv = Image.new('RGBA', (maxw*6, maxh), (0,0,0,0))
for i,f in enumerate(frames):
    canv.paste(f, (i*maxw + (maxw-f.size[0])//2, maxh-f.size[1]))
canv.save('assets/char/walk_native.png')
print('native', canv.size)

# 2 cỡ: chia 2 (54px nội thất) và chia 3 (36px phố)
for div, name in [(2,'walk54'), (3,'walk36')]:
    tw, th = maxw*6//div, maxh//div
    sheet = canv.resize((tw, th), Image.NEAREST)
    sheet.save(f'assets/char/{name}.png')
    fw = tw//6
    print(name, 'sheet', sheet.size, 'frame', fw, 'x', th)
    # preview 4x trên nền sáng để soi
    pv = sheet.resize((tw*4, th*4), Image.NEAREST)
    out = Image.new('RGBA', pv.size, (150,140,120,255)); out.alpha_composite(pv)
    out.convert('RGB').save(f'/tmp/{name}_preview.png')
os.makedirs('assets/char', exist_ok=True)
print('DONE')
