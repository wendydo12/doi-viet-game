#!/usr/bin/env python3
"""Chuẩn hoá art meowa thành background pixel 320x240 cho game Đời Việt.
- resize LANCZOS -> 320x240
- lấp vùng trong suốt bằng màu trời đêm (bg removal của meowa ăn mất trời)
- quantize bảng màu giới hạn, không dither -> pixel phẳng sắc nét
- xuất PNG + preview 3x để soi
"""
import sys
from PIL import Image

BG = (0x13, 0x11, 0x1E)  # trời đêm navy tím

def process(src, dst, colors=28, preview=None):
    im = Image.open(src).convert('RGBA')
    base = Image.new('RGBA', im.size, BG + (255,))
    base.alpha_composite(im)
    im = base.convert('RGB').resize((320, 240), Image.LANCZOS)
    q = im.quantize(colors=colors, method=Image.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')
    q.save(dst, optimize=True)
    if preview:
        q.resize((960, 720), Image.NEAREST).save(preview)
    print('->', dst, q.size, 'colors', len(set(q.getdata())))

if __name__ == '__main__':
    src, dst = sys.argv[1], sys.argv[2]
    colors = int(sys.argv[3]) if len(sys.argv) > 3 else 28
    preview = sys.argv[4] if len(sys.argv) > 4 else None
    process(src, dst, colors, preview)
