// ══════════════════════════════════════════════════
//  script.js — Tier Assessment Logic
// ══════════════════════════════════════════════════

const GAS_URL = 'https://script.google.com/macros/s/AKfycbxlU1mKWVby6F8RPbsZTlhacisIVMvs-D4TAW_m6l3hbhlC8x7NPUJOGCJLpHxCShkz/exec';

// ── Checklist Data ─────────────────────────────────
const SECTIONS = [
  { id:'op', icon:'👤', title:'คุณสมบัติผู้ประกอบการ', items:[
    { text:'มีวิสัยทัศน์ ความคิดก้าวหน้า มองโลกในแง่ดี มีการวางกลยุทธ์ธุรกิจ มีจริยธรรม', tier:1 },
    { text:'มีความมุ่งมั่นพัฒนาและเติบโต แต่อาจยังไม่พบช่องทาง หรือมีข้อจำกัด มีจริยธรรม', tier:2 },
    { text:'เพิ่งก่อตั้งไม่เกิน 5 ปี แต่มีความมุ่งมั่น มีความต้องการพัฒนาและเติบโต', tier:3 },
  ]},
  { id:'std', icon:'🏅', title:'มาตรฐานสินค้า', items:[
    { text:'ได้รับมาตรฐานสากลที่ยอมรับทั่วโลก (USDA Organic, EU Organic, JAS, BIO, Fairtrade ฯลฯ)', tier:1 },
    { text:'ได้รับมาตรฐานระดับประเทศ (อย., มผช., Q, GI, OTOP ฯลฯ)', tier:2 },
    { text:'สินค้ามีศักยภาพ แต่มาตรฐานอยู่ในระดับจังหวัด / ยังต้องพัฒนา', tier:3 },
  ]},
  { id:'res', icon:'🏭', title:'วัตถุดิบ & แรงงาน', items:[
    { text:'วัตถุดิบเพียงพอต่อการผลิตตามคำสั่งซื้อขนาดใหญ่', tier:1 },
    { text:'แรงงานเพียงพอต่อการผลิตตามคำสั่งซื้อขนาดใหญ่', tier:1 },
    { text:'วัตถุดิบ / แรงงานเพียงพอระดับหนึ่ง มีข้อจำกัด ต้องวางแผนบริหารจัดการ', tier:2 },
  ]},
  { id:'prod', icon:'💡', title:'พัฒนาผลิตภัณฑ์ / นวัตกรรม / Design', items:[
    { text:'มีการนำนวัตกรรมมาใช้ในการพัฒนาผลิตภัณฑ์', tier:1 },
    { text:'มีการพัฒนา Design / บรรจุภัณฑ์ที่สวยงาม ทันสมัย โดดเด่น', tier:1 },
    { text:'มีการพัฒนาผลิตภัณฑ์ / นวัตกรรมระดับหนึ่ง แต่ยังต้องพัฒนาเพิ่ม', tier:2 },
    { text:'Design / บรรจุภัณฑ์ยังไม่เป็นสากล ต้องได้รับการพัฒนา', tier:2 },
    { text:'สินค้ามีศักยภาพ แต่ยังต้องได้รับการพัฒนา', tier:3 },
  ]},
  { id:'mint', icon:'🌏', title:'ตลาดต่างประเทศ', items:[
    { text:'มีประสบการณ์ซื้อขายกับ "ผู้นำเข้า" โดยตรง แบบ B2B (ไม่ผ่านตัวกลาง)', tier:1 },
    { text:'มีสินค้าวางจำหน่ายในต่างประเทศ', tier:1 },
    { text:'ส่งออกผ่านตัวกลาง (Trader) / มีผู้มาซื้อไปขายต่อ', tier:2 },
    { text:'ขายต่างประเทศผ่าน Online แบบ B2C', tier:2 },
  ]},
  { id:'mdom', icon:'🇹🇭', title:'ตลาดในประเทศ', items:[
    { text:'วางจำหน่ายในห้าง / Supermarket ชั้นนำที่ชาวต่างชาตินิยม (Emquatier, Icon Siam, King Power, Villa, Gourmet, Fuji)', tier:1 },
    { text:'มีร้านจำหน่ายสินค้าของตนเอง', tier:1 },
    { text:'วางจำหน่ายใน 7-11, BigC, ตลาด, ร้านค้า, งานแสดงสินค้า', tier:2 },
    { text:'ช่องทางตลาดจำกัด มุ่งขาย B2C เป็นหลัก', tier:3 },
  ]},
  { id:'monl', icon:'💻', title:'ช่องทาง Online', items:[
    { text:'มีการสั่งซื้อจากผู้นำเข้าต่างชาติ / ห้างต่างประเทศ แบบ B2B อย่างต่อเนื่อง', tier:1 },
    { text:'ขาย Online แบบ B2C', tier:2 },
  ]},
  { id:'act', icon:'📅', title:'กิจกรรม', items:[
    { text:'เข้าร่วมงานแสดงสินค้าในต่างประเทศด้วยตนเอง หรือร่วมกับกรมส่งเสริมการค้าระหว่างประเทศ (สค.)', tier:1 },
    { text:'เข้าร่วมงานแสดงสินค้านานาชาติที่มีการเจรจาธุรกิจกับผู้นำเข้าต่างชาติ (Thaifex, Style)', tier:1 },
    { text:'เข้าร่วมโครงการพัฒนาผลิตภัณฑ์ / อบรมของกระทรวงพาณิชย์ และมีการสั่งซื้อสินค้าแล้ว', tier:1 },
    { text:'เข้าร่วมโครงการพัฒนาผลิตภัณฑ์ / อบรมของกระทรวงพาณิชย์', tier:2 },
    { text:'เข้าร่วมงานแสดงสินค้าทั่วไปในประเทศ (เน้น B2C)', tier:2 },
  ]},
  { id:'coop', icon:'🤝', title:'ความร่วมมือ', items:[
    { text:'มีความร่วมมือกับหน่วยงาน องค์กร หรือสถาบันการศึกษา', tier:1 },
  ]},
  { id:'soc', icon:'🌱', title:'การช่วยเหลือสังคม / ชุมชน', items:[
    { text:'การผลิตช่วยเหลือ / สร้างรายได้ให้ชุมชน เกษตรกร (เช่น ผลิตจากวัสดุเหลือใช้ ผลผลิตล้นตลาด)', tier:1 },
    { text:'มีส่วนร่วมในการสร้างรายได้ให้ชุมชน', tier:2 },
  ]},
];

const T1 = SECTIONS.reduce((s, sec) => s + sec.items.filter(i => i.tier === 1).length, 0);
const T2 = SECTIONS.reduce((s, sec) => s + sec.items.filter(i => i.tier === 2).length, 0);
const T3 = SECTIONS.reduce((s, sec) => s + sec.items.filter(i => i.tier === 3).length, 0);

const ck = {};
let curTier = null;

// ── Build checklist UI ─────────────────────────────
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

// ── Toggle checklist item ──────────────────────────
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

// ── Calculate tier ─────────────────────────────────
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
    if      (pct1 >= 0.5)               tier = 1;
    else if (pct1 >= 0.25 || pct2 >= 0.4) tier = 2;
    else                                tier = 3;
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

// ── Manual input toggle ────────────────────────────
function toggleManual() {
  const on = document.getElementById('chkManual').checked;
  document.getElementById('manualWrap').style.display      = on ? '' : 'none';
  document.getElementById('searchWrap').style.opacity      = on ? '0.4' : '1';
  document.getElementById('searchWrap').style.pointerEvents = on ? 'none' : 'auto';
}

// ── Search & Dropdown ──────────────────────────────
let allBizList    = [];
let selectedBizName = '';
let activeIdx     = -1;

function openDropdown() {
  if (document.getElementById('chkManual').checked) return;
  renderDropdown(allBizList);
  document.getElementById('bizDropdown').classList.add('open');
}

function filterBiz() {
  selectedBizName = '';
  document.getElementById('selectedBiz').style.display = 'none';
  const q        = document.getElementById('bizSearch').value.trim().toLowerCase();
  const filtered = q ? allBizList.filter(b => b.name.toLowerCase().includes(q)) : allBizList;
  renderDropdown(filtered, q);
  document.getElementById('bizDropdown').classList.add('open');
  activeIdx = -1;
}

function renderDropdown(list, q = '') {
  const dd = document.getElementById('bizDropdown');
  if (list.length === 0) {
    dd.innerHTML = '<div class="drop-empty">ไม่พบสถานประกอบการที่ค้นหา</div>';
    return;
  }
  dd.innerHTML = list.map((b, i) => {
    const name = q
      ? b.name.replace(new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>')
      : b.name;
    return '<div class="drop-item" data-name="' + b.name + '" data-idx="' + i + '" onmousedown="selectBiz(\'' + b.name.replace(/'/g, "\\'") + '\')">' + name + '</div>';
  }).join('');
}

function selectBiz(name) {
  selectedBizName = name;
  document.getElementById('bizSearch').value = '';
  document.getElementById('bizDropdown').classList.remove('open');
  document.getElementById('selectedName').textContent = name;
  document.getElementById('selectedBiz').style.display = 'flex';
}

function clearSelected() {
  selectedBizName = '';
  document.getElementById('selectedBiz').style.display = 'none';
  document.getElementById('bizSearch').value = '';
  document.getElementById('bizSearch').focus();
}

document.addEventListener('click', function (e) {
  if (!document.getElementById('searchWrap').contains(e.target))
    document.getElementById('bizDropdown').classList.remove('open');
});

document.addEventListener('keydown', function (e) {
  const dd    = document.getElementById('bizDropdown');
  if (!dd.classList.contains('open')) return;
  const items = dd.querySelectorAll('.drop-item');
  if      (e.key === 'ArrowDown')  { e.preventDefault(); activeIdx = Math.min(activeIdx + 1, items.length - 1); }
  else if (e.key === 'ArrowUp')    { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); }
  else if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); selectBiz(items[activeIdx].dataset.name); return; }
  else if (e.key === 'Escape')     { dd.classList.remove('open'); return; }
  items.forEach((el, i) => el.classList.toggle('active', i === activeIdx));
  if (activeIdx >= 0) items[activeIdx].scrollIntoView({ block: 'nearest' });
});

function getBizName() {
  if (document.getElementById('chkManual').checked)
    return document.getElementById('bizManual').value.trim();
  return selectedBizName;
}

// ── Load biz names from GAS ────────────────────────
async function loadBizNames() {
  document.getElementById('bizSearch').placeholder = '⏳ กำลังโหลดรายชื่อจากระบบหลัก...';
  try {
    const res  = await fetch(GAS_URL + '?action=getSheetData');
    const data = await res.json();
    document.getElementById('bizSearch').placeholder = '🔍 พิมพ์เพื่อค้นหาสถานประกอบการ...';
    if (!data.rows || data.rows.length === 0) {
      document.getElementById('bizSearch').placeholder = '— ไม่พบข้อมูลในระบบ —';
      document.getElementById('chkManual').checked = true; toggleManual(); return;
    }
    // สร้าง list จาก column ที่ 1 (ชื่อสถานประกอบการ)
    allBizList = data.rows.map((r, i) => ({ row: i + 2, name: r[1] })).filter(r => r.name);
  } catch (e) {
    document.getElementById('bizSearch').placeholder = '— โหลดไม่สำเร็จ ลองพิมพ์เองด้านล่าง —';
    document.getElementById('chkManual').checked = true; toggleManual();
  }
}

// ── Save tier via fetch ────────────────────────────
async function saveTier() {
  const name = getBizName();
  if (!name)    { showToast('⚠️ กรุณาเลือกหรือพิมพ์ชื่อสถานประกอบการ', true); return; }
  if (!curTier) { showToast('⚠️ กรุณาติ๊กรายการประเมินก่อน', true); return; }

  const tier = 'TIER ' + curTier;
  const btn  = document.getElementById('btnSave');
  btn.disabled = true; btn.textContent = '⏳ กำลังบันทึก...';

  try {
    const res    = await fetch(GAS_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'updateTierByName', bizName: name, tier })
    });
    const result = await res.json();
    btn.textContent = '💾 บันทึก TIER ลงระบบ'; btn.disabled = false;
    if (result && result.success) showToast('✅ บันทึก ' + tier + ' ให้ "' + name + '" สำเร็จแล้ว');
    else showToast('❌ ' + (result ? result.error : 'เกิดข้อผิดพลาด'), true);
  } catch (e) {
    btn.textContent = '💾 บันทึก TIER ลงระบบ'; btn.disabled = false;
    showToast('❌ ' + e.message, true);
  }
}

// ── Toast ──────────────────────────────────────────
function showToast(msg, isErr) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className   = 'toast' + (isErr ? ' err' : '') + ' show';
  setTimeout(() => t.classList.remove('show'), 3500);
}

// ── Init ───────────────────────────────────────────
buildChecklist();
loadBizNames();