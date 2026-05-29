// ===== Google Apps Script - Code.gs (การส่งเสริม/พัฒนา) =====

const SHEET_ID = '14LxnFTIijRDfbrNasSey0X7U0ywVpJKuPrTJsZH2RuA';

function doGet(e) {
  if (e && e.parameter && e.parameter.action === 'getSheetData') {
    return respond(getSheetData());
  }
  return ContentService.createTextOutput('OK');
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  if (data.action === 'submit') return respond(submitData(data));
  if (data.action === 'update') return respond(updateRow(data));
  if (data.action === 'delete') return respond(deleteRow(data.rowNum));
  return respond({ success: false, error: 'unknown action' });
}

function respond(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function submitData(formData) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName('การส่งเสริมพัฒนา');

    if (!sheet) {
      sheet = ss.insertSheet('การส่งเสริมพัฒนา');
      const headers = [
        'ลำดับที่', 'ชื่อผู้ใส่ข้อมูล', 'ตำแหน่ง', 'หน่วยงาน', 'ชื่อสถานประกอบการ',
        'หมวด1_การวางแผนกลยุทธ์การตลาด', 'หมวด1_การสร้างแบรนด์', 'หมวด1_การออกแบบบรรจุภัณฑ์',
        'หมวด1_การเจาะตลาดออนไลน์', 'หมวด1_การเข้าร่วมงานแสดงสินค้า', 'หมวด1_การวิเคราะห์ตลาด',
        'หมวด1_การสร้างอัตลักษณ์สินค้า', 'หมวด1_การส่งเสริมภูมิปัญญาท้องถิ่น',
        'หมวด1_การสร้างเครือข่ายธุรกิจ', 'หมวด1_การตลาดออนไลน์เชิงAI',
        'หมวด1_การสร้างแบรนด์ยั่งยืนBCG', 'หมวด1_BigData_AI',
        'หมวด1_การตลาดสีเขียว', 'หมวด1_การตลาดQRCode', 'หมวด1_อื่นๆ',
        'หมวด2_การพัฒนาคุณภาพผลผลิต', 'หมวด2_การแปรรูปสินค้าเกษตร',
        'หมวด2_GAP_Organic', 'หมวด2_มอก_ISO', 'หมวด2_อย_GMP_HACCP',
        'หมวด2_การพัฒนาสูตรผลิตภัณฑ์', 'หมวด2_LabTest', 'หมวด2_สุขอนามัยการผลิต',
        'หมวด2_ฉลากโภชนาการ', 'หมวด2_ความเสี่ยงสุขภาพ', 'หมวด2_OTOP',
        'หมวด2_ออกแบบผลิตภัณฑ์เชิงอุตสาหกรรม', 'หมวด2_อื่นๆ',
        'หมวด3_ต้นทุนการผลิต', 'หมวด3_เทคโนโลยีเกษตรสมัยใหม่',
        'หมวด3_Lean_Productivity', 'หมวด3_มาตรฐานโรงงาน',
        'หมวด3_เครื่องจักรและเทคโนโลยี', 'หมวด3_สิ่งแวดล้อมโรงงาน',
        'หมวด3_อุตสาหกรรมท้องถิ่น', 'หมวด3_อุตสาหกรรม4_0',
        'หมวด3_เชื่อมโยงการผลิตขนาดใหญ่', 'หมวด3_อื่นๆ',
        'หมวด4_รวมกลุ่มเกษตรกร', 'หมวด4_รวมกลุ่มพัฒนาศักยภาพ',
        'หมวด4_แหล่งเรียนรู้ชุมชน', 'หมวด4_พัฒนาทักษะแรงงาน', 'หมวด4_อื่นๆ',
        'หมวด5_จดทะเบียนเครื่องหมายการค้า', 'หมวด5_บัญชีครัวเรือน',
        'หมวด5_แหล่งทุน_สินเชื่อ', 'หมวด5_ภาษี_บัญชี_กฎหมาย',
        'หมวด5_คำปรึกษาการบริหาร', 'หมวด5_อื่นๆ',
        'หมายเหตุ', 'วันที่บันทึก'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length)
        .setBackground('#0d47a1').setFontColor('#ffffff').setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    const lastRow = sheet.getLastRow();
    const nextRow = lastRow + 1;
    const rowNum  = lastRow;
    const yes = v => v ? 'ใช่' : 'ไม่';

    const rowData = [
      rowNum,
      formData.ชื่อผู้ใส่ข้อมูล  || '',
      formData.ตำแหน่ง            || '',
      formData.หน่วยงาน           || '',
      formData.ชื่อสถานประกอบการ  || '',
      yes(formData.หมวด1_การวางแผนกลยุทธ์การตลาด),
      yes(formData.หมวด1_การสร้างแบรนด์),
      yes(formData.หมวด1_การออกแบบบรรจุภัณฑ์),
      yes(formData.หมวด1_การเจาะตลาดออนไลน์),
      yes(formData.หมวด1_การเข้าร่วมงานแสดงสินค้า),
      yes(formData.หมวด1_การวิเคราะห์ตลาด),
      yes(formData.หมวด1_การสร้างอัตลักษณ์สินค้า),
      yes(formData.หมวด1_การส่งเสริมภูมิปัญญาท้องถิ่น),
      yes(formData.หมวด1_การสร้างเครือข่ายธุรกิจ),
      yes(formData.หมวด1_การตลาดออนไลน์เชิงAI),
      yes(formData.หมวด1_การสร้างแบรนด์ยั่งยืนBCG),
      yes(formData.หมวด1_BigData_AI),
      yes(formData.หมวด1_การตลาดสีเขียว),
      yes(formData.หมวด1_การตลาดQRCode),
      formData.หมวด1_อื่นๆ || '',
      yes(formData.หมวด2_การพัฒนาคุณภาพผลผลิต),
      yes(formData.หมวด2_การแปรรูปสินค้าเกษตร),
      yes(formData.หมวด2_GAP_Organic),
      yes(formData.หมวด2_มอก_ISO),
      yes(formData.หมวด2_อย_GMP_HACCP),
      yes(formData.หมวด2_การพัฒนาสูตรผลิตภัณฑ์),
      yes(formData.หมวด2_LabTest),
      yes(formData.หมวด2_สุขอนามัยการผลิต),
      yes(formData.หมวด2_ฉลากโภชนาการ),
      yes(formData.หมวด2_ความเสี่ยงสุขภาพ),
      yes(formData.หมวด2_OTOP),
      yes(formData.หมวด2_ออกแบบผลิตภัณฑ์เชิงอุตสาหกรรม),
      formData.หมวด2_อื่นๆ || '',
      yes(formData.หมวด3_ต้นทุนการผลิต),
      yes(formData.หมวด3_เทคโนโลยีเกษตรสมัยใหม่),
      yes(formData.หมวด3_Lean_Productivity),
      yes(formData.หมวด3_มาตรฐานโรงงาน),
      yes(formData.หมวด3_เครื่องจักรและเทคโนโลยี),
      yes(formData.หมวด3_สิ่งแวดล้อมโรงงาน),
      yes(formData.หมวด3_อุตสาหกรรมท้องถิ่น),
      yes(formData.หมวด3_อุตสาหกรรม4_0),
      yes(formData.หมวด3_เชื่อมโยงการผลิตขนาดใหญ่),
      formData.หมวด3_อื่นๆ || '',
      yes(formData.หมวด4_รวมกลุ่มเกษตรกร),
      yes(formData.หมวด4_รวมกลุ่มพัฒนาศักยภาพ),
      yes(formData.หมวด4_แหล่งเรียนรู้ชุมชน),
      yes(formData.หมวด4_พัฒนาทักษะแรงงาน),
      formData.หมวด4_อื่นๆ || '',
      yes(formData.หมวด5_จดทะเบียนเครื่องหมายการค้า),
      yes(formData.หมวด5_บัญชีครัวเรือน),
      yes(formData.หมวด5_แหล่งทุน_สินเชื่อ),
      yes(formData.หมวด5_ภาษี_บัญชี_กฎหมาย),
      yes(formData.หมวด5_คำปรึกษาการบริหาร),
      formData.หมวด5_อื่นๆ || '',
      formData.หมายเหตุ    || '',
      new Date().toLocaleString('th-TH', {
        year:'numeric', month:'long', day:'numeric',
        hour:'2-digit', minute:'2-digit'
      })
    ];

    sheet.getRange(nextRow, 1, 1, rowData.length).setValues([rowData]);
    if (nextRow % 2 === 0) {
      sheet.getRange(nextRow, 1, 1, rowData.length).setBackground('#eaf2fb');
    }

    return { success: true, row: rowNum };
  } catch(e) {
    return { success: false, error: e.message };
  }
}

function getSheetData() {
  try {
    const ss    = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('การส่งเสริมพัฒนา');
    if (!sheet || sheet.getLastRow() <= 1) return { headers: [], rows: [] };

    const all     = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
    const headers = all[0];
    const rows    = all.slice(1);

    return { headers, rows };
  } catch(e) {
    return { headers: [], rows: [] };
  }
}

function updateRow(updateData) {
  try {
    const ss    = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('การส่งเสริมพัฒนา');
    if (!sheet) return { success: false, error: 'ไม่พบ Sheet' };

    const headers   = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const rowNum    = parseInt(updateData.rowNum);
    const noCol     = headers.indexOf('ลำดับที่') + 1;
    const allNos    = sheet.getRange(2, noCol, sheet.getLastRow() - 1, 1).getValues();
    const rowIdx    = allNos.findIndex(r => r[0] == rowNum);
    if (rowIdx === -1) return { success: false, error: 'ไม่พบแถวลำดับที่ ' + rowNum };
    const targetRow = rowIdx + 2;

    const yes = v => v ? 'ใช่' : 'ไม่';

    const map = {
      'ชื่อผู้ใส่ข้อมูล':  updateData.ชื่อผู้ใส่ข้อมูล || '',
      'ตำแหน่ง':           updateData.ตำแหน่ง          || '',
      'หน่วยงาน':          updateData.หน่วยงาน         || '',
      'ชื่อสถานประกอบการ': updateData.ชื่อสถานประกอบการ || '',
      'หมวด1_การวางแผนกลยุทธ์การตลาด':      yes(updateData.หมวด1_การวางแผนกลยุทธ์การตลาด),
      'หมวด1_การสร้างแบรนด์':                yes(updateData.หมวด1_การสร้างแบรนด์),
      'หมวด1_การออกแบบบรรจุภัณฑ์':          yes(updateData.หมวด1_การออกแบบบรรจุภัณฑ์),
      'หมวด1_การเจาะตลาดออนไลน์':           yes(updateData.หมวด1_การเจาะตลาดออนไลน์),
      'หมวด1_การเข้าร่วมงานแสดงสินค้า':     yes(updateData.หมวด1_การเข้าร่วมงานแสดงสินค้า),
      'หมวด1_การวิเคราะห์ตลาด':             yes(updateData.หมวด1_การวิเคราะห์ตลาด),
      'หมวด1_การสร้างอัตลักษณ์สินค้า':      yes(updateData.หมวด1_การสร้างอัตลักษณ์สินค้า),
      'หมวด1_การส่งเสริมภูมิปัญญาท้องถิ่น': yes(updateData.หมวด1_การส่งเสริมภูมิปัญญาท้องถิ่น),
      'หมวด1_การสร้างเครือข่ายธุรกิจ':      yes(updateData.หมวด1_การสร้างเครือข่ายธุรกิจ),
      'หมวด1_การตลาดออนไลน์เชิงAI':         yes(updateData.หมวด1_การตลาดออนไลน์เชิงAI),
      'หมวด1_การสร้างแบรนด์ยั่งยืนBCG':     yes(updateData.หมวด1_การสร้างแบรนด์ยั่งยืนBCG),
      'หมวด1_BigData_AI':                    yes(updateData.หมวด1_BigData_AI),
      'หมวด1_การตลาดสีเขียว':               yes(updateData.หมวด1_การตลาดสีเขียว),
      'หมวด1_การตลาดQRCode':                yes(updateData.หมวด1_การตลาดQRCode),
      'หมวด1_อื่นๆ':                        updateData.หมวด1_อื่นๆ || '',
      'หมวด2_การพัฒนาคุณภาพผลผลิต':           yes(updateData.หมวด2_การพัฒนาคุณภาพผลผลิต),
      'หมวด2_การแปรรูปสินค้าเกษตร':            yes(updateData.หมวด2_การแปรรูปสินค้าเกษตร),
      'หมวด2_GAP_Organic':                     yes(updateData.หมวด2_GAP_Organic),
      'หมวด2_มอก_ISO':                         yes(updateData.หมวด2_มอก_ISO),
      'หมวด2_อย_GMP_HACCP':                    yes(updateData.หมวด2_อย_GMP_HACCP),
      'หมวด2_การพัฒนาสูตรผลิตภัณฑ์':          yes(updateData.หมวด2_การพัฒนาสูตรผลิตภัณฑ์),
      'หมวด2_LabTest':                         yes(updateData.หมวด2_LabTest),
      'หมวด2_สุขอนามัยการผลิต':               yes(updateData.หมวด2_สุขอนามัยการผลิต),
      'หมวด2_ฉลากโภชนาการ':                   yes(updateData.หมวด2_ฉลากโภชนาการ),
      'หมวด2_ความเสี่ยงสุขภาพ':               yes(updateData.หมวด2_ความเสี่ยงสุขภาพ),
      'หมวด2_OTOP':                            yes(updateData.หมวด2_OTOP),
      'หมวด2_ออกแบบผลิตภัณฑ์เชิงอุตสาหกรรม': yes(updateData.หมวด2_ออกแบบผลิตภัณฑ์เชิงอุตสาหกรรม),
      'หมวด2_อื่นๆ':                           updateData.หมวด2_อื่นๆ || '',
      'หมวด3_ต้นทุนการผลิต':              yes(updateData.หมวด3_ต้นทุนการผลิต),
      'หมวด3_เทคโนโลยีเกษตรสมัยใหม่':    yes(updateData.หมวด3_เทคโนโลยีเกษตรสมัยใหม่),
      'หมวด3_Lean_Productivity':           yes(updateData.หมวด3_Lean_Productivity),
      'หมวด3_มาตรฐานโรงงาน':              yes(updateData.หมวด3_มาตรฐานโรงงาน),
      'หมวด3_เครื่องจักรและเทคโนโลยี':    yes(updateData.หมวด3_เครื่องจักรและเทคโนโลยี),
      'หมวด3_สิ่งแวดล้อมโรงงาน':          yes(updateData.หมวด3_สิ่งแวดล้อมโรงงาน),
      'หมวด3_อุตสาหกรรมท้องถิ่น':         yes(updateData.หมวด3_อุตสาหกรรมท้องถิ่น),
      'หมวด3_อุตสาหกรรม4_0':              yes(updateData.หมวด3_อุตสาหกรรม4_0),
      'หมวด3_เชื่อมโยงการผลิตขนาดใหญ่':  yes(updateData.หมวด3_เชื่อมโยงการผลิตขนาดใหญ่),
      'หมวด3_อื่นๆ':                       updateData.หมวด3_อื่นๆ || '',
      'หมวด4_รวมกลุ่มเกษตรกร':       yes(updateData.หมวด4_รวมกลุ่มเกษตรกร),
      'หมวด4_รวมกลุ่มพัฒนาศักยภาพ':  yes(updateData.หมวด4_รวมกลุ่มพัฒนาศักยภาพ),
      'หมวด4_แหล่งเรียนรู้ชุมชน':    yes(updateData.หมวด4_แหล่งเรียนรู้ชุมชน),
      'หมวด4_พัฒนาทักษะแรงงาน':      yes(updateData.หมวด4_พัฒนาทักษะแรงงาน),
      'หมวด4_อื่นๆ':                  updateData.หมวด4_อื่นๆ || '',
      'หมวด5_จดทะเบียนเครื่องหมายการค้า': yes(updateData.หมวด5_จดทะเบียนเครื่องหมายการค้า),
      'หมวด5_บัญชีครัวเรือน':             yes(updateData.หมวด5_บัญชีครัวเรือน),
      'หมวด5_แหล่งทุน_สินเชื่อ':          yes(updateData.หมวด5_แหล่งทุน_สินเชื่อ),
      'หมวด5_ภาษี_บัญชี_กฎหมาย':         yes(updateData.หมวด5_ภาษี_บัญชี_กฎหมาย),
      'หมวด5_คำปรึกษาการบริหาร':          yes(updateData.หมวด5_คำปรึกษาการบริหาร),
      'หมวด5_อื่นๆ':                       updateData.หมวด5_อื่นๆ || '',
      'หมายเหตุ': updateData.หมายเหตุ || '',
    };

    headers.forEach((h, i) => {
      if (map.hasOwnProperty(h)) {
        sheet.getRange(targetRow, i + 1).setValue(map[h]);
      }
    });

    return { success: true };
  } catch(e) {
    return { success: false, error: e.message };
  }
}


function deleteRow(rowNum) {
  try {
    const ss    = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('การส่งเสริมพัฒนา');
    if (!sheet) return { success: false, error: 'ไม่พบ Sheet' };

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const noCol   = headers.indexOf('ลำดับที่') + 1;
    const allNos  = sheet.getRange(2, noCol, sheet.getLastRow() - 1, 1).getValues();
    const rowIdx  = allNos.findIndex(r => r[0] == rowNum);
    if (rowIdx === -1) return { success: false, error: 'ไม่พบแถวลำดับที่ ' + rowNum };

    sheet.deleteRow(rowIdx + 2);

    // ── reorder ลำดับที่ใหม่ ──────────────────────
    const lastRow = sheet.getLastRow();
    if (lastRow >= 2) {
      for (let i = 2; i <= lastRow; i++) {
        sheet.getRange(i, noCol).setValue(i - 1);
      }
    }

    return { success: true };
  } catch(e) {
    return { success: false, error: e.message };
  }
}