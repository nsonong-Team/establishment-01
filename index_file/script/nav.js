// ══════════════════════════════════════════════════
//  nav.js — Tab navigation
// ══════════════════════════════════════════════════

function showTab(tab) {
  ['dash', 'establishment', 'activity', 'promotion', 'overview'].forEach(t => {
    document.getElementById('tab-' + t).style.display = t === tab ? '' : 'none';
  });
  document.querySelectorAll('.tab-btn').forEach((b, i) => {
    b.classList.toggle('active',
      ['dash', 'establishment', 'activity', 'promotion', 'overview'][i] === tab
    );
  });
  if (tab === 'dash') loadDashboard();
  //if (tab === 'activity')  loadActivityData();
  // if (tab === 'overview')  loadOverviewData();
}

function showSubTab(prefix, tab) {
  ['form', 'view'].forEach(t => {
    document.getElementById('sub-' + prefix + '-' + t).style.display = t === tab ? '' : 'none';
  });

  const tabId = prefix === 'est' ? 'establishment'
              : prefix === 'act' ? 'activity'
              : 'promotion';
  document.querySelector(`#tab-${tabId} .sub-tab-bar`)
    .querySelectorAll('.sub-tab-btn').forEach((b, i) => {
      b.classList.toggle('active', ['form', 'view'][i] === tab);
    });

  if (prefix === 'est' && tab === 'view') loadTableData();
  if (prefix === 'act' && tab === 'view') loadActTableData(); // ← เพิ่ม
}