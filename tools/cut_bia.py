#!/usr/bin/env python3
"""Xuất nền quán bia hơi: cắt dải lấp đầy 4:3 + quantize nhẹ + resize 320x240."""
from PIL import Image

im = Image.open('outputs/bia_raw.png').convert('RGBA')
W, H = im.size
# 4:3: cần tỉ lệ 512x384 — ảnh 512x376 thiếu 8px dưới. Pad bằng lặp dải dưới cùng (sàn bê tông).
canvas = Image.new('RGBA', (512, 384), (0, 0, 0, 0))
canvas.paste(im, (0, 0))
# dải 8px dưới: lặp 1px cuối (sàn xám)
last = im.crop((0, H - 2, 512, H)).resize((512, 8), Image.NEAREST)
canvas.paste(last, (0, 376))
# resize về 320x240 NEAREST
out = canvas.convert('RGB').resize((320, 240), Image.NEAREST)
out.save('assets/bg/bia-hoi.png')
print('assets/bg/bia-hoi.png', out.size)
