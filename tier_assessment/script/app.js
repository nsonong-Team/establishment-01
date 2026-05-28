async function saveTier() {
  const name = getBizName();
  if (!name)    { showToast('⚠️ กรุณาเลือกหรือพิมพ์ชื่อสถานประกอบการ', true); return; }
  if (!curTier) { showToast('⚠️ กรุณาติ๊กรายการประเมินก่อน', true); return; }

  const tier = 'TIER ' + curTier;
  const btn  = document.getElementById('btnSave');
  btn.disabled = true; btn.textContent = '⏳ กำลังบันทึก...';

  try {
    const res    = await fetch(GAS_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'updateTierByName', bizName: name, tier })
    });
    const result = await res.json();
    btn.textContent = '💾 บันทึก TIER ลงระบบ'; btn.disabled = false;
    if (result && result.success) showToast('✅ บันทึก ' + tier + ' ให้ "' + name + '" สำเร็จแล้ว');
    else showToast('❌ ' + (result ? result.error : 'เกิดข้อผิดพลาด'), true);
  } catch (e) {
    btn.textContent = '💾 บันทึก TIER ลงระบบ'; btn.disabled = false;
    showToast('❌ ' + e.message, true);
  }
}

function showToast(msg, isErr) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className   = 'toast' + (isErr ? ' err' : '') + ' show';
  setTimeout(() => t.classList.remove('show'), 3500);
}

buildChecklist();
loadBizNames();
