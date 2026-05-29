// ══════════════════════════════════════════════════
//  table.js — Load, filter & render data table
// ══════════════════════════════════════════════════

// ── Tier dropdown HTML for table cell ─────────────
function tierDropdown(rowNo, currentTier) {
  const cls = currentTier === 'TIER 1' ? 'qt1'
            : currentTier === 'TIER 2' ? 'qt2'
            : currentTier === 'TIER 3' ? 'qt3' : '';

  const opt = (val, label) =>
    `<option value="${val}" ${currentTier === val ? 'selected' : ''}>${label}</option>`;

  return `<select class="quick-tier ${cls}" id="qt-${rowNo}"
            onchange="quickUpdateTier('${rowNo}', this)"
            title="คลิกเพื่อเปลี่ยน TIER">
    <option value="" ${currentTier ? '' : 'selected'}>— ยังไม่ระบุ —</option>
    ${opt('TIER 1', 'TIER 1')}
    ${opt('TIER 2', 'TIER 2')}
    ${opt('TIER 3', 'TIER 3')}
  </select>`;
}

// ── Quick update tier directly from table ─────────
async function quickUpdateTier(rowNo, selectEl) {
  const tier = selectEl.value;
  const cls  = tier === 'TIER 1' ? 'qt1'
             : tier === 'TIER 2' ? 'qt2'
             : tier === 'TIER 3' ? 'qt3' : '';

  selectEl.className = 'quick-tier ' + cls + ' saving';

  const C   = colMap;
  const row = allRows.find(r => String(r[C.no]) === String(rowNo));
  if (!row) { showToast('❌ ไม่พบข้อมูลแถวนี้', true); return; }

  const updateData = {
    action: 'update',
    rowNum: rowNo,
    ชื่อผู้ใส่ข้อมูล: row[C.rep]      || '',
    ตำแหน่ง:         row[C.pos]      || '',
    หน่วยงาน:        row[C.ag]       || '',
    ชื่อสถานประกอบการ: row[C.name]   || '',
    ที่ตั้ง:           row[C.loc]    || '',
    โทรศัพท์:         row[C.phone]  || '',
    จำนวนสมาชิก:      row[C.member]   || '',
    กำลังการผลิต:     row[C.capacity] || '',
    รายได้เฉลี่ย:     row[C.income]   || '',
    ชื่อแบรนด์:       row[C.brand]  || '',
    ประเภท_OTOP:           row[C.type_otop]    === 'ใช่',
    ประเภท_SMEs:           row[C.type_smes]    === 'ใช่',
    ประเภท_วิสาหกิจชุมชน: row[C.type_vill]    === 'ใช่',
    ประเภท_StartUp:        row[C.type_startup] === 'ใช่',
    ประเภท_บริษัทฯ:        row[C.type_corp]    === 'ใช่',
    ประเภท_อื่นๆ:          row[C.type_etc]     || '',
    สินค้า_อาหาร:          row[C.prod_food]  === 'ใช่',
    สินค้า_ผ้า:             row[C.prod_cloth] === 'ใช่',
    สินค้า_ของใช้:          row[C.prod_goods] === 'ใช่',
    สินค้า_สมุนไพร:         row[C.prod_herb]  === 'ใช่',
    สินค้า_เกษตร:           row[C.prod_agri]  === 'ใช่',
    สินค้า_อื่นๆ:           row[C.prod_etc]   || '',
    มาตรฐาน_OTOP3_5:       row[C.std_otop] === 'ใช่',
    มาตรฐาน_มผช:           row[C.std_mph]  === 'ใช่',
    มาตรฐาน_อย:            row[C.std_fda]  === 'ใช่',
    มาตรฐาน_GAP:           row[C.std_gap]  === 'ใช่',
    มาตรฐาน_GMP:           row[C.std_gmp]  === 'ใช่',
    มาตรฐาน_NBLBrand:      row[C.std_nbl]  === 'ใช่',
    มาตรฐาน_อื่นๆ:         row[C.std_etc]  || '',
    tier:     tier,
    หมายเหตุ: row[C.note] || '',
  };

  try {
    const res    = await fetch(GAS_URL, { method: 'POST', body: JSON.stringify(updateData) });
    const result = await res.json();
    selectEl.className = 'quick-tier ' + cls;
    if (result.success) {
      row[C.tier] = tier;
      showToast('✅ อัพเดต TIER เป็น "' + (tier || 'ยังไม่ระบุ') + '" สำเร็จ');
    } else {
      showToast('❌ ' + result.error, true);
    }
  } catch (e) {
    selectEl.className = 'quick-tier ' + cls;
    showToast('❌ ' + e.message, true);
  }
}

// ── Load all rows from Google Sheets ──────────────
async function loadTableData() {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '<tr><td colspan="16" style="text-align:center;padding:40px;color:#90a4ae">⏳ กำลังโหลด...</td></tr>';

  try {
    const res  = await fetch(GAS_URL + '?action=getSheetData');
    const data = await res.json();

    if (!data.rows || data.rows.length === 0) {
      allRows = [];
      tbody.innerHTML = '<tr><td colspan="16"><div class="empty-state"><div class="big-icon">📋</div><div>ยังไม่มีข้อมูล</div></div></td></tr>';
      return;
    }
    colMap  = getColMap(buildIdx(data.headers));
    allRows = data.rows;

    const types = [...new Set(data.rows.map(r => r[colMap.type]).filter(Boolean))].sort();
    document.getElementById('fType').innerHTML =
      '<option value="">ทั้งหมด</option>' +
      types.map(t => `<option value="${t}">${t}</option>`).join('');

    applyFilter();
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="16" style="text-align:center;color:#c62828;padding:30px">❌ ไม่สามารถโหลดข้อมูลได้</td></tr>';
  }
}

// ── Apply filters and re-render table ─────────────
function applyFilter() {
  const C      = colMap;
  const search = (document.getElementById('fSearch').value || '').toLowerCase();
  const tier   =  document.getElementById('fTier').value   || '';

  const filtered = allRows.filter(r => {
    if (search && !(r[C.name] || '').toLowerCase().includes(search)) return false;
    if (tier === 'ยังไม่ระบุ') { if (r[C.tier]) return false; }
    else if (tier && r[C.tier] !== tier) return false;
    return true;
  });

  document.getElementById('filterCount').textContent =
    filtered.length === allRows.length
      ? 'ทั้งหมด ' + allRows.length + ' รายการ'
      : 'แสดง ' + filtered.length + ' / ' + allRows.length + ' รายการ';

  lastFiltered = filtered;
  const tbody  = document.getElementById('tableBody');

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="16"><div class="empty-state"><div class="big-icon">🔍</div><div>ไม่พบข้อมูลที่ตรงกัน</div></div></td></tr>';
    return;
  }

  // helper แปลง ใช่/ไม่ → ✅/—
  const yes = v => v === 'ใช่' ? '✅' : '—';

  tbody.innerHTML = filtered.map((r, i) => `<tr>
    <td><strong>${r[C.no]  || ''}</strong></td>
    <td><button class="btn-edit" onclick="openEdit(this,${i})">✏️ แก้ไข</button></td>
    <td><button class="btn-delete" onclick="deleteRow(${r[C.no]})">🗑️ ลบ</button></td>
    <td>${r[C.rep]  || '-'}</td>
    <td>${r[C.pos]  || '-'}</td>
    <td>${r[C.ag]   || '-'}</td>
    <td><strong>${r[C.name] || '-'}</strong></td>
    <td>${r[C.loc]   || '-'}</td>
    <td>${r[C.phone] || '-'}</td>
    <td>${r[C.member]   || '-'}</td>
    <td>${r[C.capacity] || '-'}</td>
    <td>${r[C.income]   || '-'}</td>
    <td>${r[C.brand] || '-'}</td>
    <td style="font-size:11px">${[
      r[C.type_otop]    === 'ใช่' ? 'OTOP'     : '',
      r[C.type_smes]    === 'ใช่' ? 'SMEs'     : '',
      r[C.type_vill]    === 'ใช่' ? 'วิสาหกิจ' : '',
      r[C.type_startup] === 'ใช่' ? 'StartUp'  : '',
      r[C.type_corp]    === 'ใช่' ? 'บริษัทฯ'  : '',
      r[C.type_etc]     || '',
    ].filter(Boolean).join(', ') || '-'}</td>
    <td style="font-size:11px">${[
      r[C.prod_food]  === 'ใช่' ? '🍽️อาหาร'    : '',
      r[C.prod_cloth] === 'ใช่' ? '👗ผ้า'       : '',
      r[C.prod_goods] === 'ใช่' ? '🏠ของใช้'    : '',
      r[C.prod_herb]  === 'ใช่' ? '🌿สมุนไพร'   : '',
      r[C.prod_agri]  === 'ใช่' ? '🌾เกษตร'     : '',
      r[C.prod_etc]   || '',
    ].filter(Boolean).join(', ') || '-'}</td>
    <td style="font-size:11px">${[
      r[C.std_otop] === 'ใช่' ? 'OTOP3-5' : '',
      r[C.std_mph]  === 'ใช่' ? 'มผช'     : '',
      r[C.std_fda]  === 'ใช่' ? 'อย'      : '',
      r[C.std_gap]  === 'ใช่' ? 'GAP'     : '',
      r[C.std_gmp]  === 'ใช่' ? 'GMP'     : '',
      r[C.std_nbl]  === 'ใช่' ? 'NBL'     : '',
      r[C.std_etc]  || '',
    ].filter(Boolean).join(', ') || '-'}</td>
    <td style="text-align:center">${tierDropdown(r[C.no], r[C.tier])}</td>
    <td>${r[C.note] || '-'}</td>
    <td>${r[C.date] || '-'}</td>
  </tr>`).join('');
}

// ── Clear all filters ──────────────────────────────
function clearFilter() {
  ['fSearch', 'fTier', 'fType', 'fChannel'].forEach(id => {
    document.getElementById(id).value = '';
  });
  applyFilter();
}


async function deleteRow(rowNo) {
  if (!confirm('ต้องการลบข้อมูลลำดับที่ ' + rowNo + ' ใช่หรือไม่?')) return;

  try {
    const res    = await fetch(GAS_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'delete', rowNum: rowNo })
    });
    const result = await res.json();
    if (result.success) {
      showToast('✅ ลบข้อมูลสำเร็จแล้ว');
      loadTableData();
    } else {
      showToast('❌ ' + result.error, true);
    }
  } catch(e) {
    showToast('❌ ' + e.message, true);
  }
}
