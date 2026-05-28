// ══════════════════════════════════════════════════
//  overview.js — Load & render all 3 sheets
// ══════════════════════════════════════════════════

let ovRows1 = [], ovRows2 = [], ovRows3 = [];
let ovFiltered1 = [], ovFiltered2 = [], ovFiltered3 = [];

// ── Sheet 1: ข้อมูลผู้ประกอบการ ───────────────────
async function loadOvData1() {
  const tbody = document.getElementById('ovBody1');
  tbody.innerHTML = '<tr><td colspan="17" style="text-align:center;padding:30px;color:#90a4ae">⏳ กำลังโหลด...</td></tr>';
  try {
    const res  = await fetch(GAS_URL + '?action=getSheetData');
    const data = await res.json();
    if (!data.rows || data.rows.length === 0) {
      ovRows1 = [];
      tbody.innerHTML = '<tr><td colspan="17"><div class="empty-state"><div class="big-icon">📋</div><div>ยังไม่มีข้อมูล</div></div></td></tr>';
      return;
    }
    const C = getColMap(buildIdx(data.headers));
    ovRows1 = data.rows.map(r => ({
      no:   r[C.no],   rep:  r[C.rep],  pos:  r[C.pos],
      ag:   r[C.ag],   name: r[C.name], loc:  r[C.loc],
      phone:r[C.phone],member:r[C.member],capacity:r[C.capacity],
      income:r[C.income],brand:r[C.brand],
      types: [
        r[C.type_otop]    === 'ใช่' ? 'OTOP'     : '',
        r[C.type_smes]    === 'ใช่' ? 'SMEs'     : '',
        r[C.type_vill]    === 'ใช่' ? 'วิสาหกิจ' : '',
        r[C.type_startup] === 'ใช่' ? 'StartUp'  : '',
        r[C.type_corp]    === 'ใช่' ? 'บริษัทฯ'  : '',
        r[C.type_etc]     || '',
      ].filter(Boolean).join(', '),
      prods: [
        r[C.prod_food]  === 'ใช่' ? 'อาหาร'    : '',
        r[C.prod_cloth] === 'ใช่' ? 'ผ้า'       : '',
        r[C.prod_goods] === 'ใช่' ? 'ของใช้'    : '',
        r[C.prod_herb]  === 'ใช่' ? 'สมุนไพร'   : '',
        r[C.prod_agri]  === 'ใช่' ? 'เกษตร'     : '',
        r[C.prod_etc]   || '',
      ].filter(Boolean).join(', '),
      stds: [
        r[C.std_otop] === 'ใช่' ? 'OTOP3-5' : '',
        r[C.std_mph]  === 'ใช่' ? 'มผช'     : '',
        r[C.std_fda]  === 'ใช่' ? 'อย'      : '',
        r[C.std_gap]  === 'ใช่' ? 'GAP'     : '',
        r[C.std_gmp]  === 'ใช่' ? 'GMP'     : '',
        r[C.std_nbl]  === 'ใช่' ? 'NBL'     : '',
        r[C.std_etc]  || '',
      ].filter(Boolean).join(', '),
      tier: r[C.tier], note: r[C.note], date: r[C.date],
    }));
    applyOvFilter1();
  } catch(e) {
    tbody.innerHTML = '<tr><td colspan="17" style="text-align:center;color:#c62828;padding:30px">❌ โหลดไม่สำเร็จ</td></tr>';
  }
}

function applyOvFilter1() {
  const search = (document.getElementById('ovSearch1').value || '').toLowerCase();
  ovFiltered1  = ovRows1.filter(r => !search || (r.name || '').toLowerCase().includes(search));
  document.getElementById('ovCount1').textContent =
    ovFiltered1.length === ovRows1.length
      ? 'ทั้งหมด ' + ovRows1.length + ' รายการ'
      : 'แสดง ' + ovFiltered1.length + ' / ' + ovRows1.length + ' รายการ';
  const tbody = document.getElementById('ovBody1');
  if (ovFiltered1.length === 0) {
    tbody.innerHTML = '<tr><td colspan="17"><div class="empty-state"><div class="big-icon">🔍</div><div>ไม่พบข้อมูล</div></div></td></tr>';
    return;
  }
  tbody.innerHTML = ovFiltered1.map(r => `<tr>
    <td><strong>${r.no || ''}</strong></td>
    <td>${r.rep || '-'}</td><td>${r.pos || '-'}</td><td>${r.ag || '-'}</td>
    <td><strong>${r.name || '-'}</strong></td>
    <td>${r.loc || '-'}</td><td>${r.phone || '-'}</td>
    <td>${r.member || '-'}</td><td>${r.capacity || '-'}</td><td>${r.income || '-'}</td>
    <td>${r.brand || '-'}</td>
    <td style="font-size:11px">${r.types || '-'}</td>
    <td style="font-size:11px">${r.prods || '-'}</td>
    <td style="font-size:11px">${r.stds  || '-'}</td>
    <td>${r.tier || '-'}</td>
    <td>${r.note || '-'}</td><td>${r.date || '-'}</td>
  </tr>`).join('');
}

// ── Sheet 2: ผลการดำเนินงาน ───────────────────────
async function loadOvData2() {
  const tbody = document.getElementById('ovBody2');
  tbody.innerHTML = '<tr><td colspan="17" style="text-align:center;padding:30px;color:#90a4ae">⏳ กำลังโหลด...</td></tr>';
  try {
    const res  = await fetch(ACT_GAS_URL + '?action=getSheetData');
    const data = await res.json();
    if (!data.rows || data.rows.length === 0) {
      ovRows2 = [];
      tbody.innerHTML = '<tr><td colspan="17"><div class="empty-state"><div class="big-icon">📋</div><div>ยังไม่มีข้อมูล</div></div></td></tr>';
      return;
    }
    const C = buildActColMap(buildIdx(data.headers));
    ovRows2 = data.rows.map(r => ({
      no: r[C.no], rep: r[C.rep], pos: r[C.pos], ag: r[C.ag], biz: r[C.biz],
      tr_period: r[C.tr_period], tr_place: r[C.tr_place],
      tr_topic:  r[C.tr_topic],  tr_org:   r[C.tr_org],
      st_period: r[C.st_period], st_place: r[C.st_place],
      st_topic:  r[C.st_topic],  st_org:   r[C.st_org], st_result: r[C.st_result],
      channels: [
        r[C.sa_local]  === 'ใช่' ? `🏠ในจังหวัด(${r[C.sa_local_val]  || 0}฿)` : '',
        r[C.sa_other]  === 'ใช่' ? `🚚ต่างจังหวัด(${r[C.sa_other_val]  || 0}฿)` : '',
        r[C.sa_modern] === 'ใช่' ? `🏪ModernTrade(${r[C.sa_modern_val] || 0}฿)` : '',
        r[C.sa_export] === 'ใช่' ? `🌏ต่างประเทศ(${r[C.sa_export_val]  || 0}฿)` : '',
        r[C.sa_etc] || '',
      ].filter(Boolean).join(', '),
      note: r[C.note], date: r[C.date],
    }));
    applyOvFilter2();
  } catch(e) {
    tbody.innerHTML = '<tr><td colspan="17" style="text-align:center;color:#c62828;padding:30px">❌ โหลดไม่สำเร็จ</td></tr>';
  }
}

function applyOvFilter2() {
  const search = (document.getElementById('ovSearch2').value || '').toLowerCase();
  ovFiltered2  = ovRows2.filter(r => !search || (r.biz || '').toLowerCase().includes(search));
  document.getElementById('ovCount2').textContent =
    ovFiltered2.length === ovRows2.length
      ? 'ทั้งหมด ' + ovRows2.length + ' รายการ'
      : 'แสดง ' + ovFiltered2.length + ' / ' + ovRows2.length + ' รายการ';
  const tbody = document.getElementById('ovBody2');
  if (ovFiltered2.length === 0) {
    tbody.innerHTML = '<tr><td colspan="17"><div class="empty-state"><div class="big-icon">🔍</div><div>ไม่พบข้อมูล</div></div></td></tr>';
    return;
  }
  tbody.innerHTML = ovFiltered2.map(r => `<tr>
    <td><strong>${r.no || ''}</strong></td>
    <td>${r.rep || '-'}</td><td>${r.pos || '-'}</td><td>${r.ag || '-'}</td>
    <td><strong>${r.biz || '-'}</strong></td>
    <td>${r.tr_period || '-'}</td><td>${r.tr_place || '-'}</td>
    <td>${r.tr_topic  || '-'}</td><td>${r.tr_org   || '-'}</td>
    <td>${r.st_period || '-'}</td><td>${r.st_place || '-'}</td>
    <td>${r.st_topic  || '-'}</td><td>${r.st_org   || '-'}</td><td>${r.st_result || '-'}</td>
    <td style="font-size:11px">${r.channels || '-'}</td>
    <td>${r.note || '-'}</td><td>${r.date || '-'}</td>
  </tr>`).join('');
}

// ── Sheet 3: การส่งเสริม/พัฒนา ───────────────────
async function loadOvData3() {
  const tbody = document.getElementById('ovBody3');
  tbody.innerHTML = '<tr><td colspan="12" style="text-align:center;padding:30px;color:#90a4ae">⏳ กำลังโหลด...</td></tr>';
  try {
    const res  = await fetch(PRO_GAS_URL + '?action=getSheetData');
    const data = await res.json();
    if (!data.rows || data.rows.length === 0) {
      ovRows3 = [];
      tbody.innerHTML = '<tr><td colspan="12"><div class="empty-state"><div class="big-icon">📋</div><div>ยังไม่มีข้อมูล</div></div></td></tr>';
      return;
    }
    const C = buildProColMap(buildIdx(data.headers));

    const checked = (r, keys) => keys
      .filter(k => r[C[k]] === 'ใช่')
      .map(k => {
        const labels = {
          m1_plan:'วางแผนตลาด', m1_brand:'สร้างแบรนด์', m1_pack:'บรรจุภัณฑ์',
          m1_online:'ตลาดออนไลน์', m1_expo:'งานแสดงสินค้า', m1_analyze:'วิเคราะห์ตลาด',
          m1_identity:'อัตลักษณ์', m1_local:'ภูมิปัญญา', m1_network:'เครือข่าย',
          m1_ai:'AI', m1_bcg:'BCG', m1_bigdata:'BigData', m1_green:'ตลาดสีเขียว', m1_qr:'QR',
          m2_agri:'คุณภาพผลผลิต', m2_process:'แปรรูป', m2_gap:'GAP', m2_iso:'ISO',
          m2_fda:'อย/GMP', m2_formula:'สูตรผลิต', m2_lab:'Lab', m2_hygiene:'สุขอนามัย',
          m2_label:'ฉลาก', m2_risk:'ความเสี่ยง', m2_otop:'OTOP', m2_design:'ออกแบบ',
          m3_cost:'ต้นทุน', m3_agtech:'เทคโนเกษตร', m3_lean:'Lean', m3_std:'มาตรฐานโรงงาน',
          m3_machine:'เครื่องจักร', m3_env:'สิ่งแวดล้อม', m3_local:'อุตฯท้องถิ่น',
          m3_ind40:'อุตฯ4.0', m3_link:'เชื่อมโยง',
          m4_farmer:'รวมกลุ่มเกษตร', m4_group:'พัฒนากลุ่ม',
          m4_learn:'แหล่งเรียนรู้', m4_skill:'ทักษะแรงงาน',
          m5_trademark:'เครื่องหมายการค้า', m5_account:'บัญชี',
          m5_fund:'แหล่งทุน', m5_tax:'ภาษี/กฎหมาย', m5_consult:'คำปรึกษา',
        };
        return labels[k] || k;
      }).join(', ') || '-';

    const m1keys = ['m1_plan','m1_brand','m1_pack','m1_online','m1_expo','m1_analyze','m1_identity','m1_local','m1_network','m1_ai','m1_bcg','m1_bigdata','m1_green','m1_qr'];
    const m2keys = ['m2_agri','m2_process','m2_gap','m2_iso','m2_fda','m2_formula','m2_lab','m2_hygiene','m2_label','m2_risk','m2_otop','m2_design'];
    const m3keys = ['m3_cost','m3_agtech','m3_lean','m3_std','m3_machine','m3_env','m3_local','m3_ind40','m3_link'];
    const m4keys = ['m4_farmer','m4_group','m4_learn','m4_skill'];
    const m5keys = ['m5_trademark','m5_account','m5_fund','m5_tax','m5_consult'];

    ovRows3 = data.rows.map(r => ({
      no: r[C.no], rep: r[C.rep], pos: r[C.pos], ag: r[C.ag], biz: r[C.biz],
      m1: checked(r, m1keys) + (r[C.m1_etc] ? ', ' + r[C.m1_etc] : ''),
      m2: checked(r, m2keys) + (r[C.m2_etc] ? ', ' + r[C.m2_etc] : ''),
      m3: checked(r, m3keys) + (r[C.m3_etc] ? ', ' + r[C.m3_etc] : ''),
      m4: checked(r, m4keys) + (r[C.m4_etc] ? ', ' + r[C.m4_etc] : ''),
      m5: checked(r, m5keys) + (r[C.m5_etc] ? ', ' + r[C.m5_etc] : ''),
      note: r[C.note], date: r[C.date],
    }));
    applyOvFilter3();
  } catch(e) {
    tbody.innerHTML = '<tr><td colspan="12" style="text-align:center;color:#c62828;padding:30px">❌ โหลดไม่สำเร็จ</td></tr>';
  }
}

function applyOvFilter3() {
  const search = (document.getElementById('ovSearch3').value || '').toLowerCase();
  ovFiltered3  = ovRows3.filter(r => !search || (r.biz || '').toLowerCase().includes(search));
  document.getElementById('ovCount3').textContent =
    ovFiltered3.length === ovRows3.length
      ? 'ทั้งหมด ' + ovRows3.length + ' รายการ'
      : 'แสดง ' + ovFiltered3.length + ' / ' + ovRows3.length + ' รายการ';
  const tbody = document.getElementById('ovBody3');
  if (ovFiltered3.length === 0) {
    tbody.innerHTML = '<tr><td colspan="12"><div class="empty-state"><div class="big-icon">🔍</div><div>ไม่พบข้อมูล</div></div></td></tr>';
    return;
  }
  tbody.innerHTML = ovFiltered3.map(r => `<tr>
    <td><strong>${r.no || ''}</strong></td>
    <td>${r.rep || '-'}</td><td>${r.pos || '-'}</td><td>${r.ag || '-'}</td>
    <td><strong>${r.biz || '-'}</strong></td>
    <td style="font-size:11px">${r.m1 || '-'}</td>
    <td style="font-size:11px">${r.m2 || '-'}</td>
    <td style="font-size:11px">${r.m3 || '-'}</td>
    <td style="font-size:11px">${r.m4 || '-'}</td>
    <td style="font-size:11px">${r.m5 || '-'}</td>
    <td>${r.note || '-'}</td><td>${r.date || '-'}</td>
  </tr>`).join('');
}