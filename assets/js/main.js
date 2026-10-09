/* ============================================================================
   Presly — site behaviour. Vanilla JS, no framework, no external requests.
   Everything degrades gracefully if JS is unavailable.
   ========================================================================= */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  /* ---- Sticky header shadow ---- */
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 6);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Mobile navigation ---- */
  var toggle = document.getElementById('navToggle');
  var drawer = document.getElementById('mobileNav');
  if (toggle && drawer) {
    toggle.addEventListener('click', function () {
      var open = drawer.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        drawer.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        drawer.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ---- Reveal on scroll ---- */
  var revealables = document.querySelectorAll('.reveal');
  if (revealables.length) {
    var reveal = function (el) { el.classList.add('is-in'); };

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
      revealables.forEach(function (el) { io.observe(el); });

      // Failsafe. If the observer never fires — an unusual browser, a layout
      // change mid-load, an element that IntersectionObserver declines to
      // report — the content must still appear. Animation is a nicety; being
      // able to read the page is not. Anything still hidden after four seconds
      // is revealed outright, and anything already scrolled past is ignored.
      setTimeout(function () {
        revealables.forEach(function (el) {
          if (!el.classList.contains('is-in') && el.getBoundingClientRect().top < window.innerHeight * 1.5) {
            reveal(el);
          }
        });
      }, 4000);
    } else {
      // No IntersectionObserver: show everything immediately.
      revealables.forEach(reveal);
    }
  }

  /* ---- FAQ accordion (height-animated, accessible) ---- */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;

    var setOpen = function (open) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.style.height = open ? panel.scrollHeight + 'px' : '0px';
    };

    setOpen(btn.getAttribute('aria-expanded') === 'true');

    btn.addEventListener('click', function () {
      setOpen(btn.getAttribute('aria-expanded') !== 'true');
    });

    window.addEventListener('resize', function () {
      if (btn.getAttribute('aria-expanded') === 'true') {
        panel.style.height = 'auto';
        panel.style.height = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---- Copy-to-clipboard (email addresses etc.) ---- */
  document.querySelectorAll('[data-copy]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (!navigator.clipboard) return;
      e.preventDefault();
      navigator.clipboard.writeText(el.getAttribute('data-copy')).then(function () {
        var original = el.getAttribute('data-copy-label') || el.textContent;
        el.textContent = 'Copied';
        setTimeout(function () { el.textContent = original; }, 1400);
      });
    });
  });

  /* ---- Contact form: client-side validation + mailto fallback -------------
     This is a static site, so there is no server to POST to. Instead we
     validate the fields and hand the message to the visitor's mail client,
     pre-filled. To switch to a real endpoint, set FORM_ENDPOINT below or
     replace the handler with your provider's embed.                          */
  var FORM_ENDPOINT = ''; // e.g. 'https://formspree.io/f/xxxxxxx'
  var form = document.getElementById('contactForm');
  if (form) {
    var success = document.getElementById('formSuccess');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var required = form.querySelectorAll('[required]');
      var firstBad = null;
      required.forEach(function (field) {
        var bad = !field.value.trim() ||
          (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(field.value.trim()));
        field.style.borderColor = bad ? 'var(--red-600)' : '';
        if (bad && !firstBad) firstBad = field;
      });
      if (firstBad) { firstBad.focus(); return; }

      var data = new FormData(form);
      var btn = form.querySelector('[type="submit"]');

      var finish = function () {
        if (success) {
          success.classList.add('is-shown');
          success.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
        form.reset();
        if (btn) { btn.disabled = false; btn.textContent = btn.getAttribute('data-label') || 'Send enquiry'; }
      };

      if (FORM_ENDPOINT) {
        if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
        fetch(FORM_ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(finish)
          .catch(function () { mailtoFallback(form, data); finish(); });
      } else {
        mailtoFallback(form, data);
        finish();
      }
    });

    var submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) submitBtn.setAttribute('data-label', submitBtn.textContent.trim());
  }

  function mailtoFallback(form, data) {
    var get = function (k) { return (data.get(k) || '').toString().trim(); };
    var name = [get('firstName'), get('lastName')].filter(Boolean).join(' ') || get('name');
    var lines = [
      'Name: ' + name,
      'Company: ' + get('company'),
      'Email: ' + get('email'),
      'Phone: ' + get('phone'),
      'Country / region: ' + get('country'),
      'Company size: ' + get('size'),
      'Portfolio size: ' + get('portfolio'),
      'Interested in: ' + get('interest'),
      '',
      get('message')
    ];
    var subject = 'Presly Estate enquiry — ' + (get('company') || name || 'Website');
    var href = 'mailto:contact@presly.de?subject=' + encodeURIComponent(subject) +
               '&body=' + encodeURIComponent(lines.join('\n'));
    window.location.href = href;
  }

  /* ---- Pre-fill the enquiry form from the URL -----------------------------
     Pricing cards link to contact.html?package=growth#quote. Map that to a
     value in the "What are you contacting us about?" dropdown so the visitor
     does not have to repeat themselves. Behaviour with no query string is
     identical to before.                                                     */
  var PACKAGE_LABELS = {
    starter: 'Request pricing for a package',
    growth: 'Request pricing for a package',
    enterprise: 'Request pricing for a package'
  };
  (function prefillFromQuery() {
    var params;
    try { params = new URLSearchParams(window.location.search); } catch (e) { return; }

    var interest = document.getElementById('interest');
    var pkg = (params.get('package') || '').toLowerCase();
    if (interest && pkg && PACKAGE_LABELS[pkg]) {
      interest.value = PACKAGE_LABELS[pkg];
      var message = document.getElementById('message');
      if (message && !message.value) {
        message.value = 'We are interested in the ' +
          pkg.charAt(0).toUpperCase() + pkg.slice(1) + ' package.\n\n';
        message.focus();
        message.setSelectionRange(message.value.length, message.value.length);
      }
    }

    // Any other query key becomes a note in the message, e.g. ?ref=partner
    var notes = [];
    params.forEach(function (value, key) {
      if (key === 'package' || key === 'utm_source' || key === 'utm_campaign') return;
      if (value) notes.push(key + ': ' + value);
    });
    var msg = document.getElementById('message');
    if (msg && notes.length && !msg.value) msg.value = notes.join('\n') + '\n\n';
  })();

  /* ---- Current year in footer ---- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---- Deep-link anchor offset for the sticky header ---- */
  if (location.hash) {
    window.addEventListener('load', function () {
      var target = document.querySelector(location.hash);
      if (target) {
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 88, behavior: 'auto' });
      }
    });
  }
})();
