#!/usr/bin/env python3
"""Chuẩn hoá art meowa về ĐÚNG bảng màu 9 To Life (lấy từ frame video tham chiếu).
- resize về 320x240
- snap mọi pixel về màu gần nhất trong palette tham chiếu (flatten nhiễu, giữ outline)
- giữ thêm vài màu tối để outline không bị xám
"""
import sys, json
from PIL import Image

BG = (0x13, 0x11, 0x1E)

# Palette lấy bằng MEDIANCUT trên frame video 9 To Life (xem docs/palette-9tolife.json)
REF = [
    (0x11, 0x11, 0x1E), (0x14, 0x14, 0x2E), (0x1A, 0x17, 0x36), (0x20, 0x19, 0x3A),
    (0x2B, 0x1F, 0x48), (0x36, 0x23, 0x51), (0x1C, 0x1C, 0x38), (0x2A, 0x32, 0x56),
    (0x4B, 0x57, 0x74), (0x5B, 0x6C, 0xB5), (0x79, 0x67, 0x6C), (0x42, 0x37, 0x44),
    (0x28, 0x17, 0x22), (0x28, 0x13, 0x1B), (0x30, 0x1D, 0x1D), (0x38, 0x1F, 0x1E),
    (0x62, 0x3C, 0x3A), (0x59, 0x56, 0x47), (0x8C, 0xB2, 0x97), (0x1A, 0x33, 0x1A),
    (0xF4, 0xE6, 0xB2), (0xF0, 0xE6, 0xB4), (0xE8, 0xC4, 0x6A), (0xFF, 0xB0, 0x00),
    (0xFF, 0xFF, 0xFF), (0x14, 0x0A, 0x0A), (0x6B, 0x3F, 0x1E), (0x9A, 0x5B, 0x2E),
]


def snap(src, dst, preview=None):
    im = Image.open(src).convert('RGBA')
    base = Image.new('RGBA', im.size, BG + (255,))
    base.alpha_composite(im)
    im = base.convert('RGB').resize((320, 240), Image.LANCZOS)
    # build LUT-free nearest palette map (320x240 = 76800 px, fine in python)
    out = Image.new('RGB', (320, 240))
    src_px = im.load()
    dst_px = out.load()
    cache = {}
    for y in range(240):
        for x in range(320):
            c = src_px[x, y]
            v = cache.get(c)
            if v is None:
                best, bd = REF[0], 1 << 30
                for r in REF:
                    d = (c[0]-r[0])**2 + (c[1]-r[1])**2 + (c[2]-r[2])**2
                    if d < bd:
                        bd, best = d, r
                v = cache[c] = best
            dst_px[x, y] = v
    out.save(dst, optimize=True)
    if preview:
        out.resize((960, 720), Image.NEAREST).save(preview)
    print('->', dst, 'colors used', len(set(out.getdata())))


if __name__ == '__main__':
    snap(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None)
