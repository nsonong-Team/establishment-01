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

    // ── อบรม / สัมมนา ─────────────────────────
    tr_period: idx['อบรม_ช่วงเวลา']  ?? 4,
    tr_place:  idx['อบรม_สถานที่']   ?? 5,
    tr_topic:  idx['อบรม_หัวข้อ']    ?? 6,
    tr_org:    idx['อบรม_หน่วยงาน']  ?? 7,

    // ── ศึกษาดูงาน ────────────────────────────
    st_period: idx['ดูงาน_ช่วงเวลา']        ?? 8,
    st_place:  idx['ดูงาน_สถานที่']         ?? 9,
    st_topic:  idx['ดูงาน_หัวข้อ']          ?? 10,
    st_org:    idx['ดูงาน_หน่วยงาน']        ?? 11,
    st_result: idx['ดูงาน_ผลการดำเนินงาน']  ?? 12,

    // ── ช่องทางการจำหน่าย ─────────────────────
    sa_period:      idx['จำหน่าย_ช่วงเวลา']          ?? 13,
    sa_place:       idx['จำหน่าย_สถานที่']           ?? 14,
    sa_event:       idx['จำหน่าย_ชื่องาน']           ?? 15,
    sa_org:         idx['จำหน่าย_หน่วยงาน']          ?? 16,
    sa_local:       idx['จำหน่าย_ในจังหวัด']          ?? 17,
    sa_local_val:   idx['จำหน่าย_มูลค่าในจังหวัด']   ?? 18,
    sa_other:       idx['จำหน่าย_ต่างจังหวัด']       ?? 19,
    sa_other_val:   idx['จำหน่าย_มูลค่าต่างจังหวัด'] ?? 20,
    sa_modern:      idx['จำหน่าย_ModernTrade']        ?? 21,
    sa_modern_val:  idx['จำหน่าย_มูลค่าModernTrade']  ?? 22,
    sa_export:      idx['จำหน่าย_ต่างประเทศ']         ?? 23,
    sa_export_val:  idx['จำหน่าย_มูลค่าต่างประเทศ']  ?? 24,
    sa_etc:         idx['จำหน่าย_อื่นๆ']              ?? 25,

    // ── หมายเหตุ + วันที่ ─────────────────────
    note: idx['หมายเหตุ']     ?? 26,
    date: idx['วันที่บันทึก'] ?? 27,
  };
}