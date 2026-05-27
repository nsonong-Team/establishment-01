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
    // ── ลำดับที่ + ผู้ใส่ข้อมูล ───────────────
    no:   idx['ลำดับที่']          ?? 0,
    rep:  idx['ชื่อผู้ใส่ข้อมูล']  ?? 1,
    pos:  idx['ตำแหน่ง']           ?? 2,
    ag:   idx['หน่วยงาน']          ?? 3,

    // ── ข้อมูลทั่วไป ──────────────────────────
    name: idx['ชื่อสถานประกอบการ']               ?? 4,
    loc:  idx['ที่ตั้งสถานประกอบการ']             ?? 5,
    type: idx['ประเภทสินค้า/บริการ']              ?? 6,
    brand:idx['ชื่อแบรนด์']                       ?? 7,
    std:  idx['มาตรฐานสินค้าที่ได้รับ']           ?? 8,
    age:  idx['ระยะเวลาก่อตั้งกิจการ (ปี)']       ?? 9,

    // ── ช่องทางการตลาด ────────────────────────
    exp:  idx['ช่องทาง: ส่งออกต่างประเทศ']               ?? 10,
    dom:  idx['ช่องทาง: ในประเทศ']                        ?? 11,
    onl:  idx['ช่องทาง: ออนไลน์']                         ?? 12,
    loc2: idx['ช่องทาง: ขายในพื้นที่/พื้นที่ใกล้เคียง']   ?? 13,
    etc:  idx['ช่องทาง: อื่นๆ (ระบุ)']                    ?? 14,

    // ── อบรม / สัมมนา ─────────────────────────
    tr_period: idx['อบรม_สัมมนา_เวลา']      ?? 15,
    tr_place:  idx['อบรม_สัมมนา_สถานที่']   ?? 16,
    tr_topic:  idx['อบรม_สัมมนา_หัวข้อ']    ?? 17,
    tr_org:    idx['อบรม_สัมมนา_หน่วยงาน']  ?? 18,

    // ── ศึกษาดูงาน ────────────────────────────
    st_period: idx['ศึกษาดูงาน_เวลา']            ?? 19,
    st_place:  idx['ศึกษาดูงาน_สถานที่']         ?? 20,
    st_topic:  idx['ศึกษาดูงาน_หัวข้อ']          ?? 21,
    st_result: idx['ศึกษาดูงาน_ผลการดำเนินงาน']  ?? 22,
    st_org:    idx['ศึกษาดูงาน_หน่วยงาน']        ?? 23,

    // ── จำหน่ายสินค้า ─────────────────────────
    sa_period: idx['จำหน่ายสินค้า_เวลา']          ?? 24,
    sa_place:  idx['จำหน่ายสินค้า_สถานที่']       ?? 25,
    sa_event:  idx['จำหน่ายสินค้า_ชื่องาน']       ?? 26,
    sa_org:    idx['จำหน่ายสินค้า_หน่วยงาน']      ?? 27,
    sa_local:  idx['จำหน่ายสินค้า_ภายในจังหวัด']  ?? 28,
    sa_other:  idx['จำหน่ายสินค้า_ต่างจังหวัด']   ?? 29,
    sa_modern: idx['จำหน่ายสินค้า_Trade']         ?? 30,
    sa_export: idx['จำหน่ายสินค้า_ต่างประเทศ']    ?? 31,

    // ── ประเมินและผู้บันทึก ───────────────────
    tier: idx['ระดับ TIER']    ?? 32,
    note: idx['หมายเหตุ']      ?? 33,
    date: idx['วันที่บันทึก']  ?? 34,
  };
}

// ── Utility: get value by name attribute ──────────
function getByName(name) {
  const el = document.querySelector(`[name="${name}"]`);
  return el ? el.value.trim() : '';
}
