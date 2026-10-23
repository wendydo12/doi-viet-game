// ===== ICON PIXEL SVG — thay 100% emoji, đúng chuẩn 9 To Life =====
// Mỗi icon: lưới 8x8 (hoặc 10x10), ký tự map màu, xuất SVG inline crisp.
const PIX_ICONS = {
  com: ['..wwww..', '.wrrrrw.', '.wwwwww.', 'wrrrrrrw', 'wrrrrrrw', 'wrrrrrrw', '.wwwwww.', '..wwww..'],
  set: ['....yy..', '...yy...', '..yyyy..', '.yy..y..', '.yyyyyy.', '..y..yy.', '.....yy.', '....y...'],
  vui: ['y..yy..y', '.y.yy.y.', '..yyyy..', 'yyyyyyyy', '.yyyyyy.', '..yyyy..', '.y....y.', 'y......y'],
  noi: ['.ssssss.', 'ssssssss', 'ssssssss', 'ssssssss', '.ssssss.', '...ss...', '..ss....', '........'],
  nuoc: ['...cc...', '...cc...', '..cccc..', '..cccc..', '.cccccc.', '.cccccc.', '.cccccc.', '..cccc..'],
  tim: ['.rr..rr.', 'rrrrrrrr', 'rrrrrrrr', 'rrrrrrrr', '.rrrrrr.', '..rrrr..', '...rr...', '........'],
  tay: ['...ss...', '..sss.s.', '.sss.ss.', 'sssssss.', 'sssssss.', 'sssssss.', '.sssss..', '..ss....'],
  nha: ['...rr...', '..rrrr..', '.rrrrrr.', 'rrrrrrrr', '.ssssss.', '.ss..ss.', '.ss..ss.', '.ssssss.'],
  nguoi: ['.ss..ss.', '.ss..ss.', '........', 'r.r..r.r', 'rrr..rrr', '.rr..rr.', '.rr..rr.', '.ss..ss.'],
  doi: ['...bb...', '..bbbb..', '.bb..bb.', 'bb.bb.bb', 'bb.bb.bb', 'bb.bb.bb', '.b.bb.b.', '..bbbb..'],
  song: ['.....ll.', '....ll..', 'lll.ll..', 'lllll...', '.llll...', '..ll....', '..ll....', '........'],
  mo: ['..y..y..', '..yyyy..', 'yyyyyyyy', '.yyyyyy.', '..yyyy..', '...yy...', '...yy...', '...y....'],
  nang: ['..yyyy..', '.yyyyyy.', 'yyy..yyy', 'yy....yy', 'yy....yy', 'yyy..yyy', '.yyyyyy.', '..yyyy..'],
  may: ['..ssss..', '.ssssss.', 'ssssssss', 'ssssssss', '.ssssss.', '........', '........', '........'],
  mua: ['..ssss..', '.ssssss.', 'ssssssss', '.ssssss.', '..c..c..', '.c..c...', '..c..c..', '........'],
  nong: ['..rr....', '.r.rr.r.', '..rrrr..', '.rryyrr.', '.ryyyyr.', '.rryyrr.', '..rrrr..', '...r....'],
  ret: ['.c.c.c..', '..ccc...', 'ccccccc.', '..ccc...', '.c.c.c..', '........', '.s.s.s..', '..sss...'],
  tien: ['..yy....', '.yyyy...', 'yyy.y...', 'yyyyy...', 'yyy.y...', 'yyyyy...', 'yyyy....', '.yyyy...'],
  am: ['.ss.....', '.sss....', '.ssss...', 'wwsss.rr', 'wwsssrrr', '.ssss.rr', '.sss....', '.ss.....'],
  cam: ['.ss.....', '.sss....', '.ssss...', 'wwsss.rr', 'wwsss.r.', '.ssss.rr', '.sss....', '.ss.....'],
  pause: ['ww..ww..', 'ww..ww..', 'ww..ww..', 'ww..ww..', 'ww..ww..', 'ww..ww..', '........', '........'],
  play: ['w.......', 'ww......', 'www.....', 'wwww....', 'www.....', 'ww......', 'w.......', '........'],
};
const PIX_MAU = {
  w: '#F2F2F2', r: '#D83838', y: '#F8C840', s: '#9AA5C9', c: '#58C8E8',
  b: '#4A7AB0', l: '#4CAF50', g: '#C8C8C8',
};
function pixIcon(ten, kichCo) {
  const rows = PIX_ICONS[ten];
  if (!rows) return '';
  kichCo = kichCo || 14;
  const n = rows.length;
  let rects = '';
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < rows[r].length; c++) {
      const ch = rows[r][c];
      const mau = PIX_MAU[ch];
      if (!mau) continue;
      rects += '<rect x="' + c + '" y="' + r + '" width="1" height="1" fill="' + mau + '"/>';
    }
  }
  return '<svg class="pixicon" width="' + kichCo + '" height="' + kichCo + '" viewBox="0 0 ' + n + ' ' + n +
    '" style="shape-rendering:crispEdges;image-rendering:pixelated;vertical-align:middle;flex:none" aria-hidden="true">' + rects + '</svg>';
}
if (typeof window !== 'undefined') window.pixIcon = pixIcon;
if (typeof module !== 'undefined') module.exports = { pixIcon, PIX_ICONS };

// khởi động: render mọi icon [data-pix] + coin HUD
if (typeof document !== 'undefined') {
  const renderPixIcons = () => {
    for (const el of document.querySelectorAll('[data-pix]')) {
      if (el.dataset.pixDone) continue;
      const k = parseInt(el.dataset.pixSize || '14');
      el.innerHTML = pixIcon(el.dataset.pix, k);
      el.dataset.pixDone = '1';
    }
    const coin = document.getElementById('hud-coin');
    if (coin && !coin.dataset.pixDone) { coin.innerHTML = pixIcon('tien', 14); coin.dataset.pixDone = '1'; }
    const pause = document.getElementById('hud-pause');
    if (pause && !pause.innerHTML) pause.innerHTML = pixIcon('pause', 12);
    const am = document.getElementById('hud-am');
    if (am && !am.innerHTML) am.innerHTML = pixIcon('am', 14);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderPixIcons);
  else renderPixIcons();
  if (typeof window !== 'undefined') window.renderPixIcons = renderPixIcons;
}
