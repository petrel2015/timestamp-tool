/* ============================================================
   TIMESTAMP — app logic
   live clock · bidirectional conversion · epoch stats · copy
   ============================================================ */

(function () {
  'use strict';

  var t = window.Lang.t;

  var els = {
    tzLabel: document.getElementById('tz-label'),
    footerTz: document.getElementById('footer-tz'),
    nowDatetime: document.getElementById('now-datetime'),
    nowWeekday: document.getElementById('now-weekday'),
    nowUnixS: document.getElementById('now-unix-s'),
    nowUnixMs: document.getElementById('now-unix-ms'),
    tsInput: document.getElementById('ts-input'),
    tsError: document.getElementById('ts-error'),
    unitButtons: document.querySelectorAll('.seg-btn'),
    dateInput: document.getElementById('date-input'),
    timeInput: document.getElementById('time-input'),
    nowBtn: document.getElementById('now-btn'),
    resLocal: document.getElementById('res-local'),
    resUtc: document.getElementById('res-utc'),
    resIso: document.getElementById('res-iso'),
    resUnixS: document.getElementById('res-unix-s'),
    resUnixMs: document.getElementById('res-unix-ms'),
    resRel: document.getElementById('res-rel')
  };

  var state = {
    viewMs: Date.now(),   // the instant the result panel reflects
    unit: 'auto'
  };

  var MAX_MS = 8.64e15;   // ECMAScript date range ≈ ±273,790 years

  /* ---------------- formatting helpers ---------------- */

  function pad(n, w) { return String(n).padStart(w || 2, '0'); }

  function fmtDate(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function fmtTime(d) {
    return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }

  function tzOffsetStr(d) {
    var m = -d.getTimezoneOffset();
    var sign = m < 0 ? '-' : '+';
    var abs = Math.abs(m);
    return 'GMT' + sign + pad(Math.floor(abs / 60)) + ':' + pad(abs % 60);
  }

  function tzName() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } catch (e) { return ''; }
  }

  function fmtIso(d) {
    var s = fmtDate(d) + 'T' + fmtTime(d);
    if (d.getMilliseconds()) s += '.' + pad(d.getMilliseconds(), 3);
    return s + tzOffsetStr(d).replace('GMT', '');
  }

  function fmtUtc(d) {
    return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) +
           ' ' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) +
           ' UTC';
  }

  var weekdayFmtCache = { lang: null, fmt: null };

  function weekdayName(d) {
    var lang = window.Lang.get();
    if (weekdayFmtCache.lang !== lang) {
      weekdayFmtCache.lang = lang;
      weekdayFmtCache.fmt = new Intl.DateTimeFormat(
        lang === 'zh' ? 'zh-CN' : 'en-US', { weekday: 'long' });
    }
    return weekdayFmtCache.fmt.format(d);
  }

  function num(n) { return String(n); }

  /* ---------------- date statistics ---------------- */

  // Convention: 1970-01-01 is day 1; week 1 covers 1970-01-01 … 01-07;
  // month 1 is 1970-01. All computed on the local calendar date.
  function computeStats(d) {
    var localMidnightUtcMs = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    var daySinceEpoch = Math.round(localMidnightUtcMs / 86400000) + 1;
    var weekSinceEpoch = Math.floor((daySinceEpoch - 1) / 7) + 1;
    var monthSinceEpoch = (d.getFullYear() - 1970) * 12 + d.getMonth() + 1;

    var yearStart = Date.UTC(d.getFullYear(), 0, 1);
    var dayOfYear = Math.round((localMidnightUtcMs - yearStart) / 86400000) + 1;
    var daysInYear = ((new Date(d.getFullYear(), 1, 29).getDate() === 29)) ? 366 : 365;

    var iso = isoWeek(d);
    return {
      daySinceEpoch: daySinceEpoch,
      weekSinceEpoch: weekSinceEpoch,
      monthSinceEpoch: monthSinceEpoch,
      dayOfYear: dayOfYear,
      daysInYear: daysInYear,
      isoWeek: iso.week,
      isoYear: iso.year
    };
  }

  function isoWeek(d) {
    var date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var dayNum = (date.getDay() + 6) % 7;                 // Mon = 0
    date.setDate(date.getDate() - dayNum + 3);            // this ISO week's Thursday
    var isoYear = date.getFullYear();
    var base = new Date(isoYear, 0, 4);                   // Jan 4 is always in week 1
    var baseDayNum = (base.getDay() + 6) % 7;
    base.setDate(base.getDate() - baseDayNum + 3);        // week-1 Thursday
    var week = 1 + Math.round((date - base) / 604800000);
    return { week: week, year: isoYear };
  }

  function renderStats(d, idPrefix) {
    var s = computeStats(d);
    document.getElementById(idPrefix + '-stat-day').textContent = num(s.daySinceEpoch);
    document.getElementById(idPrefix + '-stat-week').textContent = num(s.weekSinceEpoch);
    document.getElementById(idPrefix + '-stat-month').textContent = num(s.monthSinceEpoch);
    document.getElementById(idPrefix + '-stat-doy').textContent =
      s.dayOfYear + ' / ' + s.daysInYear;
    document.getElementById(idPrefix + '-stat-iso').textContent = s.isoWeek;
    document.getElementById(idPrefix + '-isoyear').textContent = '· ' + s.isoYear;
  }

  /* ---------------- relative time ---------------- */

  function relStr(ms) {
    var diff = ms - Date.now();
    var abs = Math.abs(diff);
    var sec = Math.round(abs / 1000);
    var value, unit;

    if (sec < 1) return t('rel.now');
    if (sec < 60)            { value = sec;                        unit = 'sec'; }
    else if (sec < 3600)     { value = Math.round(sec / 60);       unit = 'min'; }
    else if (sec < 86400)    { value = Math.round(sec / 3600);     unit = 'hour'; }
    else if (sec < 31557600) { value = Math.round(sec / 86400);    unit = 'day'; }
    else                     { value = Math.round(sec / 31557600 * 10) / 10; unit = 'year'; }

    var params = { n: num(value), u: t('relunit.' + unit, { n: value }) };
    return t(diff > 0 ? 'rel.in' : 'rel.ago', params);
  }

  /* ---------------- timestamp parsing ---------------- */

  function parseTs(raw, unit) {
    var str = String(raw).replace(/[\s,_]/g, '');
    if (!/^-?\d+$/.test(str)) return { err: 'invalid' };

    var n = Number(str);
    var digits = str.replace('-', '').length;

    var ms;
    if (unit === 's')       ms = n * 1000;
    else if (unit === 'ms') ms = n;
    else if (digits >= 16)  ms = n / 1000;   // microseconds
    else if (digits >= 12)  ms = n;          // milliseconds
    else                    ms = n * 1000;   // seconds

    if (!isFinite(ms) || Math.abs(ms) > MAX_MS) return { err: 'range' };
    return { ms: ms };
  }

  /* ---------------- state & rendering ---------------- */

  function setView(ms, source) {
    state.viewMs = ms;
    var d = new Date(ms);

    if (source !== 'ts') {
      var v = (state.unit === 'ms') ? ms : Math.floor(ms / 1000);
      els.tsInput.value = v;
      clearTsError();
    }
    if (source !== 'dt') {
      els.dateInput.value = fmtDate(d);
      els.timeInput.value = fmtTime(d);
    }
    renderResults();
  }

  function renderNow() {
    var now = new Date();
    els.nowDatetime.textContent = fmtDate(now) + ' ' + fmtTime(now);
    els.nowWeekday.textContent = weekdayName(now);
    els.nowUnixS.textContent = String(Math.floor(now.getTime() / 1000));
    els.nowUnixMs.textContent = String(now.getTime());
    renderStats(now, 'now');
    var tz = tzOffsetStr(now) + (tzName() ? ' · ' + tzName() : '');
    els.tzLabel.textContent = tz;
    els.footerTz.textContent = tz;
  }

  function renderResults() {
    var d = new Date(state.viewMs);
    els.resLocal.textContent = fmtDate(d) + ' ' + fmtTime(d) + ' · ' + weekdayName(d);
    els.resUtc.textContent = fmtUtc(d);
    els.resIso.textContent = fmtIso(d);
    els.resUnixS.textContent = String(Math.floor(state.viewMs / 1000));
    els.resUnixMs.textContent = String(state.viewMs);
    els.resRel.textContent = relStr(state.viewMs);
    renderStats(d, 'res');
  }

  function showTsError(key) {
    els.tsError.textContent = t(key);
    els.tsInput.classList.add('invalid');
  }

  function clearTsError() {
    els.tsError.textContent = '';
    els.tsInput.classList.remove('invalid');
  }

  /* ---------------- clipboard ---------------- */

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { /* noop */ }
    ta.remove();
    return ok;
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      // Some embedded webviews leave writeText pending or blocked; race it
      // against a timeout and fall back to the synchronous legacy path.
      var timeout = new Promise(function (resolve) {
        setTimeout(function () { resolve(false); }, 800);
      });
      var write = navigator.clipboard.writeText(text).then(function () { return true; },
                                                        function () { return false; });
      return Promise.race([write, timeout]).then(function (ok) {
        return ok || legacyCopy(text);
      });
    }
    return Promise.resolve(legacyCopy(text));
  }

  function flash(btn) {
    btn.classList.add('copied');
    clearTimeout(btn._flashTimer);
    btn._flashTimer = setTimeout(function () { btn.classList.remove('copied'); }, 1400);
  }

  /* ---------------- events ---------------- */

  function onTsInput() {
    var v = els.tsInput.value;
    if (v.trim() === '') { clearTsError(); return; }
    var r = parseTs(v, state.unit);
    if (r.err) { showTsError('err.' + r.err); return; }
    clearTsError();
    setView(r.ms, 'ts');
  }

  function onUnitChange(btn) {
    state.unit = btn.getAttribute('data-unit');
    for (var i = 0; i < els.unitButtons.length; i++) {
      var b = els.unitButtons[i];
      var active = b === btn;
      b.classList.toggle('active', active);
      b.setAttribute('aria-checked', active ? 'true' : 'false');
    }
    if (els.tsInput.value.trim() !== '') onTsInput();
  }

  function onDateTimeChange() {
    var dv = els.dateInput.value;
    if (!dv) return;
    var parts = dv.split('-').map(Number);
    var tv = els.timeInput.value || '00:00:00';
    var tp = tv.split(':').map(Number);
    var d = new Date(parts[0], parts[1] - 1, parts[2], tp[0] || 0, tp[1] || 0, tp[2] || 0);
    if (!isNaN(d.getTime())) setView(d.getTime(), 'dt');
  }

  function bindEvents() {
    els.tsInput.addEventListener('input', onTsInput);
    els.dateInput.addEventListener('change', onDateTimeChange);
    els.timeInput.addEventListener('change', onDateTimeChange);
    els.nowBtn.addEventListener('click', function () { setView(Date.now(), 'all'); });

    for (var i = 0; i < els.unitButtons.length; i++) {
      els.unitButtons[i].addEventListener('click', function () { onUnitChange(this); });
    }

    var langBtns = document.querySelectorAll('[data-lang-btn]');
    for (var j = 0; j < langBtns.length; j++) {
      langBtns[j].addEventListener('click', function () { window.Lang.set(this.getAttribute('data-lang-btn')); });
    }

    var copyBtns = document.querySelectorAll('.copy-btn');
    for (var k = 0; k < copyBtns.length; k++) {
      copyBtns[k].addEventListener('click', function () {
        var target = document.getElementById(this.getAttribute('data-copy'));
        if (!target) return;
        copyText(target.textContent.trim()).then(function (ok) { if (ok) flash(this); }.bind(this));
      });
    }

    window.Lang.onChange(function () {
      renderNow();
      renderResults();
    });
  }

  /* ---------------- init ---------------- */

  function init() {
    var param = null;
    try { param = new URLSearchParams(window.location.search).get('ts'); } catch (e) { /* noop */ }

    if (param && param.trim() !== '') {
      var r = parseTs(param, 'auto');
      if (!r.err) {
        els.tsInput.value = param.trim();
        setView(r.ms, 'ts');
      } else {
        setView(Date.now(), 'all');
      }
    } else {
      setView(Date.now(), 'all');
    }

    bindEvents();
    renderNow();
    setInterval(renderNow, 250);
  }

  init();
})();
