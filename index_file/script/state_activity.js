// ══════════════════════════════════════════════════
//  state_activity.js — ColMap for Activity sheet
// ══════════════════════════════════════════════════

const ACT_GAS_URL = 'https://script.google.com/macros/s/AKfycbx6ZMQr6bYuggv2nxIds0xR4K5MQwhVbu9JYMHmBefc2gRY3-huwSD8t09mzYFaltrR/exec';

let actAllRows      = [];
let actColMap       = {};
let actLastFiltered = [];

function buildActColMap(idx) {
  return {
    // ── ผู้ใส่ข้อมูล ───────────────────────────
    no:  idx['ลำดับที่']          ?? 0,
    rep: idx['ชื่อผู้ใส่ข้อมูล']  ?? 1,
    pos: idx['ตำแหน่ง']           ?? 2,
    ag:  idx['หน่วยงาน']          ?? 3,
    biz: idx['ชื่อสถานประกอบการ'] ?? 4,

    // ── อบรม / สัมมนา ─────────────────────────
    tr_period: idx['อบรม_ช่วงเวลา']  ?? 5,
    tr_place:  idx['อบรม_สถานที่']   ?? 6,
    tr_topic:  idx['อบรม_หัวข้อ']    ?? 7,
    tr_org:    idx['อบรม_หน่วยงาน']  ?? 8,

    // ── ศึกษาดูงาน ────────────────────────────
    st_period: idx['ดูงาน_ช่วงเวลา']        ?? 9,
    st_place:  idx['ดูงาน_สถานที่']         ?? 10,
    st_topic:  idx['ดูงาน_หัวข้อ']          ?? 11,
    st_org:    idx['ดูงาน_หน่วยงาน']        ?? 12,
    st_result: idx['ดูงาน_ผลการดำเนินงาน']  ?? 13,

    // ── ช่องทางการจำหน่าย ─────────────────────
    sa_period:     idx['จำหน่าย_ช่วงเวลา']           ?? 14,
    sa_place:      idx['จำหน่าย_สถานที่']            ?? 15,
    sa_event:      idx['จำหน่าย_ชื่องาน']            ?? 16,
    sa_org:        idx['จำหน่าย_หน่วยงาน']           ?? 17,
    sa_local:      idx['จำหน่าย_ในจังหวัด']           ?? 18,
    sa_local_val:  idx['จำหน่าย_มูลค่าในจังหวัด']    ?? 19,
    sa_other:      idx['จำหน่าย_ต่างจังหวัด']        ?? 20,
    sa_other_val:  idx['จำหน่าย_มูลค่าต่างจังหวัด']  ?? 21,
    sa_modern:     idx['จำหน่าย_ModernTrade']         ?? 22,
    sa_modern_val: idx['จำหน่าย_มูลค่าModernTrade']   ?? 23,
    sa_export:     idx['จำหน่าย_ต่างประเทศ']          ?? 24,
    sa_export_val: idx['จำหน่าย_มูลค่าต่างประเทศ']   ?? 25,
    sa_etc:        idx['จำหน่าย_อื่นๆ']               ?? 26,

    // ── หมายเหตุ + วันที่ ─────────────────────
    note: idx['หมายเหตุ']     ?? 27,
    date: idx['วันที่บันทึก'] ?? 28,
  };
}