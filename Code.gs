// ===== Google Apps Script - Code.gs =====

const SHEET_ID = '1t_3keXJ811fdvuvySiXwtSlxzudtBUX_10yqXoYQkJY';

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
      'ชื่อสถานประกอบการ',
      'ที่ตั้งสถานประกอบการ',
      'ประเภทสินค้า/บริการ',
      'ชื่อแบรนด์',
      'มาตรฐานสินค้าที่ได้รับ',
      'ระยะเวลาก่อตั้งกิจการ (ปี)',
      'ช่องทาง: ส่งออกต่างประเทศ',
      'ช่องทาง: ในประเทศ',
      'ช่องทาง: ออนไลน์',
      'ช่องทาง: ขายในพื้นที่/พื้นที่ใกล้เคียง',
      'ช่องทาง: อื่นๆ (ระบุ)',
      'อบรม_สัมมนา_เวลา',
      'อบรม_สัมมนา_สถานที่',
      'อบรม_สัมมนา_หัวข้อ',
      'อบรม_สัมมนา_หน่วยงาน',
      'ศึกษาดูงาน_เวลา',
      'ศึกษาดูงาน_สถานที่',
      'ศึกษาดูงาน_หัวข้อ',
      'ศึกษาดูงาน_ผลการดำเนินงาน',
      'ศึกษาดูงาน_หน่วยงาน',
      'จำหน่ายสินค้า_เวลา',
      'จำหน่ายสินค้า_สถานที่',
      'จำหน่ายสินค้า_ชื่องาน',
      'จำหน่ายสินค้า_หน่วยงาน',
      'จำหน่ายสินค้า_ภายในจังหวัด',
      'จำหน่ายสินค้า_ต่างจังหวัด',
      'จำหน่ายสินค้า_Trade',
      'จำหน่ายสินค้า_ต่างประเทศ',
      'ระดับ TIER',
      'หมายเหตุ',
      'ชื่อผู้ใส่ข้อมูล',
      'ตำแหน่ง',
      'หน่วยงาน',
      'วันที่บันทึก'
    ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length)
        .setBackground('#0d47a1').setFontColor('#ffffff').setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    const lastRow = sheet.getLastRow();
    const nextRow = lastRow + 1;
    const rowNum = lastRow;

    const rowData = [
      rowNum,
      formData.ชื่อผู้ใส่ข้อมูล        || '',   // ชื่อผู้ใส่ข้อมูล
      formData.ตำแหน่ง            || '',
      formData.หน่วยงาน   || '',
      formData.ชื่อสถานประกอบการ  || '',
      formData.ที่ตั้ง             || '',
      formData.ประเภทสินค้า        || '',
      formData.ชื่อแบรนด์          || '',
      formData.มาตรฐาน             || '',
      formData.ระยะเวลา            || '',
      formData.ส่งออก      ? 'ใช่' : 'ไม่',
      formData.ในประเทศ    ? 'ใช่' : 'ไม่',
      formData.ออนไลน์     ? 'ใช่' : 'ไม่',
      formData.ขายในพื้นที่ ? 'ใช่' : 'ไม่',
      formData.อื่นๆ               || '',
      formData.อบรม_เวลา           || '',
      formData.อบรม_สถานที่         || '',
      formData.อบรม_หัวข้อ          || '',
      formData.อบรม_หน่วยงาน       || '',
      formData.ดูงาน_เวลา          || '',
      formData.ดูงาน_สถานที่        || '',
      formData.ดูงาน_หัวข้อ         || '',
      formData.ดูงาน_ผล            || '',
      formData.ดูงาน_หน่วยงาน      || '',
      formData.จำหน่าย_เวลา        || '',
      formData.จำหน่าย_สถานที่     || '',
      formData.จำหน่าย_ชื่องาน     || '',
      formData.จำหน่าย_หน่วยงาน   || '',
      formData.จำหน่าย_ในจังหวัด   || '',
      formData.จำหน่าย_ต่างจังหวัด || '',
      formData.จำหน่าย_trade       || '',
      formData.จำหน่าย_ต่างประเทศ  || '',
      formData.tier                || '',
      formData.หมายเหตุ            || '',
      new Date().toLocaleString('th-TH', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' })
    ];

    sheet.getRange(nextRow, 1, 1, rowData.length).setValues([rowData]);
    if (nextRow % 2 === 0) {
      sheet.getRange(nextRow, 1, 1, rowData.length).setBackground('#eaf2fb');
    }
    sheet.autoResizeColumns(1, rowData.length);

    return { success: true, row: rowNum };
  } catch(e) {
    return { success: false, error: e.message };
  }
}

/**
 * ส่งข้อมูลกลับเป็น array of objects โดย map จาก header จริงใน Sheet
 * ทำให้ไม่ขึ้นกับตำแหน่ง column — แก้ปัญหา index เลื่อนเมื่อ Sheet เก่า
 */
function getSheetData() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('ข้อมูลผู้ประกอบการ');
    if (!sheet || sheet.getLastRow() <= 1) return { headers: [], rows: [] };

    const all = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
    const headers = all[0];
    const rows = all.slice(1);

    return { headers: headers, rows: rows };
  } catch(e) {
    return { headers: [], rows: [] };
  }
}

function updateRow(updateData) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('ข้อมูลผู้ประกอบการ');
    if (!sheet) return { success:false, error:'ไม่พบ Sheet' };

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const nameCol  = headers.indexOf('ชื่อสถานประกอบการ') + 1;
    const rowNum   = parseInt(updateData.rowNum);

    // หา row จาก ลำดับที่
    const noCol = headers.indexOf('ลำดับที่') + 1;
    const allNos = sheet.getRange(2, noCol, sheet.getLastRow()-1, 1).getValues();
    const rowIdx = allNos.findIndex(r => r[0] == rowNum);
    if(rowIdx === -1) return { success:false, error:'ไม่พบแถวลำดับที่ '+rowNum };
    const targetRow = rowIdx + 2;

    // map column → value
    const map = {
      // ── ข้อมูลทั่วไป ──────────────────────────────
      'ชื่อสถานประกอบการ':           updateData.ชื่อสถานประกอบการ,
      'ที่ตั้งสถานประกอบการ':         updateData.ที่ตั้ง,
      'ประเภทสินค้า/บริการ':          updateData.ประเภทสินค้า,
      'ชื่อแบรนด์':                   updateData.ชื่อแบรนด์,
      'มาตรฐานสินค้าที่ได้รับ':       updateData.มาตรฐาน,
      'ระยะเวลาก่อตั้งกิจการ (ปี)':   updateData.ระยะเวลา,

      // ── ช่องทางการตลาด ────────────────────────────
      'ช่องทาง: ส่งออกต่างประเทศ':           updateData.ส่งออก      ? 'ใช่' : 'ไม่',
      'ช่องทาง: ในประเทศ':                    updateData.ในประเทศ    ? 'ใช่' : 'ไม่',
      'ช่องทาง: ออนไลน์':                     updateData.ออนไลน์     ? 'ใช่' : 'ไม่',
      'ช่องทาง: ขายในพื้นที่/พื้นที่ใกล้เคียง': updateData.ขายในพื้นที่ ? 'ใช่' : 'ไม่',
      'ช่องทาง: อื่นๆ (ระบุ)':               updateData.อื่นๆ       || '',

      // ── อบรม / สัมมนา ─────────────────────────────
      'อบรม_สัมมนา_เวลา':      updateData.อบรม_เวลา     || '',
      'อบรม_สัมมนา_สถานที่':   updateData.อบรม_สถานที่  || '',
      'อบรม_สัมมนา_หัวข้อ':    updateData.อบรม_หัวข้อ   || '',
      'อบรม_สัมมนา_หน่วยงาน':  updateData.อบรม_หน่วยงาน || '',

      // ── ศึกษาดูงาน ────────────────────────────────
      'ศึกษาดูงาน_เวลา':            updateData.ดูงาน_เวลา    || '',
      'ศึกษาดูงาน_สถานที่':         updateData.ดูงาน_สถานที่  || '',
      'ศึกษาดูงาน_หัวข้อ':          updateData.ดูงาน_หัวข้อ   || '',
      'ศึกษาดูงาน_ผลการดำเนินงาน':  updateData.ดูงาน_ผล      || '',
      'ศึกษาดูงาน_หน่วยงาน':        updateData.ดูงาน_หน่วยงาน || '',

      // ── จำหน่ายสินค้า / ออกบูธ ───────────────────
      'จำหน่ายสินค้า_เวลา':          updateData.จำหน่าย_เวลา       || '',
      'จำหน่ายสินค้า_สถานที่':       updateData.จำหน่าย_สถานที่    || '',
      'จำหน่ายสินค้า_ชื่องาน':       updateData.จำหน่าย_ชื่องาน    || '',
      'จำหน่ายสินค้า_หน่วยงาน':     updateData.จำหน่าย_หน่วยงาน  || '',
      'จำหน่ายสินค้า_ภายในจังหวัด':  updateData.จำหน่าย_ในจังหวัด  || '',
      'จำหน่ายสินค้า_ต่างจังหวัด':   updateData.จำหน่าย_ต่างจังหวัด || '',
      'จำหน่ายสินค้า_Trade':         updateData.จำหน่าย_trade      || '',
      'จำหน่ายสินค้า_ต่างประเทศ':    updateData.จำหน่าย_ต่างประเทศ || '',

      // ── ประเมินและผู้บันทึก ───────────────────────
      'ระดับ TIER': updateData.tier,
      'หมายเหตุ':   updateData.หมายเหตุ,

      // ── ผู้ใส่ข้อมูล ──────────────────────────────
      'ชื่อผู้ใส่ข้อมูล': updateData.ชื่อผู้ใส่ข้อมูล    || '',
      'ตำแหน่ง':          updateData.ตำแหน่ง        || '',
      'หน่วยงาน':         updateData.หน่วยงาน || '',
    };

    headers.forEach((h, i) => {
      if(map.hasOwnProperty(h)) {
        sheet.getRange(targetRow, i+1).setValue(map[h]);
      }
    });

    return { success:true };
  } catch(e) {
    return { success:false, error:e.message };
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