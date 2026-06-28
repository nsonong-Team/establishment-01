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
  document.getElementById('editRowNum').value = r[C.no]   || '';
  document.getElementById('e-rep').value      = r[C.rep]  || '';
  document.getElementById('e-pos').value      = r[C.pos]  || '';
  document.getElementById('e-ag').value       = r[C.ag]   || '';
  document.getElementById('e-date').value     = r[C.date] || '';
  document.getElementById('e-name').value     = r[C.name] || '';
  document.getElementById('e-loc').value      = r[C.loc]  || '';
  document.getElementById('e-phone').value    = r[C.phone]|| '';
  document.getElementById('e-owner').value    = r[C.owner]|| '';
  document.getElementById('e-member').value   = r[C.member]|| '';
  document.getElementById('e-capacity').value = r[C.capacity]|| '';
  document.getElementById('e-income').value   = r[C.income]|| '';
  document.getElementById('e-brand').value    = r[C.brand]|| '';
  document.getElementById('e-note').value     = r[C.note] || '';

  // ── checkbox ประเภทผู้ประกอบการ ──
  const bizTypes = {
    'OTOP': C.type_otop, 'SMEs': C.type_smes,
    'วิสาหกิจชุมชน': C.type_vill, 'StartUp': C.type_startup, 'บริษัทฯ': C.type_corp
  };
  document.getElementById('e-ประเภท_อื่นๆ').value = r[C.type_etc] || '';

  // ── checkbox ประเภทสินค้า ──
  const prodTypes = {
    'สินค้าอาหาร': C.prod_food, 'สินค้าผ้า': C.prod_cloth,
    'สินค้าของใช้': C.prod_goods, 'สินค้าสมุนไพร': C.prod_herb, 'สินค้าเกษตร': C.prod_agri
  };
  document.getElementById('e-สินค้า_อื่นๆ').value = r[C.prod_etc] || '';

  // ── checkbox มาตรฐาน ──
  const stds = {
    'OTOP3-5': C.std_otop, 'มผช': C.std_mph, 'อย': C.std_fda,
    'GAP': C.std_gap, 'GMP': C.std_gmp, 'NBLBrand': C.std_nbl
  };
  document.getElementById('e-มาตรฐาน_อื่นๆ').value = r[C.std_etc] || '';

  // set checkboxes
  editCheckStates = {};
  [...Object.entries(bizTypes), ...Object.entries(prodTypes), ...Object.entries(stds)]
    .forEach(([key, col]) => {
      editCheckStates[key] = r[col] === 'ใช่';
      const el = document.getElementById('e-item-' + key);
      if (el) el.classList.toggle('checked', editCheckStates[key]);
    });

  // tier
  editTier = null;
  [1, 2, 3].forEach(t =>
    document.getElementById('et' + t).classList.remove('sel-t1', 'sel-t2', 'sel-t3')
  );
  if      (r[C.tier] === 'TIER 1') { editTier = 1; document.getElementById('et1').classList.add('sel-t1'); }
  else if (r[C.tier] === 'TIER 2') { editTier = 2; document.getElementById('et2').classList.add('sel-t2'); }
  else if (r[C.tier] === 'TIER 3') { editTier = 3; document.getElementById('et3').classList.add('sel-t3'); }

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
    ชื่อผู้ใส่ข้อมูล: document.getElementById('e-rep').value.trim(),
    ตำแหน่ง:         document.getElementById('e-pos').value.trim(),
    หน่วยงาน:        document.getElementById('e-ag').value.trim(),
    ชื่อสถานประกอบการ: document.getElementById('e-name').value.trim(),
    ที่ตั้ง:            document.getElementById('e-loc').value.trim(),
    โทรศัพท์:          document.getElementById('e-phone').value.trim(),
    ชื่อผู้ประกอบการ:  document.getElementById('e-owner').value.trim(),
    จำนวนสมาชิก:      document.getElementById('e-member').value.trim(),
    กำลังการผลิต:     document.getElementById('e-capacity').value.trim(),
    รายได้เฉลี่ย:     document.getElementById('e-income').value.trim(),
    ชื่อแบรนด์:        document.getElementById('e-brand').value.trim(),
    ประเภท_OTOP:           editCheckStates['OTOP']           || false,
    ประเภท_SMEs:           editCheckStates['SMEs']           || false,
    ประเภท_วิสาหกิจชุมชน: editCheckStates['วิสาหกิจชุมชน'] || false,
    ประเภท_StartUp:        editCheckStates['StartUp']        || false,
    ประเภท_บริษัทฯ:        editCheckStates['บริษัทฯ']        || false,
    ประเภท_อื่นๆ:          document.getElementById('e-ประเภท_อื่นๆ').value.trim(),
    สินค้า_อาหาร:          editCheckStates['สินค้าอาหาร']   || false,
    สินค้า_ผ้า:             editCheckStates['สินค้าผ้า']     || false,
    สินค้า_ของใช้:          editCheckStates['สินค้าของใช้']  || false,
    สินค้า_สมุนไพร:         editCheckStates['สินค้าสมุนไพร'] || false,
    สินค้า_เกษตร:           editCheckStates['สินค้าเกษตร']  || false,
    สินค้า_อื่นๆ:           document.getElementById('e-สินค้า_อื่นๆ').value.trim(),
    มาตรฐาน_OTOP3_5:       editCheckStates['OTOP3-5']  || false,
    มาตรฐาน_มผช:           editCheckStates['มผช']      || false,
    มาตรฐาน_อย:            editCheckStates['อย']       || false,
    มาตรฐาน_GAP:           editCheckStates['GAP']      || false,
    มาตรฐาน_GMP:           editCheckStates['GMP']      || false,
    มาตรฐาน_NBLBrand:      editCheckStates['NBLBrand'] || false,
    มาตรฐาน_อื่นๆ:         document.getElementById('e-มาตรฐาน_อื่นๆ').value.trim(),
    tier:     editTier ? 'TIER ' + editTier : '',
    หมายเหตุ: document.getElementById('e-note').value.trim(),
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
