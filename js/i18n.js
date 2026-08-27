/* ============================================================
   i18n — zh / en dictionaries, detection, switching, persistence
   ============================================================ */

(function () {
  'use strict';

  var DICTS = {
    zh: {
      'doc.title': '时间戳转换工具',
      'lang.zh': '切换到中文',
      'lang.en': '切换到英文',
      'now.title': '当前时间',
      'now.clock': '本地时间 · 实时',
      'conv.title': '双向转换',
      'ts2dt.title': '时间戳 → 日期时间',
      'dt2ts.title': '日期时间 → 时间戳',
      'label.timestamp': '时间戳',
      'label.unit': '单位',
      'label.date': '日期',
      'label.time': '时间（本地）',
      'unit.auto': '自动',
      'unit.s': '秒',
      'unit.ms': '毫秒',
      'unit.hint': '自动识别：不超过 11 位按秒，12–15 位按毫秒，16 位及以上按微秒',
      'btn.now': '采用当前时间',
      'placeholder.ts': '如 1760000000 或 1760000000000',
      'res.title': '转换结果',
      'res.local': '本地时间',
      'res.utc': 'UTC 时间',
      'res.iso': 'ISO 8601',
      'res.unixS': 'Unix 时间戳 · 秒',
      'res.unixMs': 'Unix 时间戳 · 毫秒',
      'res.rel': '相对现在',
      'stat.day': '第几天 · 自 1970-01-01',
      'stat.week': '第几周 · 自 1970-01-01',
      'stat.month': '第几个月 · 自 1970-01-01',
      'stat.doy': '年内第几天',
      'stat.isoweek': 'ISO 周号',
      'rel.now': '刚刚',
      'rel.in': '{n} {u}后',
      'rel.ago': '{n} {u}前',
      'relunit.sec': function () { return '秒'; },
      'relunit.min': function () { return '分钟'; },
      'relunit.hour': function () { return '小时'; },
      'relunit.day': function () { return '天'; },
      'relunit.year': function () { return '年'; },
      'err.invalid': '请输入有效的数字时间戳',
      'err.range': '超出可表示的日期范围',
      'copy.aria': '复制',
      'footer.note': '所有计算均在浏览器本地完成，无网络请求。',
      'donate.tag': '请我喝杯咖啡 ￥4.9',
      'donate.hint': '长按或保存二维码，感谢支持 ☕',
      'donate.alipay': '支付宝',
      'donate.wechat': '微信',
      'donate.alipayAlt': '支付宝收款二维码',
      'donate.wechatAlt': '微信收款二维码'
    },

    en: {
      'doc.title': 'Timestamp Converter',
      'lang.zh': 'Switch to Chinese',
      'lang.en': 'Switch to English',
      'now.title': 'Current time',
      'now.clock': 'Local time · live',
      'conv.title': 'Converter',
      'ts2dt.title': 'Timestamp → Date & time',
      'dt2ts.title': 'Date & time → Timestamp',
      'label.timestamp': 'Timestamp',
      'label.unit': 'Unit',
      'label.date': 'Date',
      'label.time': 'Time (local)',
      'unit.auto': 'Auto',
      'unit.s': 'Seconds',
      'unit.ms': 'Milliseconds',
      'unit.hint': 'Auto: up to 11 digits as seconds, 12–15 as milliseconds, 16+ as microseconds',
      'btn.now': 'Use current time',
      'placeholder.ts': 'e.g. 1760000000 or 1760000000000',
      'res.title': 'Result',
      'res.local': 'Local time',
      'res.utc': 'UTC time',
      'res.iso': 'ISO 8601',
      'res.unixS': 'Unix · seconds',
      'res.unixMs': 'Unix · milliseconds',
      'res.rel': 'Relative to now',
      'stat.day': 'Day · since 1970-01-01',
      'stat.week': 'Week · since 1970-01-01',
      'stat.month': 'Month · since 1970-01-01',
      'stat.doy': 'Day of year',
      'stat.isoweek': 'ISO week',
      'rel.now': 'now',
      'rel.in': 'in {n} {u}',
      'rel.ago': '{n} {u} ago',
      'relunit.sec': function (p) { return p.n === 1 ? 'second' : 'seconds'; },
      'relunit.min': function (p) { return p.n === 1 ? 'minute' : 'minutes'; },
      'relunit.hour': function (p) { return p.n === 1 ? 'hour' : 'hours'; },
      'relunit.day': function (p) { return p.n === 1 ? 'day' : 'days'; },
      'relunit.year': function (p) { return p.n === 1 ? 'year' : 'years'; },
      'err.invalid': 'Enter a valid numeric timestamp',
      'err.range': 'Out of representable date range',
      'copy.aria': 'Copy',
      'footer.note': 'All calculations run locally in your browser — no network requests.',
      'donate.tag': 'Buy me a coffee ￥4.9',
      'donate.hint': 'Long-press or save the QR code — thank you ☕',
      'donate.alipay': 'Alipay',
      'donate.wechat': 'WeChat',
      'donate.alipayAlt': 'Alipay QR code',
      'donate.wechatAlt': 'WeChat QR code'
    }
  };

  var STORAGE_KEY = 'ts-lang';
  var listeners = [];
  var lang = detect();

  function detect() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* private mode */ }
    if (saved === 'zh' || saved === 'en') return saved;
    var nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    return nav.indexOf('zh') === 0 ? 'zh' : 'en';
  }

  function t(key, params) {
    var dict = DICTS[lang] || DICTS.en;
    var val = dict.hasOwnProperty(key) ? dict[key]
            : (DICTS.en.hasOwnProperty(key) ? DICTS.en[key] : key);
    if (typeof val === 'function') val = val(params || {});
    if (params) {
      for (var k in params) {
        val = val.split('{' + k + '}').join(params[k]);
      }
    }
    return val;
  }

  function apply() {
    document.documentElement.lang = (lang === 'zh') ? 'zh-CN' : 'en';
    document.title = t('doc.title');

    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = t(nodes[i].getAttribute('data-i18n'));
    }
    nodes = document.querySelectorAll('[data-i18n-placeholder]');
    for (i = 0; i < nodes.length; i++) {
      nodes[i].placeholder = t(nodes[i].getAttribute('data-i18n-placeholder'));
    }
    nodes = document.querySelectorAll('[data-i18n-aria]');
    for (i = 0; i < nodes.length; i++) {
      nodes[i].setAttribute('aria-label', t(nodes[i].getAttribute('data-i18n-aria')));
    }
    nodes = document.querySelectorAll('[data-i18n-alt]');
    for (i = 0; i < nodes.length; i++) {
      nodes[i].setAttribute('alt', t(nodes[i].getAttribute('data-i18n-alt')));
    }
    nodes = document.querySelectorAll('[data-lang-btn]');
    for (i = 0; i < nodes.length; i++) {
      nodes[i].classList.toggle('active', nodes[i].getAttribute('data-lang-btn') === lang);
    }
  }

  function set(next) {
    if (next !== 'zh' && next !== 'en') return;
    if (next === lang) return;
    lang = next;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* private mode */ }
    apply();
    for (var i = 0; i < listeners.length; i++) listeners[i](lang);
  }

  window.Lang = {
    get: function () { return lang; },
    set: set,
    t: t,
    apply: apply,
    onChange: function (fn) { listeners.push(fn); }
  };

  apply();
})();
