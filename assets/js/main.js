// Bersama Bergerak — small progressive enhancements. Every page works without JS.

(function () {
  // Mobile navigation
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Quizzes: each option button points at a result panel via data-result
  document.querySelectorAll('[data-quiz]').forEach(function (quiz) {
    var buttons = quiz.querySelectorAll('button[data-result]');
    var results = quiz.querySelectorAll('.result');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        results.forEach(function (r) { r.hidden = r.id !== btn.dataset.result; });
        var shown = document.getElementById(btn.dataset.result);
        if (shown) shown.focus({ preventScroll: true });
      });
    });
  });

  // Lead form. Set data-whatsapp="62xxxxxxxxxx" on the form to send answers to WhatsApp.
  var form = document.getElementById('lead-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      var data = new FormData(form);
      var interests = data.getAll('interest');
      var id = document.documentElement.lang === 'id';
      var lines = id ? [
        'Halo Bersama Bergerak! Saya baru mengunjungi website/booth Run Safe Playground.',
        'Nama: ' + (data.get('name') || '-'),
        'Organisasi / komunitas / kampus: ' + (data.get('org') || '-'),
        'WhatsApp: ' + (data.get('whatsapp') || '-'),
        'Tertarik dengan: ' + (interests.length ? interests.join(', ') : '-')
      ] : [
        'Hi Bersama Bergerak! I just visited the Run Safe Playground.',
        'Name: ' + (data.get('name') || '-'),
        'Organization / community: ' + (data.get('org') || '-'),
        'WhatsApp: ' + (data.get('whatsapp') || '-'),
        'Interested in: ' + (interests.length ? interests.join(', ') : '-')
      ];
      var message = lines.join('\n');

      var number = (form.dataset.whatsapp || '').replace(/\D/g, '');
      if (number) {
        window.open('https://wa.me/' + number + '?text=' + encodeURIComponent(message), '_blank', 'noopener');
      }

      var success = document.getElementById('lead-success');
      var summary = document.getElementById('lead-summary');
      if (summary) summary.textContent = message;
      if (success) {
        form.hidden = true;
        success.hidden = false;
        success.focus();
      }
    });
  }

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();

// Header gets a soft background once the page scrolls past the hero top
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;
  var update = function () { header.classList.toggle('scrolled', window.scrollY > 20); };
  update();
  window.addEventListener('scroll', update, { passive: true });
})();

// Runner Reset Guide: print only the signal log
(function () {
  var btn = document.querySelector('[data-print-log]');
  if (!btn) return;
  btn.addEventListener('click', function () {
    document.body.classList.add('printing-log');
    window.print();
    document.body.classList.remove('printing-log');
  });
})();

// Runner Reset Guide 01 & 09: two-option checks with a result once every item is answered
document.querySelectorAll('[data-check]').forEach(function (tool) {
  var rows = tool.querySelectorAll('.toggle-row');
  var flagBox = tool.querySelector('.check-flag');
  var okBox = tool.querySelector('.check-ok');
  var hint = tool.querySelector('.check-hint');
  var list = flagBox.querySelector('ul');
  function update() {
    var answered = 0, flags = [];
    rows.forEach(function (row) {
      var on = row.querySelector('button[aria-pressed="true"]');
      if (!on) return;
      answered++;
      if (on.dataset.v === 'flag') flags.push(row.dataset.flagLabel);
    });
    var done = answered === rows.length;
    list.innerHTML = '';
    flags.forEach(function (f) { var li = document.createElement('li'); li.innerHTML = f; list.appendChild(li); });
    flagBox.hidden = flags.length === 0;
    okBox.hidden = !(done && flags.length === 0);
    hint.hidden = done || flags.length > 0;
  }
  rows.forEach(function (row) {
    row.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        row.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        update();
      });
    });
  });
});

// Runner Reset Guide 10: keep the signal log on this device
(function () {
  var log = document.getElementById('signal-log');
  if (!log) return;
  var key = 'bb-signal-log-' + (document.documentElement.lang || 'id');
  var fields = log.querySelectorAll('input, textarea');
  function save() {
    var data = [];
    fields.forEach(function (f) { data.push(f.type === 'checkbox' ? f.checked : f.value); });
    try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
  }
  try {
    var saved = JSON.parse(localStorage.getItem(key) || 'null');
    if (saved) fields.forEach(function (f, i) {
      if (saved[i] === undefined) return;
      if (f.type === 'checkbox') f.checked = !!saved[i]; else f.value = saved[i];
    });
  } catch (e) {}
  log.addEventListener('input', save);
  log.addEventListener('change', save);
  var clear = log.querySelector('[data-clear-log]');
  if (clear) clear.addEventListener('click', function () {
    fields.forEach(function (f) { if (f.type === 'checkbox') f.checked = false; else f.value = ''; });
    try { localStorage.removeItem(key); } catch (e) {}
  });
})();
