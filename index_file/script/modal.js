// ══════════════════════════════════════════════════
//  modal.js — Edit modal open / save / close
// ══════════════════════════════════════════════════

let editCheckStates = {};
let editTier        = null;

// ── Open modal and pre-fill fields ────────────────
function openEdit(btn, filteredIdx) {
  const r = lastFiltered[filteredIdx];
  if (!r) return;

  const C = colMap;
  currentFilteredIdx = filteredIdx;

  // ── basic fields ──
  // ── ผู้ใส่ข้อมูล ────────────────────────────
  document.getElementById('editRowNum').value = r[C.no]    || '';

  document.getElementById('e-rep').value      = r[C.rep]   || '';
  document.getElementById('e-pos').value      = r[C.pos]   || '';
  document.getElementById('e-ag').value       = r[C.ag]    || '';
  document.getElementById('e-date').value     = r[C.date]  || '';

  document.getElementById('e-name').value     = r[C.name]  || '';
  document.getElementById('e-loc').value      = r[C.loc]   || '';
  document.getElementById('e-type').value     = r[C.type]  || '';
  document.getElementById('e-brand').value    = r[C.brand] || '';
  document.getElementById('e-std').value      = r[C.std]   || '';
  document.getElementById('e-age').value      = r[C.age]   || '';
  document.getElementById('e-note').value     = r[C.note]  || '';
  document.getElementById('e-etc').value      = r[C.etc]   || '';

  
  // อบรม / สัมมนา
  document.getElementById('e-tr-period').value = r[C.tr_period] || '';
  document.getElementById('e-tr-place').value  = r[C.tr_place]  || '';
  document.getElementById('e-tr-topic').value  = r[C.tr_topic]  || '';
  document.getElementById('e-tr-org').value    = r[C.tr_org]    || '';

  // ศึกษาดูงาน
  document.getElementById('e-st-period').value = r[C.st_period] || '';
  document.getElementById('e-st-place').value  = r[C.st_place]  || '';
  document.getElementById('e-st-topic').value  = r[C.st_topic]  || '';
  document.getElementById('e-st-result').value = r[C.st_result] || '';
  document.getElementById('e-st-org').value    = r[C.st_org]    || '';

  // จำหน่ายสินค้า
  document.getElementById('e-sa-period').value = r[C.sa_period] || '';
  document.getElementById('e-sa-place').value  = r[C.sa_place]  || '';
  document.getElementById('e-sa-event').value  = r[C.sa_event]  || '';
  document.getElementById('e-sa-org').value    = r[C.sa_org]    || '';
  document.getElementById('e-sa-local').value  = r[C.sa_local]  || '';
  document.getElementById('e-sa-other').value  = r[C.sa_other]  || '';
  document.getElementById('e-sa-modern').value = r[C.sa_modern] || '';
  document.getElementById('e-sa-export').value = r[C.sa_export] || '';

  // tier
  editTier = null;
  [1, 2, 3].forEach(t =>
    document.getElementById('et' + t).classList.remove('sel-t1', 'sel-t2', 'sel-t3')
  );
  if      (r[C.tier] === 'TIER 1') { editTier = 1; document.getElementById('et1').classList.add('sel-t1'); }
  else if (r[C.tier] === 'TIER 2') { editTier = 2; document.getElementById('et2').classList.add('sel-t2'); }
  else if (r[C.tier] === 'TIER 3') { editTier = 3; document.getElementById('et3').classList.add('sel-t3'); }

  // channels
  const chMap = {
    'ส่งออก':      C.exp,
    'ในประเทศ':    C.dom,
    'ออนไลน์':     C.onl,
    'ขายในพื้นที่': C.loc2,
  };
  editCheckStates = {};
  Object.entries(chMap).forEach(([key, col]) => {
    editCheckStates[key] = r[col] === 'ใช่';
    document.getElementById('e-item-' + key)
      .classList.toggle('checked', editCheckStates[key]);
  });

  document.getElementById('editModal').style.display = 'flex';
}

// ── Select tier inside modal ───────────────────────
function selectEditTier(n) {
  editTier = n;
  [1, 2, 3].forEach(t => {
    const el = document.getElementById('et' + t);
    el.classList.remove('sel-t1', 'sel-t2', 'sel-t3');
    if (t === n) el.classList.add('sel-t' + n);
  });
}

// ── Toggle channel checkbox inside modal ──────────
function toggleEditCheck(id) {
  editCheckStates[id] = !editCheckStates[id];
  document.getElementById('e-item-' + id)
    .classList.toggle('checked', editCheckStates[id]);
}

// ── Close modal when clicking overlay ─────────────
function closeModal(e) {
  if (e.target === document.getElementById('editModal'))
    document.getElementById('editModal').style.display = 'none';
}

// ── Save edited record ─────────────────────────────
async function saveEdit() {
  const rowNum = document.getElementById('editRowNum').value;
  const btn    = document.getElementById('btnSaveEdit');
  btn.disabled    = true;
  btn.textContent = '⏳ กำลังบันทึก...';

  const updateData = {
    action: 'update',
    rowNum,
    // ── ผู้ใส่ข้อมูล ────────────────────────────
    ชื่อผู้ใส่ข้อมูล: document.getElementById('e-rep').value.trim(),
    ตำแหน่ง:         document.getElementById('e-pos').value.trim(),
    หน่วยงาน:        document.getElementById('e-ag').value.trim(),

    ชื่อสถานประกอบการ: document.getElementById('e-name').value.trim(),
    ที่ตั้ง:            document.getElementById('e-loc').value.trim(),
    ประเภทสินค้า:      document.getElementById('e-type').value.trim(),
    ชื่อแบรนด์:        document.getElementById('e-brand').value.trim(),
    มาตรฐาน:          document.getElementById('e-std').value.trim(),
    ระยะเวลา:         document.getElementById('e-age').value.trim(),
    tier:             editTier ? 'TIER ' + editTier : '',
    ส่งออก:           editCheckStates['ส่งออก']      || false,
    ในประเทศ:         editCheckStates['ในประเทศ']    || false,
    ออนไลน์:          editCheckStates['ออนไลน์']     || false,
    ขายในพื้นที่:      editCheckStates['ขายในพื้นที่'] || false,
    อื่นๆ:            document.getElementById('e-etc').value.trim(),
    หมายเหตุ:         document.getElementById('e-note').value.trim(),

    // ── อบรม / สัมมนา ──────────────────────────
    อบรม_เวลา:        document.getElementById('e-tr-period').value.trim(),
    อบรม_สถานที่:     document.getElementById('e-tr-place').value.trim(),
    อบรม_หัวข้อ:      document.getElementById('e-tr-topic').value.trim(),
    อบรม_หน่วยงาน:   document.getElementById('e-tr-org').value.trim(),

    // ── ศึกษาดูงาน ─────────────────────────────
    ดูงาน_เวลา:       document.getElementById('e-st-period').value.trim(),
    ดูงาน_สถานที่:    document.getElementById('e-st-place').value.trim(),
    ดูงาน_หัวข้อ:     document.getElementById('e-st-topic').value.trim(),
    ดูงาน_ผล:         document.getElementById('e-st-result').value.trim(),
    ดูงาน_หน่วยงาน:  document.getElementById('e-st-org').value.trim(),

    // ── จำหน่ายสินค้า ──────────────────────────
    จำหน่าย_เวลา:        document.getElementById('e-sa-period').value.trim(),
    จำหน่าย_สถานที่:     document.getElementById('e-sa-place').value.trim(),
    จำหน่าย_ชื่องาน:     document.getElementById('e-sa-event').value.trim(),
    จำหน่าย_หน่วยงาน:   document.getElementById('e-sa-org').value.trim(),
    จำหน่าย_ในจังหวัด:   document.getElementById('e-sa-local').value.trim(),
    จำหน่าย_ต่างจังหวัด: document.getElementById('e-sa-other').value.trim(),
    จำหน่าย_trade:       document.getElementById('e-sa-modern').value.trim(),
    จำหน่าย_ต่างประเทศ:  document.getElementById('e-sa-export').value.trim(),
  };

  try {
    const res    = await fetch(GAS_URL, { method: 'POST', body: JSON.stringify(updateData) });
    const result = await res.json();
    btn.disabled    = false;
    btn.textContent = '💾 บันทึกการแก้ไข';
    if (result.success) {
      document.getElementById('editModal').style.display = 'none';
      showToast('✅ แก้ไขข้อมูลสำเร็จแล้ว');
      loadTableData();
    } else {
      showToast('❌ ' + result.error, true);
    }
  } catch (e) {
    btn.disabled    = false;
    btn.textContent = '💾 บันทึกการแก้ไข';
    showToast('❌ ' + e.message, true);
  }
}
