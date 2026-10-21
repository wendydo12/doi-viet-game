#!/usr/bin/env python3
"""Composite art meowa (bị remove-bg ăn mất trời) lên nền trời đêm 9 To Life,
resize 320x240, quantize bảng màu rực — xuất bg game.
Dùng: python3 tools/bg_composite.py <in.png> <out.png> [preview.png]
"""
import sys
from PIL import Image

# Trời đêm indigo -> violet chân trời (dải phẳng kiểu pixel, không gradient mềm)
SKY_BANDS = [
    (0.00, (0x14, 0x1A, 0x33)),
    (0.30, (0x1B, 0x24, 0x40)),
    (0.55, (0x24, 0x2B, 0x4E)),
    (0.75, (0x31, 0x2E, 0x58)),
    (1.00, (0x3A, 0x2B, 0x5C)),
]


def sky_bg(w, h, horizon_frac=0.62):
    im = Image.new('RGB', (w, h))
    px = im.load()
    hz = int(h * horizon_frac)
    for y in range(h):
        # chọn band theo y/hz (phần trên), phần dưới horizon giữ band cuối
        t = min(y / max(hz, 1), 1.0)
        col = SKY_BANDS[-1][1]
        for i, (frac, c) in enumerate(SKY_BANDS):
            if t <= frac:
                col = c
                break
        for x in range(w):
            px[x, y] = col
    return im


def composite(src, dst, preview=None, colors=32):
    art = Image.open(src).convert('RGBA')
    w, h = art.size
    base = sky_bg(w, h).convert('RGBA')
    base.alpha_composite(art)
    im = base.convert('RGB').resize((320, 240), Image.LANCZOS)
    q = im.quantize(colors=colors, method=Image.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')
    q.save(dst, optimize=True)
    if preview:
        q.resize((960, 720), Image.NEAREST).save(preview)
    print('->', dst, len(set(q.getdata())), 'mau')


if __name__ == '__main__':
    composite(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None)
