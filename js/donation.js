/* ============================================================
   Donation — footer entry → dialog with runtime-generated QR
   Config / UI / app-handoff / QR generation kept in one small
   dependency-free module; the QR library itself is lazy-loaded
   from vendor/ only when the dialog is first opened.
   ============================================================ */

(function () {
  'use strict';

  // Central payment configuration. No payment data is collected,
  // stored, or sent anywhere; these are the same public QR payloads
  // the payment providers themselves hand out.
  var DONATION_CONFIG = {
    alipay: { qrContent: 'https://qr.alipay.com/fkx16432isyyhmx9ttwpi79' },
    wechat: { qrContent: 'wxp://f2f1fJpOcJc7F-MSeLMxALhc6tWu-oohtxueHRbCe98bMy2AmDunimuOJFv-8bjobLBM' }
  };

  var QR_LIB_SRC = 'vendor/qrcode-generator/qrcode.min.js';
  var QR_TARGET = 220;   // rendered QR size in px (spec: ~220px)
  var QR_QUIET = 4;      // quiet zone in modules (spec: >= 4)

  var els = {
    entry: document.getElementById('donation-entry'),
    overlay: document.getElementById('donation-overlay'),
    dialog: document.getElementById('donation-dialog'),
    closeBtn: document.getElementById('donation-close'),
    methodButtons: document.querySelectorAll('.donation-method'),
    launch: document.getElementById('donation-launch'),
    qr: document.getElementById('donation-qr'),
    hint: document.getElementById('donation-hint')
  };

  var state = {
    method: 'alipay',
    open: false,
    lastFocus: null,
    qrCache: {},
    qrLibPromise: null,
    appCheckCleanup: null,
    notOpened: false
  };

  function t(key) { return window.Lang.t(key); }

  // Touch-primary device: Android/iPhone UA, or multi-touch + coarse pointer
  // (covers desktop-like iPad UAs without matching touch laptops).
  function isMobile() {
    if (/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)) return true;
    return typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1 &&
           window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  }

  /* ---------------- QR generation (lazy, cached) ---------------- */

  function loadQrLib() {
    if (window.qrcode) return Promise.resolve();
    if (!state.qrLibPromise) {
      state.qrLibPromise = new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        script.src = QR_LIB_SRC;
        script.onload = function () { resolve(); };
        script.onerror = function () {
          state.qrLibPromise = null;
          reject(new Error('QR library failed to load'));
        };
        document.head.appendChild(script);
      });
    }
    return state.qrLibPromise;
  }

  function buildQrSvg(content) {
    var qr = window.qrcode(0, 'M');          // 0 = auto version, EC level M
    qr.addData(content);
    qr.make();
    var count = qr.getModuleCount();
    var cell = Math.max(2, Math.floor(QR_TARGET / (count + QR_QUIET * 2)));
    var size = (count + QR_QUIET * 2) * cell;
    var rects = '';
    for (var row = 0; row < count; row++) {
      for (var col = 0; col < count; col++) {
        if (qr.isDark(row, col)) {
          rects += '<rect x="' + ((col + QR_QUIET) * cell) + '" y="' + ((row + QR_QUIET) * cell) +
                   '" width="' + cell + '" height="' + cell + '"/>';
        }
      }
    }
    // Dark modules on a white card: contrast and quiet zone come before
    // theming — the QR itself never inherits site colors.
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + size + ' ' + size + '"' +
           ' shape-rendering="crispEdges" fill="#111111" role="img"' +
           ' aria-label="' + t('donation.qrAria') + '">' +
           '<rect width="' + size + '" height="' + size + '" fill="#ffffff"/>' + rects + '</svg>';
  }

  function renderQr(method) {
    if (state.qrCache[method]) {
      els.qr.innerHTML = state.qrCache[method];
      return;
    }
    loadQrLib().then(function () {
      state.qrCache[method] = buildQrSvg(DONATION_CONFIG[method].qrContent);
      if (state.open && state.method === method) {
        els.qr.innerHTML = state.qrCache[method];
      }
    }).catch(function () {
      els.hint.textContent = t('donation.qrError');
    });
  }

  /* ---------------- app hand-off detection (mobile) ---------------- */

  function cancelAppCheck() {
    if (state.appCheckCleanup) {
      state.appCheckCleanup();
      state.appCheckCleanup = null;
    }
  }

  // Soft detection only: browsers cannot prove whether an external app
  // opened, so this never declares failure — the QR stays visible the
  // whole time and the hint simply changes if the page stayed foreground.
  function armAppCheck() {
    cancelAppCheck();
    state.notOpened = false;
    var handoffSeen = false;
    var mark = function () { handoffSeen = true; };
    var onVis = function () { if (document.visibilityState === 'hidden') mark(); };
    window.addEventListener('pagehide', mark);
    window.addEventListener('blur', mark);
    document.addEventListener('visibilitychange', onVis);
    var timer = setTimeout(function () {
      if (!handoffSeen && state.open && state.method === 'alipay') {
        state.notOpened = true;
        updateHint();
      }
    }, 1500);
    state.appCheckCleanup = function () {
      clearTimeout(timer);
      window.removeEventListener('pagehide', mark);
      window.removeEventListener('blur', mark);
      document.removeEventListener('visibilitychange', onVis);
    };
  }

  /* ---------------- dialog ---------------- */

  function updateLaunch() {
    var mobileAlipay = isMobile() && state.method === 'alipay';
    els.launch.hidden = !mobileAlipay;
    if (mobileAlipay) {
      els.launch.setAttribute('href', DONATION_CONFIG.alipay.qrContent);
    }
  }

  function updateHint() {
    if (state.notOpened) {
      els.hint.textContent = t('donation.notOpened');
    } else {
      els.hint.textContent = t(state.method === 'alipay' ? 'donation.scanAlipay' : 'donation.scanWechat');
    }
  }

  function setMethod(method) {
    state.method = method;
    state.notOpened = false;
    cancelAppCheck();
    for (var i = 0; i < els.methodButtons.length; i++) {
      var btn = els.methodButtons[i];
      var active = btn.getAttribute('data-method') === method;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    }
    updateLaunch();
    updateHint();
    renderQr(method);
  }

  function openDialog() {
    state.open = true;
    state.lastFocus = document.activeElement;
    els.overlay.hidden = false;
    els.dialog.hidden = false;
    document.documentElement.classList.add('donation-open');
    document.addEventListener('keydown', onKeydown);
    setMethod('alipay');
    els.closeBtn.focus();
  }

  function closeDialog() {
    state.open = false;
    els.overlay.hidden = true;
    els.dialog.hidden = true;
    document.documentElement.classList.remove('donation-open');
    document.removeEventListener('keydown', onKeydown);
    cancelAppCheck();
    if (state.lastFocus && typeof state.lastFocus.focus === 'function') {
      state.lastFocus.focus();
    }
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeDialog();
      return;
    }
    if (e.key === 'Tab') trapTab(e);
  }

  function trapTab(e) {
    var focusables = [els.closeBtn, els.methodButtons[0], els.methodButtons[1]];
    if (!els.launch.hidden) focusables.push(els.launch);
    var list = [];
    for (var i = 0; i < focusables.length; i++) {
      if (focusables[i] && focusables[i].offsetParent !== null) list.push(focusables[i]);
    }
    if (!list.length) return;
    var first = list[0];
    var last = list[list.length - 1];
    var active = document.activeElement;
    if (e.shiftKey && (active === first || !els.dialog.contains(active))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (active === last || !els.dialog.contains(active))) {
      e.preventDefault();
      first.focus();
    }
  }

  /* ---------------- wiring ---------------- */

  els.entry.addEventListener('click', openDialog);
  els.closeBtn.addEventListener('click', closeDialog);
  els.overlay.addEventListener('click', closeDialog);
  els.dialog.addEventListener('click', function (e) {
    if (e.target === els.dialog) closeDialog();
  });

  for (var i = 0; i < els.methodButtons.length; i++) {
    els.methodButtons[i].addEventListener('click', function () {
      setMethod(this.getAttribute('data-method'));
    });
  }

  // The alipay link is a plain https URL — the browser and Alipay's own
  // page handle any app hand-off. We never construct payment schemes.
  els.launch.addEventListener('click', armAppCheck);

  window.Lang.onChange(function () {
    // static labels are re-applied by i18n.js itself; refresh dynamic ones
    if (state.open) updateHint();
    state.qrCache = {};   // re-render so the SVG aria-label follows the language
    if (state.open) renderQr(state.method);
  });
})();
