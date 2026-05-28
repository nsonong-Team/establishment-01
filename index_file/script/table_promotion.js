// ══════════════════════════════════════════════════
//  table_promotion.js — Load & render promotion table
// ══════════════════════════════════════════════════

// ── Load data from GAS ────────────────────────────
async function loadProTableData() {
  const tbody = document.getElementById('proTableBody');
  tbody.innerHTML = '<tr><td colspan="12" style="text-align:center;padding:40px;color:#90a4ae">⏳ กำลังโหลด...</td></tr>';

  try {
    const res  = await fetch(PRO_GAS_URL + '?action=getSheetData');
    const data = await res.json();

    if (!data.rows || data.rows.length === 0) {
      proAllRows = [];
      tbody.innerHTML = '<tr><td colspan="12"><div class="empty-state"><div class="big-icon">📋</div><div>ยังไม่มีข้อมูล</div></div></td></tr>';
      return;
    }

    proColMap  = buildProColMap(buildIdx(data.headers));
    proAllRows = data.rows;
    applyProFilter();
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="12" style="text-align:center;color:#c62828;padding:30px">❌ ไม่สามารถโหลดข้อมูลได้</td></tr>';
  }
}

// ── Apply filter & render ──────────────────────────
function applyProFilter() {
  const C      = proColMap;
  const search = (document.getElementById('proSearch').value || '').toLowerCase();

  const filtered = proAllRows.filter(r => {
    if (search && !(r[C.biz] || '').toLowerCase().includes(search) &&
                  !(r[C.rep] || '').toLowerCase().includes(search)) return false;
    return true;
  });

  document.getElementById('proFilterCount').textContent =
    filtered.length === proAllRows.length
      ? 'ทั้งหมด ' + proAllRows.length + ' รายการ'
      : 'แสดง ' + filtered.length + ' / ' + proAllRows.length + ' รายการ';

  proLastFiltered = filtered;
  const tbody = document.getElementById('proTableBody');

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="12"><div class="empty-state"><div class="big-icon">🔍</div><div>ไม่พบข้อมูลที่ตรงกัน</div></div></td></tr>';
    return;
  }

  // helper รวม checkbox ที่ติ๊กเป็น list
  const checked = (r, keys) => keys
    .filter(k => r[C[k]] === 'ใช่')
    .map(k => {
      const labels = {
        m1_plan:'วางแผนตลาด', m1_brand:'สร้างแบรนด์', m1_pack:'บรรจุภัณฑ์',
        m1_online:'ตลาดออนไลน์', m1_expo:'งานแสดงสินค้า', m1_analyze:'วิเคราะห์ตลาด',
        m1_identity:'อัตลักษณ์', m1_local:'ภูมิปัญญา', m1_network:'เครือข่าย',
        m1_ai:'AI', m1_bcg:'BCG', m1_bigdata:'BigData', m1_green:'ตลาดสีเขียว', m1_qr:'QR Code',
        m2_agri:'คุณภาพผลผลิต', m2_process:'แปรรูป', m2_gap:'GAP', m2_iso:'ISO',
        m2_fda:'อย/GMP', m2_formula:'สูตรผลิต', m2_lab:'Lab', m2_hygiene:'สุขอนามัย',
        m2_label:'ฉลาก', m2_risk:'ความเสี่ยง', m2_otop:'OTOP', m2_design:'ออกแบบ',
        m3_cost:'ต้นทุน', m3_agtech:'เทคโนเกษตร', m3_lean:'Lean', m3_std:'มาตรฐานโรงงาน',
        m3_machine:'เครื่องจักร', m3_env:'สิ่งแวดล้อม', m3_local:'อุตฯท้องถิ่น',
        m3_ind40:'อุตฯ4.0', m3_link:'เชื่อมโยงผลิต',
        m4_farmer:'รวมกลุ่มเกษตร', m4_group:'พัฒนากลุ่ม', m4_learn:'แหล่งเรียนรู้', m4_skill:'ทักษะแรงงาน',
        m5_trademark:'เครื่องหมายการค้า', m5_account:'บัญชี', m5_fund:'แหล่งทุน',
        m5_tax:'ภาษี/กฎหมาย', m5_consult:'คำปรึกษา',
      };
      return labels[k] || k;
    }).join(', ') || '-';

  const allKeys = [
    'm1_plan','m1_brand','m1_pack','m1_online','m1_expo','m1_analyze',
    'm1_identity','m1_local','m1_network','m1_ai','m1_bcg','m1_bigdata','m1_green','m1_qr',
    'm2_agri','m2_process','m2_gap','m2_iso','m2_fda','m2_formula','m2_lab',
    'm2_hygiene','m2_label','m2_risk','m2_otop','m2_design',
    'm3_cost','m3_agtech','m3_lean','m3_std','m3_machine','m3_env','m3_local','m3_ind40','m3_link',
    'm4_farmer','m4_group','m4_learn','m4_skill',
    'm5_trademark','m5_account','m5_fund','m5_tax','m5_consult',
  ];

  tbody.innerHTML = filtered.map((r, i) => `<tr>
    <td><strong>${r[C.no]  || ''}</strong></td>
    <td><button class="btn-edit" onclick="openProEdit(this,${i})">✏️ แก้ไข</button></td>
    <td>${r[C.rep] || '-'}</td>
    <td>${r[C.pos] || '-'}</td>
    <td>${r[C.ag]  || '-'}</td>
    <td><strong>${r[C.biz] || '-'}</strong></td>
    <td style="font-size:11px">${checked(r, allKeys.filter(k => k.startsWith('m1')))}<br><span style="color:#90a4ae">${r[C.m1_etc] || ''}</span></td>
    <td style="font-size:11px">${checked(r, allKeys.filter(k => k.startsWith('m2')))}<br><span style="color:#90a4ae">${r[C.m2_etc] || ''}</span></td>
    <td style="font-size:11px">${checked(r, allKeys.filter(k => k.startsWith('m3')))}<br><span style="color:#90a4ae">${r[C.m3_etc] || ''}</span></td>
    <td style="font-size:11px">${checked(r, allKeys.filter(k => k.startsWith('m4')))}<br><span style="color:#90a4ae">${r[C.m4_etc] || ''}</span></td>
    <td style="font-size:11px">${checked(r, allKeys.filter(k => k.startsWith('m5')))}<br><span style="color:#90a4ae">${r[C.m5_etc] || ''}</span></td>
    <td>${r[C.note] || '-'}</td>
    <td>${r[C.date] || '-'}</td>
  </tr>`).join('');
}

// ── Clear filter ───────────────────────────────────
function clearProFilter() {
  document.getElementById('proSearch').value = '';
  applyProFilter();
}