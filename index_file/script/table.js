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
    ชื่อสถานประกอบการ: row[C.name]  || '',
    ที่ตั้ง:            row[C.loc]   || '',
    ประเภทสินค้า:      row[C.type]  || '',
    ชื่อแบรนด์:        row[C.brand] || '',
    มาตรฐาน:          row[C.std]   || '',
    ระยะเวลา:         row[C.age]   || '',
    tier:             tier,
    ส่งออก:           row[C.exp]  === 'ใช่',
    ในประเทศ:         row[C.dom]  === 'ใช่',
    ออนไลน์:          row[C.onl]  === 'ใช่',
    ขายในพื้นที่:      row[C.loc2] === 'ใช่',
    อื่นๆ:            row[C.etc]  || '',
    หมายเหตุ:         row[C.note] || '',
    อบรม_เวลา:        row[C.tr_period] || '',
    อบรม_สถานที่:     row[C.tr_place]  || '',
    อบรม_หัวข้อ:      row[C.tr_topic]  || '',
    อบรม_หน่วยงาน:   row[C.tr_org]    || '',
    ดูงาน_เวลา:       row[C.st_period] || '',
    ดูงาน_สถานที่:    row[C.st_place]  || '',
    ดูงาน_หัวข้อ:     row[C.st_topic]  || '',
    ดูงาน_ผล:         row[C.st_result] || '',
    ดูงาน_หน่วยงาน:  row[C.st_org]    || '',
    จำหน่าย_เวลา:        row[C.sa_period] || '',
    จำหน่าย_สถานที่:     row[C.sa_place]  || '',
    จำหน่าย_ชื่องาน:     row[C.sa_event]  || '',
    จำหน่าย_หน่วยงาน:   row[C.sa_org]    || '',
    จำหน่าย_ในจังหวัด:   row[C.sa_local]  || '',
    จำหน่าย_ต่างจังหวัด: row[C.sa_other]  || '',
    จำหน่าย_trade:       row[C.sa_modern] || '',
    จำหน่าย_ต่างประเทศ:  row[C.sa_export] || '',
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
  tbody.innerHTML = '<tr><td colspan="31" style="text-align:center;padding:40px;color:#90a4ae">⏳ กำลังโหลด...</td></tr>';

  try {
    const res  = await fetch(GAS_URL + '?action=getSheetData');
    const data = await res.json();

    if (!data.rows || data.rows.length === 0) {
      allRows = [];
      tbody.innerHTML = '<tr><td colspan="31"><div class="empty-state"><div class="big-icon">📋</div><div>ยังไม่มีข้อมูล</div></div></td></tr>';
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
    tbody.innerHTML = '<tr><td colspan="31" style="text-align:center;color:#c62828;padding:30px">❌ ไม่สามารถโหลดข้อมูลได้</td></tr>';
  }
}

// ── Apply filters and re-render table ─────────────
function applyFilter() {
  const C       = colMap;
  const search  = (document.getElementById('fSearch').value  || '').toLowerCase();
  const tier    =  document.getElementById('fTier').value    || '';
  const type    =  document.getElementById('fType').value    || '';
  const channel =  document.getElementById('fChannel').value || '';
  const chanMap = { export: C.exp, dom: C.dom, online: C.onl, local: C.loc2 };

  const filtered = allRows.filter(r => {
    if (search && !(r[C.name] || '').toLowerCase().includes(search)) return false;
    if (tier === 'ยังไม่ระบุ') { if (r[C.tier]) return false; }
    else if (tier && r[C.tier] !== tier) return false;
    if (type    && r[C.type]            !== type)   return false;
    if (channel && r[chanMap[channel]]  !== 'ใช่')  return false;
    return true;
  });

  document.getElementById('filterCount').textContent =
    filtered.length === allRows.length
      ? 'ทั้งหมด ' + allRows.length + ' รายการ'
      : 'แสดง ' + filtered.length + ' / ' + allRows.length + ' รายการ';

  lastFiltered = filtered;
  const tbody  = document.getElementById('tableBody');

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="31"><div class="empty-state"><div class="big-icon">🔍</div><div>ไม่พบข้อมูลที่ตรงกัน</div></div></td></tr>'
    return;
  }

  tbody.innerHTML = filtered.map((r, i) => {
    const ch = [
      r[C.exp]  === 'ใช่' ? '🌏ส่งออก'   : '',
      r[C.dom]  === 'ใช่' ? '🇹🇭ในประเทศ' : '',
      r[C.onl]  === 'ใช่' ? '💻ออนไลน์'   : '',
      r[C.loc2] === 'ใช่' ? '🏪พื้นที่'    : '',
      r[C.etc] || '',
    ].filter(Boolean).join(', ');

    return `<tr>
      <td><strong>${r[C.no]   || ''}</strong></td>
      <td><button class="btn-edit" onclick="openEdit(this,${i})">✏️ แก้ไข</button></td>
      <td><strong>${r[C.name] || '-'}</strong></td>
      <td>${r[C.loc]   || '-'}</td>
      <td>${r[C.type]  || '-'}</td>
      <td>${r[C.brand] ? `<span class="badge">${r[C.brand]}</span>` : '-'}</td>
      <td>${r[C.std]   || '-'}</td>
      <td style="text-align:center">${r[C.age]  || '-'}</td>
      <td style="text-align:center">${tierDropdown(r[C.no], r[C.tier])}</td>
      <td style="font-size:11.5px">${ch || '-'}</td>
      <td>${r[C.tr_period] || '-'}</td>
      <td>${r[C.tr_place]  || '-'}</td>
      <td>${r[C.tr_topic]  || '-'}</td>
      <td>${r[C.tr_org]    || '-'}</td>
      <td>${r[C.st_period] || '-'}</td>
      <td>${r[C.st_place]  || '-'}</td>
      <td>${r[C.st_topic]  || '-'}</td>
      <td>${r[C.st_result] || '-'}</td>
      <td>${r[C.st_org]    || '-'}</td>
      <td>${r[C.sa_period] || '-'}</td>
      <td>${r[C.sa_place]  || '-'}</td>
      <td>${r[C.sa_event]  || '-'}</td>
      <td>${r[C.sa_org]    || '-'}</td>
      <td style="text-align:right">${r[C.sa_local]  || '-'}</td>
      <td style="text-align:right">${r[C.sa_other]  || '-'}</td>
      <td style="text-align:right">${r[C.sa_modern] || '-'}</td>
      <td style="text-align:right">${r[C.sa_export] || '-'}</td>
      <td>${r[C.note] || '-'}</td>
      <td>${r[C.rep]  || '-'}</td>
      <td>${r[C.ag]   || '-'}</td>
      <td>${r[C.date] || '-'}</td>
      
    </tr>`;
  }).join('');
}

// ── Clear all filters ──────────────────────────────
function clearFilter() {
  ['fSearch', 'fTier', 'fType', 'fChannel'].forEach(id => {
    document.getElementById(id).value = '';
  });
  applyFilter();
}
