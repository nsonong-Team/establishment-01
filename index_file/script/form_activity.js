// ══════════════════════════════════════════════════
//  form_activity.js — Activity form state & submit
// ══════════════════════════════════════════════════

const actCheckStates = {};

// ── Toggle checkbox ────────────────────────────────
function toggleActCheck(id) {
  actCheckStates[id] = !actCheckStates[id];
  document.getElementById('act-item-' + id)
    .classList.toggle('checked', actCheckStates[id]);
}

// ── Submit ─────────────────────────────────────────
async function handleSubmitAct() {
  const biz = getVal('act-biz');
  const rep = getVal('act-rep');
  const btn = document.getElementById('btnSubmitAct');
  const txt = document.getElementById('btnTextAct');
  if (!biz) { showToast('⚠️ กรุณากรอกชื่อสถานประกอบการ', true); return; }
  if (!rep) { showToast('⚠️ กรุณากรอกชื่อผู้ใส่ข้อมูล', true); return; }
  btn.disabled = true;
  txt.innerHTML = '<span class="loading"></span> กำลังบันทึก...';

  const formData = {
    action: 'submit',

    // ── ผู้ใส่ข้อมูล ──────────────────────────
    ชื่อผู้ใส่ข้อมูล: getVal('act-rep'),
    ตำแหน่ง:         getVal('act-pos'),
    หน่วยงาน:        getVal('act-ag'),
    ชื่อสถานประกอบการ: biz,

    // ── อบรม / สัมมนา ─────────────────────────
    อบรม_ช่วงเวลา:  getVal('act-tr-period'),
    อบรม_สถานที่:   getVal('act-tr-place'),
    อบรม_หัวข้อ:    getVal('act-tr-topic'),
    อบรม_หน่วยงาน: getVal('act-tr-org'),

    // ── ศึกษาดูงาน ────────────────────────────
    ดูงาน_ช่วงเวลา:        getVal('act-st-period'),
    ดูงาน_สถานที่:         getVal('act-st-place'),
    ดูงาน_หัวข้อ:          getVal('act-st-topic'),
    ดูงาน_หน่วยงาน:       getVal('act-st-org'),
    ดูงาน_ผลการดำเนินงาน: getVal('act-st-result'),

    // ── ช่องทางการจำหน่าย ─────────────────────
    จำหน่าย_ช่วงเวลา: getVal('act-sa-period'),
    จำหน่าย_สถานที่:  getVal('act-sa-place'),
    จำหน่าย_ชื่องาน:  getVal('act-sa-event'),
    จำหน่าย_หน่วยงาน: getVal('act-sa-org'),

    จำหน่าย_ในจังหวัด:        actCheckStates['ในจังหวัด']  || false,
    จำหน่าย_มูลค่าในจังหวัด:  getVal('act-sa-local-val'),
    จำหน่าย_ต่างจังหวัด:      actCheckStates['ต่างจังหวัด'] || false,
    จำหน่าย_มูลค่าต่างจังหวัด: getVal('act-sa-other-val'),
    จำหน่าย_ModernTrade:      actCheckStates['ModernTrade'] || false,
    จำหน่าย_มูลค่าModernTrade: getVal('act-sa-modern-val'),
    จำหน่าย_ต่างประเทศ:       actCheckStates['ต่างประเทศ']  || false,
    จำหน่าย_มูลค่าต่างประเทศ:  getVal('act-sa-export-val'),
    จำหน่าย_อื่นๆ:            getVal('act-sa-other-name'),

    // ── หมายเหตุ ──────────────────────────────
    หมายเหตุ: getVal('act-note'),
  };

  try {
    const res    = await fetch(ACT_GAS_URL, { method: 'POST', body: JSON.stringify(formData) });
    const result = await res.json();
    btn.disabled  = false;
    txt.innerHTML = '💾 บันทึกข้อมูล';
    if (result.success) {
      showToast('✅ บันทึกสำเร็จ! (ลำดับที่ ' + result.row + ')');
      resetActForm();
    } else {
      showToast('❌ ' + result.error, true);
    }
  } catch (e) {
    btn.disabled  = false;
    txt.innerHTML = '💾 บันทึกข้อมูล';
    showToast('❌ ' + e.message, true);
  }
}

// ── Reset ──────────────────────────────────────────
function resetActForm() {
  const fields = [
    'act-rep', 'act-pos', 'act-ag', 'act-biz',
    'act-tr-period', 'act-tr-place', 'act-tr-topic', 'act-tr-org',
    'act-st-period', 'act-st-place', 'act-st-topic', 'act-st-org', 'act-st-result',
    'act-sa-period', 'act-sa-place', 'act-sa-event', 'act-sa-org',
    'act-sa-local-val', 'act-sa-other-val', 'act-sa-modern-val',
    'act-sa-export-val', 'act-sa-other-name',
    'act-note',
  ];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  ['ในจังหวัด', 'ต่างจังหวัด', 'ModernTrade', 'ต่างประเทศ', 'อื่นๆ'].forEach(id => {
    actCheckStates[id] = false;
    const el = document.getElementById('act-item-' + id);
    if (el) el.classList.remove('checked');
  });
}

// ── Biz Name Autocomplete ──────────────────────────
function filterActBizName() {
  const q  = (getVal('act-biz') || '').toLowerCase();
  const dd = document.getElementById('actBizDropdown');

  if (!q || !allRows.length) { dd.style.display = 'none'; return; }

  const matches = allRows
    .map(r => r[colMap.name])
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i)
    .filter(name => name.toLowerCase().includes(q))
    .slice(0, 8);

  if (matches.length === 0) { dd.style.display = 'none'; return; }

  dd.innerHTML = matches.map(name => `
    <div onclick="selectActBizName('${name.replace(/'/g, "\\'")}')"
         style="padding:10px 14px;cursor:pointer;font-size:13.5px;
                border-bottom:1px solid #f0f0f0;transition:.15s"
         onmouseover="this.style.background='#f0f6ff'"
         onmouseout="this.style.background=''">
      ${name}
    </div>
  `).join('');
  dd.style.display = 'block';
}

function selectActBizName(name) {
  document.getElementById('act-biz').value = name;
  document.getElementById('actBizDropdown').style.display = 'none';
}

document.addEventListener('click', function(e) {
  const dd = document.getElementById('actBizDropdown');
  if (dd && !dd.contains(e.target) && e.target.id !== 'act-biz') {
    dd.style.display = 'none';
  }
});