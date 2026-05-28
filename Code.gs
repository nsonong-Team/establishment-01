// ===== Google Apps Script - Code.gs ข้อมูลผู้ประกอบการ =====

const SHEET_ID = '1KyRKhQlip6sPPEIaEVL0-F_GVGlxH-N2vWeqIXPXwFA';

function doGet(e) {
  if (e && e.parameter && e.parameter.action === 'getSheetData') {
    return respond(getSheetData());
  }
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('ฐานข้อมูลผู้ประกอบการฯ')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  if (data.action === 'submit')           return respond(submitData(data));
  if (data.action === 'update')           return respond(updateRow(data));
  if (data.action === 'updateTierByName') return respond(updateTierByName(data.bizName, data.tier));
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
    let sheet = ss.getSheetByName('ข้อมูลผู้ประกอบการ');

    if (!sheet) {
      sheet = ss.insertSheet('ข้อมูลผู้ประกอบการ');
      const headers = [
        'ลำดับที่',
        'ชื่อผู้ใส่ข้อมูล',
        'ตำแหน่ง',
        'หน่วยงาน',
        'ชื่อสถานประกอบการ',
        'ที่ตั้งสถานประกอบการ',
        'หมายเลขโทรศัพท์',
        'จำนวนสมาชิก',
        'กำลังการผลิต',
        'รายได้เฉลี่ย',
        'ประเภท_OTOP',
        'ประเภท_SMEs',
        'ประเภท_วิสาหกิจชุมชน',
        'ประเภท_StartUp',
        'ประเภท_บริษัทฯ',
        'ประเภท_อื่นๆ',
        'ชื่อแบรนด์',
        'สินค้า_อาหาร',
        'สินค้า_ผ้า',
        'สินค้า_ของใช้',
        'สินค้า_สมุนไพร',
        'สินค้า_เกษตร',
        'สินค้า_อื่นๆ',
        'มาตรฐาน_OTOP3_5',
        'มาตรฐาน_มผช',
        'มาตรฐาน_อย',
        'มาตรฐาน_GAP',
        'มาตรฐาน_GMP',
        'มาตรฐาน_NBLBrand',
        'มาตรฐาน_อื่นๆ',
        'ระดับ TIER',
        'หมายเหตุ',
        'วันที่บันทึก'
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
      formData.ชื่อผู้ใส่ข้อมูล || '',
      formData.ตำแหน่ง           || '',
      formData.หน่วยงาน          || '',
      formData.ชื่อสถานประกอบการ || '',
      formData.ที่ตั้ง            || '',
      formData.โทรศัพท์           || '',
      formData.จำนวนสมาชิก       || '',
      formData.กำลังการผลิต      || '',
      formData.รายได้เฉลี่ย      || '',
      yes(formData.ประเภท_OTOP),
      yes(formData.ประเภท_SMEs),
      yes(formData.ประเภท_วิสาหกิจชุมชน),
      yes(formData.ประเภท_StartUp),
      yes(formData.ประเภท_บริษัทฯ),
      formData.ประเภท_อื่นๆ      || '',
      formData.ชื่อแบรนด์         || '',
      yes(formData.สินค้า_อาหาร),
      yes(formData.สินค้า_ผ้า),
      yes(formData.สินค้า_ของใช้),
      yes(formData.สินค้า_สมุนไพร),
      yes(formData.สินค้า_เกษตร),
      formData.สินค้า_อื่นๆ      || '',
      yes(formData.มาตรฐาน_OTOP3_5),
      yes(formData.มาตรฐาน_มผช),
      yes(formData.มาตรฐาน_อย),
      yes(formData.มาตรฐาน_GAP),
      yes(formData.มาตรฐาน_GMP),
      yes(formData.มาตรฐาน_NBLBrand),
      formData.มาตรฐาน_อื่นๆ    || '',
      formData.tier              || '',
      formData.หมายเหตุ          || '',
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
    const sheet = ss.getSheetByName('ข้อมูลผู้ประกอบการ');
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
    const sheet = ss.getSheetByName('ข้อมูลผู้ประกอบการ');
    if (!sheet) return { success: false, error: 'ไม่พบ Sheet' };

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const rowNum  = parseInt(updateData.rowNum);
    const noCol   = headers.indexOf('ลำดับที่') + 1;
    const allNos  = sheet.getRange(2, noCol, sheet.getLastRow() - 1, 1).getValues();
    const rowIdx  = allNos.findIndex(r => r[0] == rowNum);
    if (rowIdx === -1) return { success: false, error: 'ไม่พบแถวลำดับที่ ' + rowNum };
    const targetRow = rowIdx + 2;

    const yes = v => v ? 'ใช่' : 'ไม่';

    const map = {
      'ชื่อผู้ใส่ข้อมูล':     updateData.ชื่อผู้ใส่ข้อมูล || '',
      'ตำแหน่ง':              updateData.ตำแหน่ง          || '',
      'หน่วยงาน':             updateData.หน่วยงาน         || '',
      'ชื่อสถานประกอบการ':    updateData.ชื่อสถานประกอบการ || '',
      'ที่ตั้งสถานประกอบการ':  updateData.ที่ตั้ง           || '',
      'หมายเลขโทรศัพท์':      updateData.โทรศัพท์          || '',
      'จำนวนสมาชิก':          updateData.จำนวนสมาชิก      || '',
      'กำลังการผลิต':         updateData.กำลังการผลิต     || '',
      'รายได้เฉลี่ย':         updateData.รายได้เฉลี่ย     || '',
      'ประเภท_OTOP':          yes(updateData.ประเภท_OTOP),
      'ประเภท_SMEs':          yes(updateData.ประเภท_SMEs),
      'ประเภท_วิสาหกิจชุมชน': yes(updateData.ประเภท_วิสาหกิจชุมชน),
      'ประเภท_StartUp':       yes(updateData.ประเภท_StartUp),
      'ประเภท_บริษัทฯ':       yes(updateData.ประเภท_บริษัทฯ),
      'ประเภท_อื่นๆ':         updateData.ประเภท_อื่นๆ     || '',
      'ชื่อแบรนด์':           updateData.ชื่อแบรนด์        || '',
      'สินค้า_อาหาร':         yes(updateData.สินค้า_อาหาร),
      'สินค้า_ผ้า':            yes(updateData.สินค้า_ผ้า),
      'สินค้า_ของใช้':         yes(updateData.สินค้า_ของใช้),
      'สินค้า_สมุนไพร':        yes(updateData.สินค้า_สมุนไพร),
      'สินค้า_เกษตร':          yes(updateData.สินค้า_เกษตร),
      'สินค้า_อื่นๆ':          updateData.สินค้า_อื่นๆ     || '',
      'มาตรฐาน_OTOP3_5':      yes(updateData.มาตรฐาน_OTOP3_5),
      'มาตรฐาน_มผช':          yes(updateData.มาตรฐาน_มผช),
      'มาตรฐาน_อย':           yes(updateData.มาตรฐาน_อย),
      'มาตรฐาน_GAP':          yes(updateData.มาตรฐาน_GAP),
      'มาตรฐาน_GMP':          yes(updateData.มาตรฐาน_GMP),
      'มาตรฐาน_NBLBrand':     yes(updateData.มาตรฐาน_NBLBrand),
      'มาตรฐาน_อื่นๆ':        updateData.มาตรฐาน_อื่นๆ    || '',
      'ระดับ TIER':           updateData.tier              || '',
      'หมายเหตุ':             updateData.หมายเหตุ          || '',
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

function updateTierByName(bizName, tier) {
  try {
    const ss    = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('ข้อมูลผู้ประกอบการ');
    if (!sheet || sheet.getLastRow() <= 1) return { success: false, error: 'ไม่พบ Sheet' };

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const tierCol = headers.indexOf('ระดับ TIER') + 1;
    const nameCol = headers.indexOf('ชื่อสถานประกอบการ') + 1;
    if (tierCol === 0) return { success: false, error: 'ไม่พบคอลัมน์ระดับ TIER' };

    const data   = sheet.getRange(2, nameCol, sheet.getLastRow() - 1, 1).getValues();
    const rowIdx = data.findIndex(r => r[0] === bizName);
    if (rowIdx === -1) return { success: false, error: 'ไม่พบชื่อ: ' + bizName };

    sheet.getRange(rowIdx + 2, tierCol).setValue(tier);
    return { success: true };
  } catch(e) {
    return { success: false, error: e.message };
  }
}