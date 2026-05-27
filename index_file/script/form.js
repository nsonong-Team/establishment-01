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
  if (!name) { showToast('⚠️ กรุณากรอกชื่อสถานประกอบการ', true); return; }

  const btn = document.getElementById('btnSubmit');
  const txt = document.getElementById('btnText');
  btn.disabled = true;
  txt.innerHTML = '<span class="loading"></span> กำลังบันทึก...';

  const formData = {
    action:            'submit',
    ชื่อสถานประกอบการ: name,
    ที่ตั้ง:            getVal('ที่ตั้ง'),
    ประเภทสินค้า:      getVal('ประเภทสินค้า'),
    ชื่อแบรนด์:        getVal('ชื่อแบรนด์'),
    มาตรฐาน:          getVal('มาตรฐาน'),
    ระยะเวลา:         getVal('ระยะเวลา'),
    ส่งออก:           checkStates['ส่งออก']      || false,
    ในประเทศ:         checkStates['ในประเทศ']    || false,
    ออนไลน์:          checkStates['ออนไลน์']     || false,
    ขายในพื้นที่:      checkStates['ขายในพื้นที่'] || false,
    อื่นๆ:            getVal('อื่นๆ'),
    อบรม_เวลา:        getByName('training_period_0'),
    อบรม_สถานที่:     getByName('training_place_0'),
    อบรม_หัวข้อ:      getByName('training_topic_0'),
    อบรม_หน่วยงาน:   getByName('training_org_0'),
    ดูงาน_เวลา:       getByName('study_period_0'),
    ดูงาน_สถานที่:    getByName('study_place_0'),
    ดูงาน_หัวข้อ:     getByName('study_topic_0'),
    ดูงาน_ผล:         getByName('study_result_0'),
    ดูงาน_หน่วยงาน:  getByName('study_org_0'),
    จำหน่าย_เวลา:        getByName('sales_period_0'),
    จำหน่าย_สถานที่:     getByName('sales_place_0'),
    จำหน่าย_ชื่องาน:     getByName('sales_event_0'),
    จำหน่าย_หน่วยงาน:   getByName('sales_org_0'),
    จำหน่าย_ในจังหวัด:   getByName('sales_local_0'),
    จำหน่าย_ต่างจังหวัด: getByName('sales_other_0'),
    จำหน่าย_trade:       getByName('sales_modern_0'),
    จำหน่าย_ต่างประเทศ:  getByName('sales_export_0'),
    tier:             selectedTier ? 'TIER ' + selectedTier : '',
    หมายเหตุ:         getVal('หมายเหตุ'),
    ชื่อผู้แจ้ง:       getVal('ชื่อผู้แจ้ง'),
    ตำแหน่ง:          getVal('ตำแหน่ง'),
    หน่วยงานผู้แจ้ง:   getVal('หน่วยงานผู้แจ้ง'),
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
    'ชื่อสถานประกอบการ', 'ที่ตั้ง', 'ประเภทสินค้า', 'ชื่อแบรนด์',
    'มาตรฐาน', 'ระยะเวลา', 'อื่นๆ', 'หมายเหตุ',
    'ชื่อผู้แจ้ง', 'ตำแหน่ง', 'หน่วยงานผู้แจ้ง',
  ];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  // ── ล้าง name-based fields ────────────────────
  const nameFields = [
    'training_period_0', 'training_place_0', 'training_topic_0', 'training_org_0',
    'study_period_0',    'study_place_0',    'study_topic_0',    'study_result_0', 'study_org_0',
    'sales_period_0',    'sales_place_0',    'sales_event_0',    'sales_org_0',
    'sales_local_0',     'sales_other_0',    'sales_modern_0',   'sales_export_0',
  ];
  nameFields.forEach(name => {
    const el = document.querySelector(`[name="${name}"]`);
    if (el) el.value = '';
  });

  ['ส่งออก', 'ในประเทศ', 'ออนไลน์', 'ขายในพื้นที่'].forEach(id => {
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
