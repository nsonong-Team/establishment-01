// ===== Google Apps Script - Code.gs (ผลการดำเนินงาน) =====

const SHEET_ID = '11Bv-TZvowajMWfVm2EushZGRgGFyQqofZl4TYgc_eUo';

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
    let sheet = ss.getSheetByName('ผลการดำเนินงาน');

    if (!sheet) {
      sheet = ss.insertSheet('ผลการดำเนินงาน');
      const headers = [
        'ลำดับที่',
        'ชื่อผู้ใส่ข้อมูล',
        'ตำแหน่ง',
        'หน่วยงาน',
        'ชื่อสถานประกอบการ',
        'อบรม_ช่วงเวลา',
        'อบรม_สถานที่',
        'อบรม_หัวข้อ',
        'อบรม_หน่วยงาน',
        'ดูงาน_ช่วงเวลา',
        'ดูงาน_สถานที่',
        'ดูงาน_หัวข้อ',
        'ดูงาน_หน่วยงาน',
        'ดูงาน_ผลการดำเนินงาน',
        'จำหน่าย_ช่วงเวลา',
        'จำหน่าย_สถานที่',
        'จำหน่าย_ชื่องาน',
        'จำหน่าย_หน่วยงาน',
        'จำหน่าย_ในจังหวัด',
        'จำหน่าย_มูลค่าในจังหวัด',
        'จำหน่าย_ต่างจังหวัด',
        'จำหน่าย_มูลค่าต่างจังหวัด',
        'จำหน่าย_ModernTrade',
        'จำหน่าย_มูลค่าModernTrade',
        'จำหน่าย_ต่างประเทศ',
        'จำหน่าย_มูลค่าต่างประเทศ',
        'จำหน่าย_อื่นๆ',
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
      formData.ชื่อผู้ใส่ข้อมูล       || '',
      formData.ตำแหน่ง                || '',
      formData.หน่วยงาน               || '',
      formData.ชื่อสถานประกอบการ     || '',
      formData.อบรม_ช่วงเวลา          || '',
      formData.อบรม_สถานที่           || '',
      formData.อบรม_หัวข้อ            || '',
      formData.อบรม_หน่วยงาน         || '',
      formData.ดูงาน_ช่วงเวลา         || '',
      formData.ดูงาน_สถานที่          || '',
      formData.ดูงาน_หัวข้อ           || '',
      formData.ดูงาน_หน่วยงาน        || '',
      formData.ดูงาน_ผลการดำเนินงาน  || '',
      formData.จำหน่าย_ช่วงเวลา       || '',
      formData.จำหน่าย_สถานที่        || '',
      formData.จำหน่าย_ชื่องาน        || '',
      formData.จำหน่าย_หน่วยงาน      || '',
      yes(formData.จำหน่าย_ในจังหวัด),
      formData.จำหน่าย_มูลค่าในจังหวัด   || '',
      yes(formData.จำหน่าย_ต่างจังหวัด),
      formData.จำหน่าย_มูลค่าต่างจังหวัด  || '',
      yes(formData.จำหน่าย_ModernTrade),
      formData.จำหน่าย_มูลค่าModernTrade  || '',
      yes(formData.จำหน่าย_ต่างประเทศ),
      formData.จำหน่าย_มูลค่าต่างประเทศ   || '',
      formData.จำหน่าย_อื่นๆ              || '',
      formData.หมายเหตุ                   || '',
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
    const sheet = ss.getSheetByName('ผลการดำเนินงาน');
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
    const sheet = ss.getSheetByName('ผลการดำเนินงาน');
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
      'ชื่อผู้ใส่ข้อมูล':      updateData.ชื่อผู้ใส่ข้อมูล      || '',
      'ตำแหน่ง':               updateData.ตำแหน่ง               || '',
      'หน่วยงาน':              updateData.หน่วยงาน              || '',
      'ชื่อสถานประกอบการ':     updateData.ชื่อสถานประกอบการ     || '',
      'อบรม_ช่วงเวลา':         updateData.อบรม_ช่วงเวลา         || '',
      'อบรม_สถานที่':          updateData.อบรม_สถานที่          || '',
      'อบรม_หัวข้อ':           updateData.อบรม_หัวข้อ           || '',
      'อบรม_หน่วยงาน':        updateData.อบรม_หน่วยงาน        || '',
      'ดูงาน_ช่วงเวลา':        updateData.ดูงาน_ช่วงเวลา        || '',
      'ดูงาน_สถานที่':         updateData.ดูงาน_สถานที่         || '',
      'ดูงาน_หัวข้อ':          updateData.ดูงาน_หัวข้อ          || '',
      'ดูงาน_หน่วยงาน':       updateData.ดูงาน_หน่วยงาน       || '',
      'ดูงาน_ผลการดำเนินงาน': updateData.ดูงาน_ผลการดำเนินงาน || '',
      'จำหน่าย_ช่วงเวลา':      updateData.จำหน่าย_ช่วงเวลา      || '',
      'จำหน่าย_สถานที่':       updateData.จำหน่าย_สถานที่       || '',
      'จำหน่าย_ชื่องาน':       updateData.จำหน่าย_ชื่องาน       || '',
      'จำหน่าย_หน่วยงาน':     updateData.จำหน่าย_หน่วยงาน     || '',
      'จำหน่าย_ในจังหวัด':     yes(updateData.จำหน่าย_ในจังหวัด),
      'จำหน่าย_มูลค่าในจังหวัด':   updateData.จำหน่าย_มูลค่าในจังหวัด   || '',
      'จำหน่าย_ต่างจังหวัด':   yes(updateData.จำหน่าย_ต่างจังหวัด),
      'จำหน่าย_มูลค่าต่างจังหวัด':  updateData.จำหน่าย_มูลค่าต่างจังหวัด  || '',
      'จำหน่าย_ModernTrade':   yes(updateData.จำหน่าย_ModernTrade),
      'จำหน่าย_มูลค่าModernTrade':  updateData.จำหน่าย_มูลค่าModernTrade  || '',
      'จำหน่าย_ต่างประเทศ':    yes(updateData.จำหน่าย_ต่างประเทศ),
      'จำหน่าย_มูลค่าต่างประเทศ':   updateData.จำหน่าย_มูลค่าต่างประเทศ   || '',
      'จำหน่าย_อื่นๆ':         updateData.จำหน่าย_อื่นๆ         || '',
      'หมายเหตุ':              updateData.หมายเหตุ              || '',
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