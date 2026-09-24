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
    var buttons = quiz.querySelectorAll('.options button');
    var results = quiz.querySelectorAll('.result');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        results.forEach(function (r) { r.hidden = r.id !== btn.dataset.result; });
        var shown = document.getElementById(btn.dataset.result);
        if (shown) shown.focus({ preventScroll: false });
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
