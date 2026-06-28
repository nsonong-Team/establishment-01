// ══════════════════════════════════════════════════
//  dashboard.js — KPI cards, donut chart, bar charts
// ══════════════════════════════════════════════════

async function loadDashboard() {
  try {
    const res  = await fetch(GAS_URL + '?action=getSheetData');
    const data = await res.json();

    const rows = data.rows;
    if (!rows || rows.length === 0) {
      ['kpi-total','kpi-tier1','kpi-tier2','kpi-tier3',
       'ch-export','ch-dom','ch-online','ch-local']
        .forEach(id => document.getElementById(id).textContent = '0');
      return;
    }

    const C     = getColMap(buildIdx(data.headers));
    const total = rows.length;
    const t1    = rows.filter(r => r[C.tier] === 'TIER 1').length;
    const t2    = rows.filter(r => r[C.tier] === 'TIER 2').length;
    const t3    = rows.filter(r => r[C.tier] === 'TIER 3').length;

    // ── KPI ───────────────────────────────────────
    document.getElementById('kpi-total').textContent = total;
    document.getElementById('kpi-tier1').textContent = t1;
    document.getElementById('kpi-tier2').textContent = t2;
    document.getElementById('kpi-tier3').textContent = t3;

    // ── Donut ─────────────────────────────────────
    const tierData = [
      { label:'TIER 1', val:t1,             color:'#f57c00' },
      { label:'TIER 2', val:t2,             color:'#1565c0' },
      { label:'TIER 3', val:t3,             color:'#6a1b9a' },
      { label:'ไม่ระบุ', val:total-t1-t2-t3, color:'#cfd8dc' },
    ].filter(d => d.val > 0);

    let conic = '', cum = 0;
    tierData.forEach(d => {
      const p = d.val / total * 360;
      conic += `${d.color} ${cum}deg ${cum + p}deg, `;
      cum   += p;
    });
    document.getElementById('donutTier').style.background =
      'conic-gradient(' + conic.slice(0, -2) + ')';
    document.getElementById('donutTotal').textContent = total;
    document.getElementById('tierLegend').innerHTML = tierData
      .map(d => `<div class="legend-item">
        <div class="legend-dot" style="background:${d.color}"></div>
        <span>${d.label} (${d.val})</span>
      </div>`).join('');

    // ── Channels ──────────────────────────────────
    document.getElementById('ch-export').textContent = rows.filter(r => r[C.exp]  === 'ใช่').length;
    document.getElementById('ch-dom').textContent    = rows.filter(r => r[C.dom]  === 'ใช่').length;
    document.getElementById('ch-online').textContent = rows.filter(r => r[C.onl]  === 'ใช่').length;
    document.getElementById('ch-local').textContent  = rows.filter(r => r[C.loc2] === 'ใช่').length;

    // ── ประเภทสินค้า ──────────────────────────────
    const typeCnt = {};
    rows.forEach(r => {
      const types = [
        r[C.prod_food]  === 'ใช่' ? 'อาหารและเครื่องดื่ม' : '',
        r[C.prod_cloth] === 'ใช่' ? 'ผ้าและเครื่องแต่งกาย' : '',
        r[C.prod_goods] === 'ใช่' ? 'ของใช้/ของประดับ' : '',
        r[C.prod_herb]  === 'ใช่' ? 'สมุนไพร' : '',
        r[C.prod_agri]  === 'ใช่' ? 'สินค้าเกษตร' : '',
      ].filter(Boolean);
      if (types.length === 0) types.push('(ไม่ระบุ)');
      types.forEach(t => { typeCnt[t] = (typeCnt[t] || 0) + 1; });
    });
    renderBar('typeChart', typeCnt, 8, '#1565c0');

    // ── หน่วยงาน ──────────────────────────────────
    const agCnt = {};
    rows.forEach(r => {
      const k = r[C.ag] || '(ไม่ระบุ)';
      agCnt[k] = (agCnt[k] || 0) + 1;
    });
    renderBar('agencyChart', agCnt, 10, '#2e7d32');

  } catch(e) { /* silent */ }

  // โหลดข้อมูล activity และ promotion แยก
  loadDashAct();
  loadDashPro();
  loadTierHistory();
}

// ── ผลการดำเนินงาน ────────────────────────────────
async function loadDashAct() {
  try {
    const res  = await fetch(ACT_GAS_URL + '?action=getSheetData');
    const data = await res.json();
    if (!data.rows || data.rows.length === 0) {
      ['kpi-act-train','kpi-act-study','kpi-act-sales','kpi-act-value']
        .forEach(id => document.getElementById(id).textContent = '0');
      return;
    }

    const C    = buildActColMap(buildIdx(data.headers));
    const rows = data.rows;

    const trainCount = rows.filter(r => r[C.tr_period]).length;
    const studyCount = rows.filter(r => r[C.st_period]).length;
    const salesCount = rows.filter(r => r[C.sa_period]).length;

    const totalValue = rows.reduce((sum, r) => {
      return sum
        + (parseFloat(r[C.sa_local_val])  || 0)
        + (parseFloat(r[C.sa_other_val])  || 0)
        + (parseFloat(r[C.sa_modern_val]) || 0)
        + (parseFloat(r[C.sa_export_val]) || 0);
    }, 0);

    document.getElementById('kpi-act-train').textContent = trainCount;
    document.getElementById('kpi-act-study').textContent = studyCount;
    document.getElementById('kpi-act-sales').textContent = salesCount;
    document.getElementById('kpi-act-value').textContent = totalValue.toLocaleString('th-TH');

    // bar chart มูลค่าตามช่องทาง
    const localVal  = rows.reduce((s, r) => s + (parseFloat(r[C.sa_local_val])  || 0), 0);
    const otherVal  = rows.reduce((s, r) => s + (parseFloat(r[C.sa_other_val])  || 0), 0);
    const modernVal = rows.reduce((s, r) => s + (parseFloat(r[C.sa_modern_val]) || 0), 0);
    const exportVal = rows.reduce((s, r) => s + (parseFloat(r[C.sa_export_val]) || 0), 0);

    renderBar('salesChart', {
      '🏠 ในจังหวัด':    localVal,
      '🚚 ต่างจังหวัด':  otherVal,
      '🏪 Modern Trade': modernVal,
      '🌏 ต่างประเทศ':   exportVal,
    }, 4, '#e65100');

  } catch(e) { /* silent */ }
}

// ── การส่งเสริม/พัฒนา ────────────────────────────
async function loadDashPro() {
  try {
    const res  = await fetch(PRO_GAS_URL + '?action=getSheetData');
    const data = await res.json();
    if (!data.rows || data.rows.length === 0) {
      ['kpi-pro-total','kpi-pro-top','kpi-pro-items']
        .forEach(id => document.getElementById(id).textContent = '0');
      return;
    }

    const C    = buildProColMap(buildIdx(data.headers));
    const rows = data.rows;

    document.getElementById('kpi-pro-total').textContent = rows.length;

    // นับทุก checkbox
    const allItems = {
      'วางแผนตลาด':C.m1_plan, 'สร้างแบรนด์':C.m1_brand, 'บรรจุภัณฑ์':C.m1_pack,
      'ตลาดออนไลน์':C.m1_online, 'งานแสดงสินค้า':C.m1_expo, 'วิเคราะห์ตลาด':C.m1_analyze,
      'อัตลักษณ์สินค้า':C.m1_identity, 'ภูมิปัญญา':C.m1_local, 'เครือข่าย':C.m1_network,
      'AI Marketing':C.m1_ai, 'BCG Brand':C.m1_bcg, 'Big Data/AI':C.m1_bigdata,
      'ตลาดสีเขียว':C.m1_green, 'QR Code':C.m1_qr,
      'คุณภาพผลผลิต':C.m2_agri, 'แปรรูปเกษตร':C.m2_process, 'GAP/Organic':C.m2_gap,
      'มอก/ISO':C.m2_iso, 'อย/GMP/HACCP':C.m2_fda, 'สูตรผลิตภัณฑ์':C.m2_formula,
      'Lab Test':C.m2_lab, 'สุขอนามัย':C.m2_hygiene, 'ฉลากโภชนาการ':C.m2_label,
      'ความเสี่ยงสุขภาพ':C.m2_risk, 'OTOP':C.m2_otop, 'ออกแบบผลิตภัณฑ์':C.m2_design,
      'ต้นทุนผลิต':C.m3_cost, 'เทคโนเกษตร':C.m3_agtech, 'Lean/Productivity':C.m3_lean,
      'มาตรฐานโรงงาน':C.m3_std, 'เครื่องจักร':C.m3_machine, 'สิ่งแวดล้อม':C.m3_env,
      'อุตฯท้องถิ่น':C.m3_local, 'อุตฯ4.0':C.m3_ind40, 'เชื่อมโยงผลิต':C.m3_link,
      'รวมกลุ่มเกษตร':C.m4_farmer, 'พัฒนากลุ่ม':C.m4_group,
      'แหล่งเรียนรู้':C.m4_learn, 'ทักษะแรงงาน':C.m4_skill,
      'เครื่องหมายการค้า':C.m5_trademark, 'บัญชีครัวเรือน':C.m5_account,
      'แหล่งทุน':C.m5_fund, 'ภาษี/กฎหมาย':C.m5_tax, 'คำปรึกษา':C.m5_consult,
    };

    const itemCnt = {};
    rows.forEach(r => {
      Object.entries(allItems).forEach(([label, col]) => {
        if (r[col] === 'ใช่') itemCnt[label] = (itemCnt[label] || 0) + 1;
      });
    });

    const totalItems = Object.values(itemCnt).reduce((s, v) => s + v, 0);
    document.getElementById('kpi-pro-items').textContent = totalItems;

    const sorted = Object.entries(itemCnt).sort((a, b) => b[1] - a[1]);
    document.getElementById('kpi-pro-top').textContent = sorted[0] ? sorted[0][0] : '—';

    // Top 5
    renderBar('proTopChart', Object.fromEntries(sorted.slice(0, 5)), 5, '#6a1b9a');

    // สัดส่วนแต่ละหมวด
    const hmwdLabels = {
      'หมวด 1 การตลาด': [C.m1_plan,C.m1_brand,C.m1_pack,C.m1_online,C.m1_expo,C.m1_analyze,C.m1_identity,C.m1_local,C.m1_network,C.m1_ai,C.m1_bcg,C.m1_bigdata,C.m1_green,C.m1_qr],
      'หมวด 2 ผลิตภัณฑ์': [C.m2_agri,C.m2_process,C.m2_gap,C.m2_iso,C.m2_fda,C.m2_formula,C.m2_lab,C.m2_hygiene,C.m2_label,C.m2_risk,C.m2_otop,C.m2_design],
      'หมวด 3 การผลิต': [C.m3_cost,C.m3_agtech,C.m3_lean,C.m3_std,C.m3_machine,C.m3_env,C.m3_local,C.m3_ind40,C.m3_link],
      'หมวด 4 รวมกลุ่ม': [C.m4_farmer,C.m4_group,C.m4_learn,C.m4_skill],
      'หมวด 5 การบริหาร': [C.m5_trademark,C.m5_account,C.m5_fund,C.m5_tax,C.m5_consult],
    };

    const hmwdCnt = {};
    Object.entries(hmwdLabels).forEach(([label, cols]) => {
      hmwdCnt[label] = rows.reduce((sum, r) =>
        sum + cols.filter(col => r[col] === 'ใช่').length, 0);
    });
    renderBar('proHmwdChart', hmwdCnt, 5, '#1565c0');

  } catch(e) { /* silent */ }
}

// ── ประวัติการแก้ไข TIER ──────────────────────────
async function loadTierHistory() {
  const el = document.getElementById('tierHistoryTable');
  if (!el) return;
  try {
    const res  = await fetch(GAS_URL + '?action=getTierHistory');
    const data = await res.json();

    if (!data.rows || data.rows.length === 0) {
      el.innerHTML = '<div style="color:#90a4ae;font-size:13px">ยังไม่มีประวัติการเปลี่ยนแปลง TIER</div>';
      return;
    }

    const tierBadge = t => {
      const cls = t === 'TIER 1' ? '#f57c00' : t === 'TIER 2' ? '#1565c0' : t === 'TIER 3' ? '#6a1b9a' : '#90a4ae';
      return `<span style="background:${cls};color:#fff;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600">${t}</span>`;
    };

    el.innerHTML = `<div class="table-wrap"><table>
      <thead><tr>
        <th>#</th><th>ชื่อสถานประกอบการ</th>
        <th>TIER เดิม</th><th>TIER ใหม่</th><th>วันที่แก้ไข</th>
      </tr></thead>
      <tbody>
        ${data.rows.slice(0, 20).map(r => `<tr>
          <td>${r[0]}</td>
          <td><strong>${r[1]}</strong></td>
          <td>${tierBadge(r[2])}</td>
          <td>${tierBadge(r[3])}</td>
          <td style="font-size:12px;color:#546e7a">${r[4]}</td>
        </tr>`).join('')}
      </tbody>
    </table></div>`;
  } catch(e) { /* silent */ }
}

// ── Render horizontal bar chart ───────────────────
function renderBar(elId, countObj, topN, color) {
  const sorted = Object.entries(countObj).sort((a, b) => b[1] - a[1]).slice(0, topN);
  const max    = sorted[0] ? sorted[0][1] : 1;

  document.getElementById(elId).innerHTML = sorted.length === 0
    ? '<div style="color:#90a4ae;font-size:13px">ยังไม่มีข้อมูล</div>'
    : sorted.map(([label, val]) => `
        <div class="bar-row">
          <div class="bar-label">${label}</div>
          <div class="bar-track">
            <div class="bar-fill" style="width:${Math.round(val / max * 100)}%;background:${color}">
              <span class="bar-val">${val}</span>
            </div>
          </div>
        </div>`
    ).join('');
}