// ══════════════════════════════════════════════════
//  state.js — Global state & shared utilities
// ══════════════════════════════════════════════════

// ── Shared State ──────────────────────────────────
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxlU1mKWVby6F8RPbsZTlhacisIVMvs-D4TAW_m6l3hbhlC8x7NPUJOGCJLpHxCShkz/exec';

let allRows          = [];
let colMap           = {};
let lastFiltered     = [];
let currentFilteredIdx = null;

// ── Utility: get trimmed input value ──────────────
function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

// ── Utility: show toast notification ──────────────
function showToast(msg, isError) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast' + (isError ? ' error' : '') + ' show';
  setTimeout(() => t.classList.remove('show'), 3500);
}

// ── Utility: build header → column-index map ──────
function buildIdx(headers) {
  const m = {};
  headers.forEach((h, i) => m[h] = i);
  return m;
}

// ── Utility: map column names to short keys ───────
function getColMap(idx) {
  return {
    // ── ข้อมูลทั่วไป ──────────────────────────
    no:   idx['ลำดับที่']                        ?? 0,
    name: idx['ชื่อสถานประกอบการ']               ?? 1,
    loc:  idx['ที่ตั้งสถานประกอบการ']             ?? 2,
    type: idx['ประเภทสินค้า/บริการ']              ?? 3,
    brand:idx['ชื่อแบรนด์']                       ?? 4,
    std:  idx['มาตรฐานสินค้าที่ได้รับ']           ?? 5,
    age:  idx['ระยะเวลาก่อตั้งกิจการ (ปี)']       ?? 6,

    // ── ช่องทางการตลาด ────────────────────────
    exp:  idx['ช่องทาง: ส่งออกต่างประเทศ']               ?? 7,
    dom:  idx['ช่องทาง: ในประเทศ']                        ?? 8,
    onl:  idx['ช่องทาง: ออนไลน์']                         ?? 9,
    loc2: idx['ช่องทาง: ขายในพื้นที่/พื้นที่ใกล้เคียง']   ?? 10,
    etc:  idx['ช่องทาง: อื่นๆ (ระบุ)']                    ?? 11,

    // ── อบรม / สัมมนา ─────────────────────────
    tr_period: idx['อบรม_สัมมนา_เวลา']      ?? 12,
    tr_place:  idx['อบรม_สัมมนา_สถานที่']   ?? 13,
    tr_topic:  idx['อบรม_สัมมนา_หัวข้อ']    ?? 14,
    tr_org:    idx['อบรม_สัมมนา_หน่วยงาน']  ?? 15,

    // ── ศึกษาดูงาน ────────────────────────────
    st_period: idx['ศึกษาดูงาน_เวลา']            ?? 16,
    st_place:  idx['ศึกษาดูงาน_สถานที่']         ?? 17,
    st_topic:  idx['ศึกษาดูงาน_หัวข้อ']          ?? 18,
    st_result: idx['ศึกษาดูงาน_ผลการดำเนินงาน']  ?? 19,
    st_org:    idx['ศึกษาดูงาน_หน่วยงาน']        ?? 20,

    // ── จำหน่ายสินค้า ─────────────────────────
    sa_period: idx['จำหน่ายสินค้า_เวลา']          ?? 21,
    sa_place:  idx['จำหน่ายสินค้า_สถานที่']       ?? 22,
    sa_event:  idx['จำหน่ายสินค้า_ชื่องาน']       ?? 23,
    sa_org:    idx['จำหน่ายสินค้า_หน่วยงาน']     ?? 24,
    sa_local:  idx['จำหน่ายสินค้า_ภายในจังหวัด']  ?? 25,
    sa_other:  idx['จำหน่ายสินค้า_ต่างจังหวัด']   ?? 26,
    sa_modern: idx['จำหน่ายสินค้า_Trade']         ?? 27,
    sa_export: idx['จำหน่ายสินค้า_ต่างประเทศ']    ?? 28,

    // ── ประเมินและผู้บันทึก ───────────────────
    tier: idx['ระดับ TIER']           ?? 29,
    note: idx['หมายเหตุ']             ?? 30,
    rep:  idx['ชื่อผู้แจ้งข้อมูล']   ?? 31,
    pos:  idx['ตำแหน่ง']              ?? 32,
    ag:   idx['หน่วยงาน']             ?? 33,
  };
}

// ── Utility: get value by name attribute ──────────
function getByName(name) {
  const el = document.querySelector(`[name="${name}"]`);
  return el ? el.value.trim() : '';
}
