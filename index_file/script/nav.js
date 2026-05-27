// ══════════════════════════════════════════════════
//  nav.js — Tab navigation
// ══════════════════════════════════════════════════

function showTab(tab) {
  ['dash', 'view', 'form'].forEach(t => {
    document.getElementById('tab-' + t).style.display = t === tab ? '' : 'none';
  });
  document.querySelectorAll('.tab-btn').forEach((b, i) => {
    b.classList.toggle('active', ['dash', 'view', 'form'][i] === tab);
  });
  if (tab === 'view') loadTableData();
  if (tab === 'dash') loadDashboard();
}
