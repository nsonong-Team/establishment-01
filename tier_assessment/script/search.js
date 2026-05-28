let allBizList    = [];
let selectedBizName = '';
let activeIdx     = -1;

function toggleManual() {
  const on = document.getElementById('chkManual').checked;
  document.getElementById('manualWrap').style.display       = on ? '' : 'none';
  document.getElementById('searchWrap').style.opacity       = on ? '0.4' : '1';
  document.getElementById('searchWrap').style.pointerEvents = on ? 'none' : 'auto';
}

function openDropdown() {
  if (document.getElementById('chkManual').checked) return;
  renderDropdown(allBizList);
  document.getElementById('bizDropdown').classList.add('open');
}

function filterBiz() {
  selectedBizName = '';
  document.getElementById('selectedBiz').style.display = 'none';
  const q        = document.getElementById('bizSearch').value.trim().toLowerCase();
  const filtered = q ? allBizList.filter(b => b.name.toLowerCase().includes(q)) : allBizList;
  renderDropdown(filtered, q);
  document.getElementById('bizDropdown').classList.add('open');
  activeIdx = -1;
}

function renderDropdown(list, q = '') {
  const dd = document.getElementById('bizDropdown');
  if (list.length === 0) {
    dd.innerHTML = '<div class="drop-empty">ไม่พบสถานประกอบการที่ค้นหา</div>';
    return;
  }
  dd.innerHTML = list.map((b, i) => {
    const name = q
      ? b.name.replace(new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>')
      : b.name;
    return '<div class="drop-item" data-name="' + b.name + '" data-idx="' + i + '" onmousedown="selectBiz(\'' + b.name.replace(/'/g, "\\'") + '\')">' + name + '</div>';
  }).join('');
}

function selectBiz(name) {
  selectedBizName = name;
  document.getElementById('bizSearch').value = '';
  document.getElementById('bizDropdown').classList.remove('open');
  document.getElementById('selectedName').textContent = name;
  document.getElementById('selectedBiz').style.display = 'flex';
}

function clearSelected() {
  selectedBizName = '';
  document.getElementById('selectedBiz').style.display = 'none';
  document.getElementById('bizSearch').value = '';
  document.getElementById('bizSearch').focus();
}

function getBizName() {
  if (document.getElementById('chkManual').checked)
    return document.getElementById('bizManual').value.trim();
  return selectedBizName;
}

document.addEventListener('click', function (e) {
  if (!document.getElementById('searchWrap').contains(e.target))
    document.getElementById('bizDropdown').classList.remove('open');
});

document.addEventListener('keydown', function (e) {
  const dd    = document.getElementById('bizDropdown');
  if (!dd.classList.contains('open')) return;
  const items = dd.querySelectorAll('.drop-item');
  if      (e.key === 'ArrowDown')  { e.preventDefault(); activeIdx = Math.min(activeIdx + 1, items.length - 1); }
  else if (e.key === 'ArrowUp')    { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); }
  else if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); selectBiz(items[activeIdx].dataset.name); return; }
  else if (e.key === 'Escape')     { dd.classList.remove('open'); return; }
  items.forEach((el, i) => el.classList.toggle('active', i === activeIdx));
  if (activeIdx >= 0) items[activeIdx].scrollIntoView({ block: 'nearest' });
});

async function loadBizNames() {
  document.getElementById('bizSearch').placeholder = '⏳ กำลังโหลดรายชื่อจากระบบหลัก...';
  try {
    const res  = await fetch(GAS_URL + '?action=getSheetData');
    const data = await res.json();
    document.getElementById('bizSearch').placeholder = '🔍 พิมพ์เพื่อค้นหาสถานประกอบการ...';
    if (!data.rows || data.rows.length === 0) {
      document.getElementById('bizSearch').placeholder = '— ไม่พบข้อมูลในระบบ —';
      document.getElementById('chkManual').checked = true; toggleManual(); return;
    }
    allBizList = data.rows.map((r, i) => ({ row: i + 2, name: r[4] })).filter(r => r.name);
  } catch (e) {
    document.getElementById('bizSearch').placeholder = '— โหลดไม่สำเร็จ ลองพิมพ์เองด้านล่าง —';
    document.getElementById('chkManual').checked = true; toggleManual();
  }
}
