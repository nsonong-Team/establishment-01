// ══════════════════════════════════════════════════
//  state.js — Global state & shared utilities
// ══════════════════════════════════════════════════

const GAS_URL = 'https://script.google.com/macros/s/AKfycbzXumPn7FLpFzyOaDdvhHctTg1-KhUpVaCDYlu2Hhf1pKyULhr_4a_r7AifLCzpc9nV0w/exec';

let allRows            = [];
let colMap             = {};
let lastFiltered       = [];
let currentFilteredIdx = null;

// ── Utilities ─────────────────────────────────────
function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function getByName(name) {
  const el = document.querySelector(`[name="${name}"]`);
  return el ? el.value.trim() : '';
}

function showToast(msg, isError) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast' + (isError ? ' error' : '') + ' show';
  setTimeout(() => t.classList.remove('show'), 3500);
}

function buildIdx(headers) {
  const m = {};
  headers.forEach((h, i) => m[h] = i);
  return m;
}

function getColMap(idx) {
  return {
    // ── ผู้ใส่ข้อมูล ───────────────────────────
    no:   idx['ลำดับที่']          ?? 0,
    rep:  idx['ชื่อผู้ใส่ข้อมูล']  ?? 1,
    pos:  idx['ตำแหน่ง']           ?? 2,
    ag:   idx['หน่วยงาน']          ?? 3,

    // ── ข้อมูลสถานประกอบการ ───────────────────
    name:  idx['ชื่อสถานประกอบการ']    ?? 4,
    loc:   idx['ที่ตั้งสถานประกอบการ'] ?? 5,
    phone: idx['หมายเลขโทรศัพท์']      ?? 6,
    owner: idx['ชื่อผู้ประกอบการ'],

    // ── รายละเอียดกิจการ ──────────────────────
    member:   idx['จำนวนสมาชิก']   ?? 8,
    capacity: idx['กำลังการผลิต']  ?? 9,
    income:   idx['รายได้เฉลี่ย']  ?? 10,

    // ── ประเภทผู้ประกอบการ ────────────────────
    type_otop:    idx['ประเภท_OTOP']           ?? 11,
    type_smes:    idx['ประเภท_SMEs']           ?? 12,
    type_vill:    idx['ประเภท_วิสาหกิจชุมชน'] ?? 13,
    type_startup: idx['ประเภท_StartUp']        ?? 14,
    type_corp:    idx['ประเภท_บริษัทฯ']        ?? 15,
    type_etc:     idx['ประเภท_อื่นๆ']          ?? 16,

    // ── ข้อมูลสินค้า ──────────────────────────
    brand:      idx['ชื่อแบรนด์']      ?? 17,
    prod_food:  idx['สินค้า_อาหาร']    ?? 18,
    prod_cloth: idx['สินค้า_ผ้า']      ?? 19,
    prod_goods: idx['สินค้า_ของใช้']   ?? 20,
    prod_herb:  idx['สินค้า_สมุนไพร']  ?? 21,
    prod_agri:  idx['สินค้า_เกษตร']    ?? 22,
    prod_etc:   idx['สินค้า_อื่นๆ']    ?? 23,

    // ── มาตรฐาน ───────────────────────────────
    std_otop: idx['มาตรฐาน_OTOP3_5']   ?? 24,
    std_mph:  idx['มาตรฐาน_มผช']       ?? 25,
    std_fda:  idx['มาตรฐาน_อย']        ?? 26,
    std_gap:  idx['มาตรฐาน_GAP']       ?? 27,
    std_gmp:  idx['มาตรฐาน_GMP']       ?? 28,
    std_nbl:  idx['มาตรฐาน_NBLBrand']  ?? 29,
    std_etc:  idx['มาตรฐาน_อื่นๆ']     ?? 30,

    // ── ประเมิน ────────────────────────────────
    tier: idx['ระดับ TIER']   ?? 31,
    note: idx['หมายเหตุ']     ?? 32,
    date: idx['วันที่บันทึก'] ?? 33,
  };
}