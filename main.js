(function () {
  'use strict';

  var FRESHA = 'https://www.fresha.com/a/real-beauty-emporium-george-york-street-fjnzzo0g';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function book(id) {
    return id ? FRESHA + '/booking?offerItemId=' + encodeURIComponent(id) : FRESHA + '/booking?allOffer=true&menu=true';
  }
  function rand(v) {
    // R1 000, thin no-break space as thousands separator (South African convention)
    return 'R' + String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* ---------- nav ---------- */
  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');
  function closeNav() {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('no-scroll');
  }
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('no-scroll', open);
  });
  links.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeNav(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  /* ---------- price list ---------- */
  var menu = window.RBE_MENU || [];
  var tabs = document.getElementById('menu-tabs');
  var panels = document.getElementById('menu-panels');

  function row(it) {
    var meta = [];
    if (it.d) meta.push('<span>' + esc(it.d) + '</span>');
    if (it.c) meta.push('<span>' + esc(it.c) + '</span>');
    if (it.note) meta.push('<span>' + esc(it.note) + '</span>');
    if (it.desc) meta.push('<span>' + esc(it.desc) + '</span>');
    if (it.s) meta.push('<span class="save">' + esc(it.s.replace('Save up to', 'Save')) + '</span>');
    var price = (it.o ? '<span class="row-was">' + rand(it.o) + '</span>' : '')
      + (it.p.from ? '<span class="from">from</span>' : '') + rand(it.p.v);
    return '<li class="row">'
      + '<div class="row-main"><span class="row-name">' + esc(it.n) + '</span><span class="row-leader"></span><span class="row-price">' + price + '</span></div>'
      + '<a class="row-book" href="' + book(it.id) + '" target="_blank" rel="noopener" aria-label="Book ' + esc(it.n) + ' on Fresha">Book</a>'
      + (meta.length ? '<div class="row-meta">' + meta.join('<span class="dot" aria-hidden="true">·</span>') + '</div>' : '')
      + '</li>';
  }

  menu.forEach(function (g, i) {
    var count = g.cats.reduce(function (n, c) { return n + c.items.length; }, 0);
    var tab = document.createElement('button');
    tab.className = 'menu-tab';
    tab.type = 'button';
    tab.id = 'tab-' + i;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    tab.setAttribute('aria-controls', 'panel-' + i);
    tab.innerHTML = esc(g.group) + '<small>' + count + '</small>';
    tab.addEventListener('click', function () { select(i, false); });
    tabs.appendChild(tab);

    var panel = document.createElement('div');
    panel.className = 'menu-panel' + (i === 0 ? ' active' : '');
    panel.id = 'panel-' + i;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', 'tab-' + i);
    panel.innerHTML = g.cats.map(function (c) {
      return '<div class="menu-cat"><h3>' + esc(c.title) + '<small>' + c.items.length + (c.items.length === 1 ? ' option' : ' options') + '</small></h3>'
        + '<ul class="menu-list">' + c.items.map(row).join('') + '</ul></div>';
    }).join('');
    panels.appendChild(panel);
  });

  function select(i, scroll) {
    Array.prototype.forEach.call(tabs.children, function (t, k) { t.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
    Array.prototype.forEach.call(panels.children, function (p, k) { p.classList.toggle('active', k === i); });
    if (scroll) document.getElementById('menu').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }

  // service overview cards open the matching tab
  Array.prototype.forEach.call(document.querySelectorAll('.service-card'), function (a) {
    var i = menu.findIndex(function (g) { return g.group === a.getAttribute('data-group'); });
    if (i < 0) return;
    a.addEventListener('click', function (e) {
      e.preventDefault();
      select(i, true);
      if (history.replaceState) history.replaceState(null, '', '#menu');
    });
  });

  /* ---------- reviews ---------- */
  var reviews = window.RBE_REVIEWS || [];
  var cols = document.getElementById('review-columns');
  cols.innerHTML = reviews.map(function (r) {
    var bits = [];
    if (r.date) bits.push(esc(r.date));
    if (r.service) bits.push(esc(r.service));
    if (r.staff) bits.push('with ' + esc(r.staff));
    var stars = '';
    for (var k = 0; k < 5; k++) stars += k < r.rating ? '★' : '☆';
    return '<article class="review reveal">'
      + '<span class="stars" aria-label="' + r.rating + ' out of 5">' + stars + '</span>'
      + '<p>' + esc(r.text).replace(/\n+/g, '<br>') + '</p>'
      + '<footer><strong>' + esc(r.name) + '</strong><span>' + bits.join(' · ') + '</span></footer>'
      + '</article>';
  }).join('');

  /* ---------- opening hours ---------- */
  var HOURS = { 1: [8, 17], 2: [8, 17], 3: [8, 17], 4: [8, 17], 5: [8, 17], 6: [8, 13] };
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function saNow() {
    try {
      var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Africa/Johannesburg', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
      var get = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
      var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
      return { day: day, mins: (parseInt(get('hour'), 10) % 24) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  (function hours() {
    var now = saNow();
    var today = HOURS[now.day];
    var status = document.getElementById('hours-status');
    var rows = document.querySelectorAll('#hours-table tr');
    Array.prototype.forEach.call(rows, function (tr) { tr.classList.toggle('today', Number(tr.getAttribute('data-day')) === now.day); });
    var text, closed = false;
    if (today && now.mins >= today[0] * 60 && now.mins < today[1] * 60) {
      text = 'Open now, closes ' + pad(today[1]) + ':00';
    } else {
      closed = true;
      var d = now.day, n = 0;
      if (today && now.mins < today[0] * 60) { text = 'Opens today at ' + pad(today[0]) + ':00'; }
      else {
        do { d = (d + 1) % 7; n++; } while (!HOURS[d] && n < 7);
        text = 'Closed now, opens ' + (n === 1 ? 'tomorrow' : DAYS[d]) + ' at ' + pad(HOURS[d][0]) + ':00';
      }
    }
    status.textContent = text;
    status.classList.toggle('closed', closed);
  })();

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealEls, function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    Array.prototype.forEach.call(revealEls, function (el) { io.observe(el); });
  }

  document.getElementById('year').textContent = String(new Date().getFullYear());
})();
