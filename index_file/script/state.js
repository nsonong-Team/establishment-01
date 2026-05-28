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

    // ── รายละเอียดกิจการ ──────────────────────
    member:   idx['จำนวนสมาชิก']   ?? 7,
    capacity: idx['กำลังการผลิต']  ?? 8,
    income:   idx['รายได้เฉลี่ย']  ?? 9,

    // ── ประเภทผู้ประกอบการ ────────────────────
    type_otop:    idx['ประเภท_OTOP']           ?? 10,
    type_smes:    idx['ประเภท_SMEs']           ?? 11,
    type_vill:    idx['ประเภท_วิสาหกิจชุมชน'] ?? 12,
    type_startup: idx['ประเภท_StartUp']        ?? 13,
    type_corp:    idx['ประเภท_บริษัทฯ']        ?? 14,
    type_etc:     idx['ประเภท_อื่นๆ']          ?? 15,

    // ── ข้อมูลสินค้า ──────────────────────────
    brand:      idx['ชื่อแบรนด์']      ?? 16,
    prod_food:  idx['สินค้า_อาหาร']    ?? 17,
    prod_cloth: idx['สินค้า_ผ้า']      ?? 18,
    prod_goods: idx['สินค้า_ของใช้']   ?? 19,
    prod_herb:  idx['สินค้า_สมุนไพร']  ?? 20,
    prod_agri:  idx['สินค้า_เกษตร']    ?? 21,
    prod_etc:   idx['สินค้า_อื่นๆ']    ?? 22,

    // ── มาตรฐาน ───────────────────────────────
    std_otop: idx['มาตรฐาน_OTOP3_5']   ?? 23,
    std_mph:  idx['มาตรฐาน_มผช']       ?? 24,
    std_fda:  idx['มาตรฐาน_อย']        ?? 25,
    std_gap:  idx['มาตรฐาน_GAP']       ?? 26,
    std_gmp:  idx['มาตรฐาน_GMP']       ?? 27,
    std_nbl:  idx['มาตรฐาน_NBLBrand']  ?? 28,
    std_etc:  idx['มาตรฐาน_อื่นๆ']     ?? 29,

    // ── ประเมิน ────────────────────────────────
    tier: idx['ระดับ TIER']   ?? 30,
    note: idx['หมายเหตุ']     ?? 31,
    date: idx['วันที่บันทึก'] ?? 32,
  };
}