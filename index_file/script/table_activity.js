// ══════════════════════════════════════════════════
//  table_activity.js — Load & render activity table
// ══════════════════════════════════════════════════

// ── Load data from GAS ────────────────────────────
async function loadActTableData() {
  const tbody = document.getElementById('actTableBody');
  tbody.innerHTML = '<tr><td colspan="20" style="text-align:center;padding:40px;color:#90a4ae">⏳ กำลังโหลด...</td></tr>';

  try {
    const res  = await fetch(ACT_GAS_URL + '?action=getSheetData');
    const data = await res.json();

    if (!data.rows || data.rows.length === 0) {
      actAllRows = [];
      tbody.innerHTML = '<tr><td colspan="20"><div class="empty-state"><div class="big-icon">📋</div><div>ยังไม่มีข้อมูล</div></div></td></tr>';
      return;
    }

    actColMap  = buildActColMap(buildIdx(data.headers));
    actAllRows = data.rows;
    applyActFilter();
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="20" style="text-align:center;color:#c62828;padding:30px">❌ ไม่สามารถโหลดข้อมูลได้</td></tr>';
  }
}

// ── Apply filter & render ──────────────────────────
function applyActFilter() {
  const C      = actColMap;
  const search = (document.getElementById('actSearch').value || '').toLowerCase();

  const filtered = actAllRows.filter(r => {
    if (search && !(r[C.rep] || '').toLowerCase().includes(search)) return false;
    return true;
  });

  document.getElementById('actFilterCount').textContent =
    filtered.length === actAllRows.length
      ? 'ทั้งหมด ' + actAllRows.length + ' รายการ'
      : 'แสดง ' + filtered.length + ' / ' + actAllRows.length + ' รายการ';

  actLastFiltered = filtered;
  const tbody = document.getElementById('actTableBody');

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="20"><div class="empty-state"><div class="big-icon">🔍</div><div>ไม่พบข้อมูลที่ตรงกัน</div></div></td></tr>';
    return;
  }

  // helper แปลง ใช่/ไม่ → ✅/—
  const yes = v => v === 'ใช่' ? '✅' : '—';

  tbody.innerHTML = filtered.map((r, i) => `<tr>
    <td><strong>${r[C.no]  || ''}</strong></td>
    <td><button class="btn-edit" onclick="openActEdit(this,${i})">✏️ แก้ไข</button></td>
    <td><button class="btn-delete" onclick="deleteActRow(${r[C.no]})">🗑️ ลบ</button></td>
    <td>${r[C.rep] || '-'}</td>
    <td>${r[C.pos] || '-'}</td>
    <td>${r[C.ag]  || '-'}</td>
    <td><strong>${r[C.biz] || '-'}</strong></td>
    <td>${r[C.tr_period] || '-'}</td>
    <td>${r[C.tr_place]  || '-'}</td>
    <td>${r[C.tr_topic]  || '-'}</td>
    <td>${r[C.tr_org]    || '-'}</td>
    <td>${r[C.st_period] || '-'}</td>
    <td>${r[C.st_place]  || '-'}</td>
    <td>${r[C.st_topic]  || '-'}</td>
    <td>${r[C.st_org]    || '-'}</td>
    <td>${r[C.st_result] || '-'}</td>
    <td>${r[C.sa_period] || '-'}</td>
    <td>${r[C.sa_place]  || '-'}</td>
    <td>${r[C.sa_event]  || '-'}</td>
    <td>${r[C.sa_org]    || '-'}</td>
    <td style="font-size:11px">${[
      r[C.sa_local]  === 'ใช่' ? `🏠ในจังหวัด (${r[C.sa_local_val]  || 0} ฿)` : '',
      r[C.sa_other]  === 'ใช่' ? `🚚ต่างจังหวัด (${r[C.sa_other_val]  || 0} ฿)` : '',
      r[C.sa_modern] === 'ใช่' ? `🏪Modern Trade (${r[C.sa_modern_val] || 0} ฿)` : '',
      r[C.sa_export] === 'ใช่' ? `🌏ต่างประเทศ (${r[C.sa_export_val]  || 0} ฿)` : '',
      r[C.sa_etc] || '',
    ].filter(Boolean).join('<br>') || '-'}</td>
    <td>${r[C.note] || '-'}</td>
    <td>${r[C.date] || '-'}</td>
  </tr>`).join('');
}

// ── Clear filter ───────────────────────────────────
function clearActFilter() {
  document.getElementById('actSearch').value = '';
  applyActFilter();
}


async function deleteActRow(rowNo) {
  if (!confirm('ต้องการลบข้อมูลลำดับที่ ' + rowNo + ' ใช่หรือไม่?')) return;

  try {
    const res    = await fetch(ACT_GAS_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'delete', rowNum: rowNo })
    });
    const result = await res.json();
    if (result.success) {
      showToast('✅ ลบข้อมูลสำเร็จแล้ว');
      loadActTableData();
    } else {
      showToast('❌ ' + result.error, true);
    }
  } catch(e) {
    showToast('❌ ' + e.message, true);
  }
}