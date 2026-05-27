// ══════════════════════════════════════════════════
//  dashboard.js — KPI cards, donut chart, bar charts
// ══════════════════════════════════════════════════

async function loadDashboard() {
  try {
    const res  = await fetch(GAS_URL + '?action=getSheetData');
    const data = await res.json();

    const rows = data.rows;
    if (!rows || rows.length === 0) {
      ['kpi-total', 'kpi-tier1', 'kpi-tier2', 'kpi-tier3',
       'ch-export', 'ch-dom', 'ch-online', 'ch-local']
        .forEach(id => document.getElementById(id).textContent = '0');
      return;
    }

    const C     = getColMap(buildIdx(data.headers));
    const total = rows.length;
    const t1    = rows.filter(r => r[C.tier] === 'TIER 1').length;
    const t2    = rows.filter(r => r[C.tier] === 'TIER 2').length;
    const t3    = rows.filter(r => r[C.tier] === 'TIER 3').length;

    // ── KPI numbers ───────────────────────────────
    document.getElementById('kpi-total').textContent = total;
    document.getElementById('kpi-tier1').textContent = t1;
    document.getElementById('kpi-tier2').textContent = t2;
    document.getElementById('kpi-tier3').textContent = t3;

    // ── Donut chart (conic-gradient) ──────────────
    const tierData = [
      { label: 'TIER 1', val: t1,             color: '#f57c00' },
      { label: 'TIER 2', val: t2,             color: '#1565c0' },
      { label: 'TIER 3', val: t3,             color: '#6a1b9a' },
      { label: 'ไม่ระบุ', val: total-t1-t2-t3, color: '#cfd8dc' },
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

    // ── Channel counts ────────────────────────────
    document.getElementById('ch-export').textContent = rows.filter(r => r[C.exp]  === 'ใช่').length;
    document.getElementById('ch-dom').textContent    = rows.filter(r => r[C.dom]  === 'ใช่').length;
    document.getElementById('ch-online').textContent = rows.filter(r => r[C.onl]  === 'ใช่').length;
    document.getElementById('ch-local').textContent  = rows.filter(r => r[C.loc2] === 'ใช่').length;

    // ── Bar charts ────────────────────────────────
    const typeCnt = {};
    rows.forEach(r => {
      const k = r[C.type] || '(ไม่ระบุ)';
      typeCnt[k] = (typeCnt[k] || 0) + 1;
    });
    renderBar('typeChart', typeCnt, 8, '#1565c0');

    const agCnt = {};
    rows.forEach(r => {
      const k = r[C.ag] || '(ไม่ระบุ)';
      agCnt[k] = (agCnt[k] || 0) + 1;
    });
    renderBar('agencyChart', agCnt, 10, '#2e7d32');

  } catch (e) { /* silent fail on dashboard */ }
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
