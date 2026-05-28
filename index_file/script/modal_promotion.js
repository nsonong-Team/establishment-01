// ══════════════════════════════════════════════════
//  modal_promotion.js — Edit modal for promotion
// ══════════════════════════════════════════════════

let proEditCheckStates = {};

// ── Open modal ─────────────────────────────────────
function openProEdit(btn, filteredIdx) {
  const r = proLastFiltered[filteredIdx];
  if (!r) return;

  const C = proColMap;

  document.getElementById('proEditRowNum').value = r[C.no]  || '';
  document.getElementById('pe-rep').value        = r[C.rep] || '';
  document.getElementById('pe-pos').value        = r[C.pos] || '';
  document.getElementById('pe-ag').value         = r[C.ag]  || '';
  document.getElementById('pe-biz').value        = r[C.biz] || '';

  // checkbox states
  proEditCheckStates = {};
  const checkMap = {
    'หมวด1_การวางแผนกลยุทธ์การตลาด':      C.m1_plan,
    'หมวด1_การสร้างแบรนด์':                C.m1_brand,
    'หมวด1_การออกแบบบรรจุภัณฑ์':          C.m1_pack,
    'หมวด1_การเจาะตลาดออนไลน์':           C.m1_online,
    'หมวด1_การเข้าร่วมงานแสดงสินค้า':     C.m1_expo,
    'หมวด1_การวิเคราะห์ตลาด':             C.m1_analyze,
    'หมวด1_การสร้างอัตลักษณ์สินค้า':      C.m1_identity,
    'หมวด1_การส่งเสริมภูมิปัญญาท้องถิ่น': C.m1_local,
    'หมวด1_การสร้างเครือข่ายธุรกิจ':      C.m1_network,
    'หมวด1_การตลาดออนไลน์เชิงAI':         C.m1_ai,
    'หมวด1_การสร้างแบรนด์ยั่งยืนBCG':     C.m1_bcg,
    'หมวด1_BigData_AI':                    C.m1_bigdata,
    'หมวด1_การตลาดสีเขียว':               C.m1_green,
    'หมวด1_การตลาดQRCode':                C.m1_qr,
    'หมวด2_การพัฒนาคุณภาพผลผลิต':           C.m2_agri,
    'หมวด2_การแปรรูปสินค้าเกษตร':            C.m2_process,
    'หมวด2_GAP_Organic':                     C.m2_gap,
    'หมวด2_มอก_ISO':                         C.m2_iso,
    'หมวด2_อย_GMP_HACCP':                    C.m2_fda,
    'หมวด2_การพัฒนาสูตรผลิตภัณฑ์':          C.m2_formula,
    'หมวด2_LabTest':                         C.m2_lab,
    'หมวด2_สุขอนามัยการผลิต':               C.m2_hygiene,
    'หมวด2_ฉลากโภชนาการ':                   C.m2_label,
    'หมวด2_ความเสี่ยงสุขภาพ':               C.m2_risk,
    'หมวด2_OTOP':                            C.m2_otop,
    'หมวด2_ออกแบบผลิตภัณฑ์เชิงอุตสาหกรรม': C.m2_design,
    'หมวด3_ต้นทุนการผลิต':              C.m3_cost,
    'หมวด3_เทคโนโลยีเกษตรสมัยใหม่':    C.m3_agtech,
    'หมวด3_Lean_Productivity':           C.m3_lean,
    'หมวด3_มาตรฐานโรงงาน':              C.m3_std,
    'หมวด3_เครื่องจักรและเทคโนโลยี':    C.m3_machine,
    'หมวด3_สิ่งแวดล้อมโรงงาน':          C.m3_env,
    'หมวด3_อุตสาหกรรมท้องถิ่น':         C.m3_local,
    'หมวด3_อุตสาหกรรม4_0':              C.m3_ind40,
    'หมวด3_เชื่อมโยงการผลิตขนาดใหญ่':  C.m3_link,
    'หมวด4_รวมกลุ่มเกษตรกร':       C.m4_farmer,
    'หมวด4_รวมกลุ่มพัฒนาศักยภาพ':  C.m4_group,
    'หมวด4_แหล่งเรียนรู้ชุมชน':    C.m4_learn,
    'หมวด4_พัฒนาทักษะแรงงาน':      C.m4_skill,
    'หมวด5_จดทะเบียนเครื่องหมายการค้า': C.m5_trademark,
    'หมวด5_บัญชีครัวเรือน':             C.m5_account,
    'หมวด5_แหล่งทุน_สินเชื่อ':          C.m5_fund,
    'หมวด5_ภาษี_บัญชี_กฎหมาย':         C.m5_tax,
    'หมวด5_คำปรึกษาการบริหาร':          C.m5_consult,
  };

  Object.entries(checkMap).forEach(([key, col]) => {
    proEditCheckStates[key] = r[col] === 'ใช่';
    const el = document.getElementById('pe-item-' + key);
    if (el) el.classList.toggle('checked', proEditCheckStates[key]);
  });

  // อื่นๆ
  document.getElementById('pe-หมวด1-อื่นๆ').value = r[C.m1_etc] || '';
  document.getElementById('pe-หมวด2-อื่นๆ').value = r[C.m2_etc] || '';
  document.getElementById('pe-หมวด3-อื่นๆ').value = r[C.m3_etc] || '';
  document.getElementById('pe-หมวด4-อื่นๆ').value = r[C.m4_etc] || '';
  document.getElementById('pe-หมวด5-อื่นๆ').value = r[C.m5_etc] || '';
  document.getElementById('pe-note').value          = r[C.note]  || '';
  document.getElementById('pe-date').value          = r[C.date]  || '';

  document.getElementById('proEditModal').style.display = 'flex';
}

// ── Toggle checkbox in modal ───────────────────────
function toggleProEditCheck(id) {
  proEditCheckStates[id] = !proEditCheckStates[id];
  document.getElementById('pe-item-' + id)
    .classList.toggle('checked', proEditCheckStates[id]);
}

// ── Close modal ────────────────────────────────────
function closeProModal(e) {
  if (e.target === document.getElementById('proEditModal'))
    document.getElementById('proEditModal').style.display = 'none';
}

// ── Save ───────────────────────────────────────────
async function saveProEdit() {
  const rowNum = document.getElementById('proEditRowNum').value;
  const btn    = document.getElementById('btnSaveProEdit');
  btn.disabled    = true;
  btn.textContent = '⏳ กำลังบันทึก...';

  const yes = id => proEditCheckStates[id] || false;

  const updateData = {
    action: 'update',
    rowNum,
    ชื่อผู้ใส่ข้อมูล:  document.getElementById('pe-rep').value.trim(),
    ตำแหน่ง:          document.getElementById('pe-pos').value.trim(),
    หน่วยงาน:         document.getElementById('pe-ag').value.trim(),
    ชื่อสถานประกอบการ: document.getElementById('pe-biz').value.trim(),
    หมวด1_การวางแผนกลยุทธ์การตลาด:      yes('หมวด1_การวางแผนกลยุทธ์การตลาด'),
    หมวด1_การสร้างแบรนด์:                yes('หมวด1_การสร้างแบรนด์'),
    หมวด1_การออกแบบบรรจุภัณฑ์:          yes('หมวด1_การออกแบบบรรจุภัณฑ์'),
    หมวด1_การเจาะตลาดออนไลน์:           yes('หมวด1_การเจาะตลาดออนไลน์'),
    หมวด1_การเข้าร่วมงานแสดงสินค้า:     yes('หมวด1_การเข้าร่วมงานแสดงสินค้า'),
    หมวด1_การวิเคราะห์ตลาด:             yes('หมวด1_การวิเคราะห์ตลาด'),
    หมวด1_การสร้างอัตลักษณ์สินค้า:      yes('หมวด1_การสร้างอัตลักษณ์สินค้า'),
    หมวด1_การส่งเสริมภูมิปัญญาท้องถิ่น: yes('หมวด1_การส่งเสริมภูมิปัญญาท้องถิ่น'),
    หมวด1_การสร้างเครือข่ายธุรกิจ:      yes('หมวด1_การสร้างเครือข่ายธุรกิจ'),
    หมวด1_การตลาดออนไลน์เชิงAI:         yes('หมวด1_การตลาดออนไลน์เชิงAI'),
    หมวด1_การสร้างแบรนด์ยั่งยืนBCG:     yes('หมวด1_การสร้างแบรนด์ยั่งยืนBCG'),
    หมวด1_BigData_AI:                    yes('หมวด1_BigData_AI'),
    หมวด1_การตลาดสีเขียว:               yes('หมวด1_การตลาดสีเขียว'),
    หมวด1_การตลาดQRCode:                yes('หมวด1_การตลาดQRCode'),
    หมวด1_อื่นๆ: document.getElementById('pe-หมวด1-อื่นๆ').value.trim(),
    หมวด2_การพัฒนาคุณภาพผลผลิต:           yes('หมวด2_การพัฒนาคุณภาพผลผลิต'),
    หมวด2_การแปรรูปสินค้าเกษตร:            yes('หมวด2_การแปรรูปสินค้าเกษตร'),
    หมวด2_GAP_Organic:                     yes('หมวด2_GAP_Organic'),
    หมวด2_มอก_ISO:                         yes('หมวด2_มอก_ISO'),
    หมวด2_อย_GMP_HACCP:                    yes('หมวด2_อย_GMP_HACCP'),
    หมวด2_การพัฒนาสูตรผลิตภัณฑ์:          yes('หมวด2_การพัฒนาสูตรผลิตภัณฑ์'),
    หมวด2_LabTest:                         yes('หมวด2_LabTest'),
    หมวด2_สุขอนามัยการผลิต:               yes('หมวด2_สุขอนามัยการผลิต'),
    หมวด2_ฉลากโภชนาการ:                   yes('หมวด2_ฉลากโภชนาการ'),
    หมวด2_ความเสี่ยงสุขภาพ:               yes('หมวด2_ความเสี่ยงสุขภาพ'),
    หมวด2_OTOP:                            yes('หมวด2_OTOP'),
    หมวด2_ออกแบบผลิตภัณฑ์เชิงอุตสาหกรรม: yes('หมวด2_ออกแบบผลิตภัณฑ์เชิงอุตสาหกรรม'),
    หมวด2_อื่นๆ: document.getElementById('pe-หมวด2-อื่นๆ').value.trim(),
    หมวด3_ต้นทุนการผลิต:              yes('หมวด3_ต้นทุนการผลิต'),
    หมวด3_เทคโนโลยีเกษตรสมัยใหม่:    yes('หมวด3_เทคโนโลยีเกษตรสมัยใหม่'),
    หมวด3_Lean_Productivity:           yes('หมวด3_Lean_Productivity'),
    หมวด3_มาตรฐานโรงงาน:              yes('หมวด3_มาตรฐานโรงงาน'),
    หมวด3_เครื่องจักรและเทคโนโลยี:    yes('หมวด3_เครื่องจักรและเทคโนโลยี'),
    หมวด3_สิ่งแวดล้อมโรงงาน:          yes('หมวด3_สิ่งแวดล้อมโรงงาน'),
    หมวด3_อุตสาหกรรมท้องถิ่น:         yes('หมวด3_อุตสาหกรรมท้องถิ่น'),
    หมวด3_อุตสาหกรรม4_0:              yes('หมวด3_อุตสาหกรรม4_0'),
    หมวด3_เชื่อมโยงการผลิตขนาดใหญ่:  yes('หมวด3_เชื่อมโยงการผลิตขนาดใหญ่'),
    หมวด3_อื่นๆ: document.getElementById('pe-หมวด3-อื่นๆ').value.trim(),
    หมวด4_รวมกลุ่มเกษตรกร:      yes('หมวด4_รวมกลุ่มเกษตรกร'),
    หมวด4_รวมกลุ่มพัฒนาศักยภาพ: yes('หมวด4_รวมกลุ่มพัฒนาศักยภาพ'),
    หมวด4_แหล่งเรียนรู้ชุมชน:   yes('หมวด4_แหล่งเรียนรู้ชุมชน'),
    หมวด4_พัฒนาทักษะแรงงาน:     yes('หมวด4_พัฒนาทักษะแรงงาน'),
    หมวด4_อื่นๆ: document.getElementById('pe-หมวด4-อื่นๆ').value.trim(),
    หมวด5_จดทะเบียนเครื่องหมายการค้า: yes('หมวด5_จดทะเบียนเครื่องหมายการค้า'),
    หมวด5_บัญชีครัวเรือน:             yes('หมวด5_บัญชีครัวเรือน'),
    หมวด5_แหล่งทุน_สินเชื่อ:          yes('หมวด5_แหล่งทุน_สินเชื่อ'),
    หมวด5_ภาษี_บัญชี_กฎหมาย:         yes('หมวด5_ภาษี_บัญชี_กฎหมาย'),
    หมวด5_คำปรึกษาการบริหาร:          yes('หมวด5_คำปรึกษาการบริหาร'),
    หมวด5_อื่นๆ: document.getElementById('pe-หมวด5-อื่นๆ').value.trim(),
    หมายเหตุ: document.getElementById('pe-note').value.trim(),
  };

  try {
    const res    = await fetch(PRO_GAS_URL, { method: 'POST', body: JSON.stringify(updateData) });
    const result = await res.json();
    btn.disabled    = false;
    btn.textContent = '💾 บันทึกการแก้ไข';
    if (result.success) {
      document.getElementById('proEditModal').style.display = 'none';
      showToast('✅ แก้ไขข้อมูลสำเร็จแล้ว');
      loadProTableData();
    } else {
      showToast('❌ ' + result.error, true);
    }
  } catch (e) {
    btn.disabled    = false;
    btn.textContent = '💾 บันทึกการแก้ไข';
    showToast('❌ ' + e.message, true);
  }
}