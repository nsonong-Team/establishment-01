// ══════════════════════════════════════════════════
//  form.js — Form state, submit & reset
// ══════════════════════════════════════════════════

const checkStates = {};
let selectedTier = null;

// ── Toggle checkbox item ───────────────────────────
function toggleCheck(id) {
  checkStates[id] = !checkStates[id];
  document.getElementById('item-' + id).classList.toggle('checked', checkStates[id]);
}

// ── Select tier card ───────────────────────────────
function selectTier(n) {
  selectedTier = n;
  [1, 2, 3].forEach(t => {
    const el = document.getElementById('tc-' + t);
    el.classList.remove('sel-t1', 'sel-t2', 'sel-t3');
    if (t === n) el.classList.add('sel-t' + n);
  });
}

// ── Submit new record ──────────────────────────────
async function handleSubmit() {
  const name = getVal('ชื่อสถานประกอบการ');
  const rep  = getVal('ชื่อใส่ข้อมูล');
  if (!name) { showToast('⚠️ กรุณากรอกชื่อสถานประกอบการ', true); return; }
  if (!rep)  { showToast('⚠️ กรุณากรอกชื่อผู้ใส่ข้อมูล', true); return; }

  const btn = document.getElementById('btnSubmit');
  const txt = document.getElementById('btnText');
  btn.disabled = true;
  txt.innerHTML = '<span class="loading"></span> กำลังบันทึก...';

  const formData = {
    action:            'submit',

    // ── ผู้ใส่ข้อมูล ──────────────────────────
    ชื่อผู้ใส่ข้อมูล: getVal('ชื่อใส่ข้อมูล'),
    ตำแหน่ง:         getVal('ตำแหน่ง'),
    หน่วยงาน:        getVal('หน่วยงานผู้ใส่ข้อมูล'),

    // ── ข้อมูลสถานประกอบการ ───────────────────
    ชื่อสถานประกอบการ: name,
    ที่ตั้ง:            getVal('ที่ตั้ง'),
    โทรศัพท์:          getVal('โทรศัพท์'),
    ชื่อผู้ประกอบการ:  getVal('ชื่อผู้ประกอบการ'),

    // ── รายละเอียดกิจการ ──────────────────────
    จำนวนสมาชิก:   getVal('จำนวนสมาชิก'),
    กำลังการผลิต:  getVal('กำลังการผลิต'),
    รายได้เฉลี่ย:  getVal('รายได้เฉลี่ย'),
    ชื่อแบรนด์:     getVal('ชื่อแบรนด์'),

    // ── ประเภทผู้ประกอบการ ────────────────────
    ประเภท_OTOP:           checkStates['OTOP']           || false,
    ประเภท_SMEs:           checkStates['SMEs']           || false,
    ประเภท_วิสาหกิจชุมชน: checkStates['วิสาหกิจชุมชน'] || false,
    ประเภท_StartUp:        checkStates['StartUp']        || false,
    ประเภท_บริษัทฯ:        checkStates['บริษัทฯ']        || false,
    ประเภท_อื่นๆ:          getVal('ประเภทผู้ประกอบการ_อื่นๆ'),

    // ── ข้อมูลสินค้า ──────────────────────────
    สินค้า_อาหาร:          checkStates['สินค้าอาหาร']   || false,
    สินค้า_ผ้า:             checkStates['สินค้าผ้า']     || false,
    สินค้า_ของใช้:          checkStates['สินค้าของใช้']  || false,
    สินค้า_สมุนไพร:         checkStates['สินค้าสมุนไพร'] || false,
    สินค้า_เกษตร:           checkStates['สินค้าเกษตร']  || false,
    สินค้า_อื่นๆ:           getVal('ประเภทสินค้า_อื่นๆ'),

    // ── มาตรฐาน ───────────────────────────────
    มาตรฐาน_OTOP3_5:       checkStates['OTOP3-5']  || false,
    มาตรฐาน_มผช:           checkStates['มผช']      || false,
    มาตรฐาน_อย:            checkStates['อย']       || false,
    มาตรฐาน_GAP:           checkStates['GAP']      || false,
    มาตรฐาน_GMP:           checkStates['GMP']      || false,
    มาตรฐาน_NBLBrand:      checkStates['NBLBrand'] || false,
    มาตรฐาน_อื่นๆ:         getVal('มาตรฐาน_อื่นๆ'),

    // ── TIER และหมายเหตุ ───────────────────────
    tier:     selectedTier ? 'TIER ' + selectedTier : '',
    หมายเหตุ: getVal('หมายเหตุ'),
  };

  try {
    const res    = await fetch(GAS_URL, { method: 'POST', body: JSON.stringify(formData) });
    const result = await res.json();
    btn.disabled  = false;
    txt.innerHTML = '💾 บันทึกข้อมูล';
    if (result.success) {
      showToast('✅ บันทึกสำเร็จ! (ลำดับที่ ' + result.row + ')');
      resetForm();
    } else {
      showToast('❌ ' + result.error, true);
    }
  } catch (e) {
    btn.disabled  = false;
    txt.innerHTML = '💾 บันทึกข้อมูล';
    showToast('❌ ' + e.message, true);
  }
}

// ── Reset form to blank state ──────────────────────
function resetForm() {
  const fields = [
    'ชื่อใส่ข้อมูล', 'ตำแหน่ง', 'หน่วยงานผู้ใส่ข้อมูล',
    'ชื่อสถานประกอบการ', 'ที่ตั้ง', 'โทรศัพท์',
    'ประเภทผู้ประกอบการ_อื่นๆ',
    'จำนวนสมาชิก', 'กำลังการผลิต', 'รายได้เฉลี่ย',
    'ชื่อแบรนด์', 'ประเภทสินค้า_อื่นๆ', 'มาตรฐาน_อื่นๆ',
    'หมายเหตุ',
  ];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  const checkIds = [
    'OTOP', 'SMEs', 'วิสาหกิจชุมชน', 'StartUp', 'บริษัทฯ',
    'สินค้าอาหาร', 'สินค้าผ้า', 'สินค้าของใช้', 'สินค้าสมุนไพร', 'สินค้าเกษตร',
    'OTOP3-5', 'มผช', 'อย', 'GAP', 'GMP', 'NBLBrand',
  ];
  checkIds.forEach(id => {
    checkStates[id] = false;
    const el = document.getElementById('item-' + id);
    if (el) el.classList.remove('checked');
  });

  selectedTier = null;
  [1, 2, 3].forEach(t =>
    document.getElementById('tc-' + t).classList.remove('sel-t1', 'sel-t2', 'sel-t3')
  );
}


// ── Dynamic rows ──────────────────────────────────
const rowCounters = { training: 1, study: 1, sales: 1 };

function addRow(type) {
  const container = document.getElementById(type + '-rows');
  const idx = rowCounters[type]++;
  const template = container.querySelector('.dynamic-row').cloneNode(true);
  template.dataset.index = idx;
  // เปลี่ยน name attribute ให้ index ใหม่
  template.querySelectorAll('[name]').forEach(el => {
    el.name = el.name.replace(/_\d+$/, '_' + idx);
    el.value = '';
  });
  container.appendChild(template);
}

function removeRow(btn) {
  const row = btn.closest('.dynamic-row');
  const container = row.parentElement;
  if (container.querySelectorAll('.dynamic-row').length > 1) {
    row.remove();
  } else {
    // ถ้าเหลือแถวเดียวให้ล้างค่าแทนลบ
    row.querySelectorAll('input').forEach(el => el.value = '');
  }
}


// ── Biz Name Autocomplete ──────────────────────────
function filterBizName() {
  const q   = (getVal('ชื่อสถานประกอบการ') || '').toLowerCase();
  const dd  = document.getElementById('bizNameDropdown');

  if (!q || !allRows.length) { dd.style.display = 'none'; return; }

  const matches = allRows
    .map(r => r[colMap.name])
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i)  // unique
    .filter(name => name.toLowerCase().includes(q))
    .slice(0, 8);

  if (matches.length === 0) { dd.style.display = 'none'; return; }

  dd.innerHTML = matches.map(name => `
    <div onclick="selectBizName('${name.replace(/'/g, "\\'")}')"
         style="padding:10px 14px;cursor:pointer;font-size:13.5px;
                border-bottom:1px solid #f0f0f0;transition:.15s"
         onmouseover="this.style.background='#f0f6ff'"
         onmouseout="this.style.background=''">
      ${name}
    </div>
  `).join('');
  dd.style.display = 'block';
}

function selectBizName(name) {
  document.getElementById('ชื่อสถานประกอบการ').value = name;
  document.getElementById('bizNameDropdown').style.display = 'none';
}

// ปิด dropdown เมื่อคลิกที่อื่น
document.addEventListener('click', function(e) {
  const dd = document.getElementById('bizNameDropdown');
  if (dd && !dd.contains(e.target) &&
      e.target.id !== 'ชื่อสถานประกอบการ') {
    dd.style.display = 'none';
  }
});
