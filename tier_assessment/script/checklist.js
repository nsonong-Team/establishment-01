function buildChecklist() {
  const c = document.getElementById('checklistContainer');
  SECTIONS.forEach(sec => {
    const d = document.createElement('div');
    d.className = 'panel';
    d.innerHTML =
      '<div class="sec-hd">' +
        '<span class="sec-icon">' + sec.icon + '</span>' +
        '<span class="sec-ttl">' + sec.title + '</span>' +
        '<span class="sec-score" id="sc-' + sec.id + '">0/' + sec.items.length + '</span>' +
      '</div>' +
      sec.items.map((item, idx) =>
        '<div class="ci" id="ci-' + sec.id + '-' + idx + '" onclick="tog(\'' + sec.id + '\',' + idx + ')">' +
          '<div class="cbox">✓</div>' +
          '<div class="ci-txt">' + item.text + '<span class="ttag t' + item.tier + 'tag">TIER ' + item.tier + '</span></div>' +
        '</div>'
      ).join('');
    c.appendChild(d);
  });
}

function tog(sid, idx) {
  const k = sid + '-' + idx;
  ck[k] = !ck[k];
  document.getElementById('ci-' + sid + '-' + idx).classList.toggle('checked', ck[k]);
  const sec = SECTIONS.find(s => s.id === sid);
  const cnt = sec.items.filter((_, i) => ck[sid + '-' + i]).length;
  const el  = document.getElementById('sc-' + sid);
  el.textContent = cnt + '/' + sec.items.length;
  el.className   = 'sec-score' + (cnt > 0 ? ' has' : '');
  calc();
}

function calc() {
  let t1 = 0, t2 = 0, t3 = 0;
  SECTIONS.forEach(sec => sec.items.forEach((item, idx) => {
    if (ck[sec.id + '-' + idx]) {
      if      (item.tier === 1) t1++;
      else if (item.tier === 2) t2++;
      else                      t3++;
    }
  }));

  document.getElementById('c1').textContent = t1;
  document.getElementById('c2').textContent = t2;
  document.getElementById('c3').textContent = t3;
  document.getElementById('p1').style.width = (T1 ? Math.round(t1 / T1 * 100) : 0) + '%';
  document.getElementById('p2').style.width = (T2 ? Math.round(t2 / T2 * 100) : 0) + '%';
  document.getElementById('p3').style.width = (T3 ? Math.round(t3 / T3 * 100) : 0) + '%';

  const total = t1 + t2 + t3;
  const pct1  = T1 ? t1 / T1 : 0;
  const pct2  = T2 ? t2 / T2 : 0;
  let tier = null;
  if (total > 0) {
    if      (pct1 >= 0.5)                 tier = 1;
    else if (pct1 >= 0.25 || pct2 >= 0.4) tier = 2;
    else                                   tier = 3;
  }
  curTier = tier;

  const te   = document.getElementById('resTier');
  const be   = document.getElementById('resBadge');
  const hint = document.getElementById('resultHint');
  const st   = {
    1: { color:'var(--t1)', label:'⭐⭐⭐ TIER 1 — พร้อมส่งออก', bd:'var(--t1-bd)', bg:'var(--t1-bg)' },
    2: { color:'var(--t2)', label:'⭐⭐ TIER 2 — กำลังพัฒนา',   bd:'var(--t2-bd)', bg:'var(--t2-bg)' },
    3: { color:'var(--t3)', label:'⭐ TIER 3 — เริ่มต้น',       bd:'var(--t3-bd)', bg:'var(--t3-bg)' },
  };

  if (!tier) {
    te.textContent = '—'; te.style.color = '#90a4ae';
    be.textContent = 'ยังไม่ได้ประเมิน';
    be.style.cssText = 'padding:7px 16px;border-radius:50px;font-size:12.5px;font-weight:700;border:2px solid var(--border);color:#90a4ae';
    hint.style.display = 'none';
  } else {
    te.textContent = 'TIER ' + tier; te.style.color = st[tier].color;
    be.textContent = st[tier].label;
    be.style.cssText = 'padding:7px 16px;border-radius:50px;font-size:12.5px;font-weight:700;border:2px solid ' + st[tier].bd + ';color:' + st[tier].color + ';background:' + st[tier].bg;
    hint.style.display = 'block';
  }
}
