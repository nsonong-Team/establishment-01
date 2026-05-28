// ══════════════════════════════════════════════════
//  modal_activity.js — Edit modal for activity
// ══════════════════════════════════════════════════

let actEditCheckStates = {};

// ── Open modal ─────────────────────────────────────
function openActEdit(btn, filteredIdx) {
  const r = actLastFiltered[filteredIdx];
  if (!r) return;

  const C = actColMap;

  document.getElementById('actEditRowNum').value = r[C.no]  || '';
  document.getElementById('ae-rep').value        = r[C.rep] || '';
  document.getElementById('ae-pos').value        = r[C.pos] || '';
  document.getElementById('ae-ag').value         = r[C.ag]  || '';
  document.getElementById('ae-biz').value        = r[C.biz] || '';

  document.getElementById('ae-tr-period').value = r[C.tr_period] || '';
  document.getElementById('ae-tr-place').value  = r[C.tr_place]  || '';
  document.getElementById('ae-tr-topic').value  = r[C.tr_topic]  || '';
  document.getElementById('ae-tr-org').value    = r[C.tr_org]    || '';

  document.getElementById('ae-st-period').value = r[C.st_period] || '';
  document.getElementById('ae-st-place').value  = r[C.st_place]  || '';
  document.getElementById('ae-st-topic').value  = r[C.st_topic]  || '';
  document.getElementById('ae-st-org').value    = r[C.st_org]    || '';
  document.getElementById('ae-st-result').value = r[C.st_result] || '';

  document.getElementById('ae-sa-period').value = r[C.sa_period] || '';
  document.getElementById('ae-sa-place').value  = r[C.sa_place]  || '';
  document.getElementById('ae-sa-event').value  = r[C.sa_event]  || '';
  document.getElementById('ae-sa-org').value    = r[C.sa_org]    || '';

  document.getElementById('ae-sa-local-val').value  = r[C.sa_local_val]  || '';
  document.getElementById('ae-sa-other-val').value  = r[C.sa_other_val]  || '';
  document.getElementById('ae-sa-modern-val').value = r[C.sa_modern_val] || '';
  document.getElementById('ae-sa-export-val').value = r[C.sa_export_val] || '';
  document.getElementById('ae-sa-other-name').value = r[C.sa_etc]        || '';

  document.getElementById('ae-note').value = r[C.note] || '';
  document.getElementById('ae-date').value = r[C.date] || '';

  // checkboxes
  actEditCheckStates = {};
  const chMap = {
    'ในจังหวัด':   C.sa_local,
    'ต่างจังหวัด': C.sa_other,
    'ModernTrade': C.sa_modern,
    'ต่างประเทศ':  C.sa_export,
  };
  Object.entries(chMap).forEach(([key, col]) => {
    actEditCheckStates[key] = r[col] === 'ใช่';
    const el = document.getElementById('ae-item-' + key);
    if (el) el.classList.toggle('checked', actEditCheckStates[key]);
  });

  document.getElementById('actEditModal').style.display = 'flex';
}

// ── Toggle checkbox ────────────────────────────────
function toggleActEditCheck(id) {
  actEditCheckStates[id] = !actEditCheckStates[id];
  document.getElementById('ae-item-' + id)
    .classList.toggle('checked', actEditCheckStates[id]);
}

// ── Close modal ────────────────────────────────────
function closeActModal(e) {
  if (e.target === document.getElementById('actEditModal'))
    document.getElementById('actEditModal').style.display = 'none';
}

// ── Save ───────────────────────────────────────────
async function saveActEdit() {
  const rowNum = document.getElementById('actEditRowNum').value;
  const btn    = document.getElementById('btnSaveActEdit');
  btn.disabled    = true;
  btn.textContent = '⏳ กำลังบันทึก...';

  const updateData = {
    action: 'update',
    rowNum,
    ชื่อผู้ใส่ข้อมูล:  document.getElementById('ae-rep').value.trim(),
    ตำแหน่ง:          document.getElementById('ae-pos').value.trim(),
    หน่วยงาน:         document.getElementById('ae-ag').value.trim(),
    ชื่อสถานประกอบการ: document.getElementById('ae-biz').value.trim(),
    อบรม_ช่วงเวลา:    document.getElementById('ae-tr-period').value.trim(),
    อบรม_สถานที่:     document.getElementById('ae-tr-place').value.trim(),
    อบรม_หัวข้อ:      document.getElementById('ae-tr-topic').value.trim(),
    อบรม_หน่วยงาน:   document.getElementById('ae-tr-org').value.trim(),
    ดูงาน_ช่วงเวลา:        document.getElementById('ae-st-period').value.trim(),
    ดูงาน_สถานที่:         document.getElementById('ae-st-place').value.trim(),
    ดูงาน_หัวข้อ:          document.getElementById('ae-st-topic').value.trim(),
    ดูงาน_หน่วยงาน:       document.getElementById('ae-st-org').value.trim(),
    ดูงาน_ผลการดำเนินงาน: document.getElementById('ae-st-result').value.trim(),
    จำหน่าย_ช่วงเวลา:  document.getElementById('ae-sa-period').value.trim(),
    จำหน่าย_สถานที่:   document.getElementById('ae-sa-place').value.trim(),
    จำหน่าย_ชื่องาน:   document.getElementById('ae-sa-event').value.trim(),
    จำหน่าย_หน่วยงาน: document.getElementById('ae-sa-org').value.trim(),
    จำหน่าย_ในจังหวัด:        actEditCheckStates['ในจังหวัด']  || false,
    จำหน่าย_มูลค่าในจังหวัด:  document.getElementById('ae-sa-local-val').value.trim(),
    จำหน่าย_ต่างจังหวัด:      actEditCheckStates['ต่างจังหวัด'] || false,
    จำหน่าย_มูลค่าต่างจังหวัด: document.getElementById('ae-sa-other-val').value.trim(),
    จำหน่าย_ModernTrade:      actEditCheckStates['ModernTrade'] || false,
    จำหน่าย_มูลค่าModernTrade: document.getElementById('ae-sa-modern-val').value.trim(),
    จำหน่าย_ต่างประเทศ:       actEditCheckStates['ต่างประเทศ']  || false,
    จำหน่าย_มูลค่าต่างประเทศ:  document.getElementById('ae-sa-export-val').value.trim(),
    จำหน่าย_อื่นๆ:            document.getElementById('ae-sa-other-name').value.trim(),
    หมายเหตุ: document.getElementById('ae-note').value.trim(),
  };

  try {
    const res    = await fetch(ACT_GAS_URL, { method: 'POST', body: JSON.stringify(updateData) });
    const result = await res.json();
    btn.disabled    = false;
    btn.textContent = '💾 บันทึกการแก้ไข';
    if (result.success) {
      document.getElementById('actEditModal').style.display = 'none';
      showToast('✅ แก้ไขข้อมูลสำเร็จแล้ว');
      loadActTableData();
    } else {
      showToast('❌ ' + result.error, true);
    }
  } catch (e) {
    btn.disabled    = false;
    btn.textContent = '💾 บันทึกการแก้ไข';
    showToast('❌ ' + e.message, true);
  }
}