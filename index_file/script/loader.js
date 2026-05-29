const PARTIALS = [
  ['tab-dash',          'index_file/html/tab-dashboard.html'],
  ['tab-establishment', 'index_file/html/tab-establishment.html'],
  ['tab-activity',      'index_file/html/tab-activity.html'],
  ['tab-promotion',     'index_file/html/tab-promotion.html'],
  ['tab-overview',      'index_file/html/tab-overview.html'],
  ['modals-container',  'index_file/html/modals.html'],
];

const SCRIPTS = [
  'index_file/script/state.js',
  'index_file/script/state_activity.js',
  'index_file/script/state_promotion.js',
  'index_file/script/nav.js',
  'index_file/script/form.js',
  'index_file/script/form_activity.js',
  'index_file/script/form_promotion.js',
  'index_file/script/table.js',
  'index_file/script/table_activity.js',
  'index_file/script/table_promotion.js',
  'index_file/script/modal.js',
  'index_file/script/modal_activity.js',
  'index_file/script/modal_promotion.js',
  'index_file/script/dashboard.js',
  'index_file/script/overview.js',
];

function loadScript(src) {
  return new Promise(function (resolve) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = resolve;
    document.body.appendChild(s);
  });
}

function loadScriptsSequentially() {
  return SCRIPTS.reduce(function (p, src) {
    return p.then(function () { return loadScript(src); });
  }, Promise.resolve());
}

Promise.all(
  PARTIALS.map(function (item) {
    return fetch(item[1])
      .then(function (r) { return r.text(); })
      .then(function (html) {
        document.getElementById(item[0]).innerHTML = html;
      });
  })
).then(loadScriptsSequentially).then(function() {
  // scripts โหลดครบแล้ว — โหลด dashboard + biz names
  loadDashboard();

  fetch(GAS_URL + '?action=getSheetData')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.headers && data.rows) {
        colMap  = getColMap(buildIdx(data.headers));
        allRows = data.rows;
      }
    });
});
