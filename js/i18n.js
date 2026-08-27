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
      'res.sub': '本地 · UTC · ISO 8601 · 相对时间 · 纪元统计',
      'meth.kicker': '方法论 · 口径说明',
      'meth.body': '本工具所有换算均在浏览器本地完成：时间戳按 ECMAScript Date 规则解析，支持秒 / 毫秒 / 微秒自动识别；「第几天 / 第几周 / 第几个月」以 1970-01-01 为第 1 天、按本地日历口径累计；ISO 周号遵循 ISO 8601 周日期体系（含当年首个星期四的那一周为第 1 周）。',
      'meth.disc': '说明：结果以浏览器所在时区与系统时钟为准；本页不发起任何网络请求，也不在服务器存储任何数据。',
      'donation.entry': '☕ 请作者喝杯咖啡',
      'donation.methods': '支付方式',
      'donation.title': '请作者喝杯咖啡 ☕',
      'donation.body': '如果这个小工具帮到了你，可以请作者喝杯咖啡。',
      'donation.alipay': '支付宝',
      'donation.wechat': '微信支付',
      'donation.launch': '打开支付宝',
      'donation.scanAlipay': '打开支付宝扫一扫',
      'donation.scanWechat': '打开微信扫一扫',
      'donation.notOpened': '没有自动打开？请使用支付宝 / 微信扫码',
      'donation.close': '关闭',
      'donation.qrAria': '收款二维码',
      'donation.qrError': '二维码生成失败，请刷新重试'
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
      'res.sub': 'Local · UTC · ISO 8601 · Relative · Epoch stats',
      'meth.kicker': 'Methodology & Notes',
      'meth.body': "All conversions run locally in your browser: timestamps are parsed under ECMAScript Date rules with auto detection of seconds / milliseconds / microseconds; day / week / month counters accumulate on the local calendar from 1970-01-01 (counted as day 1); ISO week numbers follow the ISO 8601 week-date system (week 1 is the week containing the year's first Thursday).",
      'meth.disc': "Note: results reflect the browser's local timezone and system clock; this page makes no network requests and stores no data server-side.",
      'donation.entry': '☕ Buy me a coffee',
      'donation.methods': 'Payment method',
      'donation.title': 'Buy me a coffee ☕',
      'donation.body': 'If this little tool helped you, you can buy the author a coffee.',
      'donation.alipay': 'Alipay',
      'donation.wechat': 'WeChat Pay',
      'donation.launch': 'Open Alipay',
      'donation.scanAlipay': 'Scan with Alipay',
      'donation.scanWechat': 'Scan with WeChat',
      'donation.notOpened': "Didn't open automatically? Scan the QR code instead.",
      'donation.close': 'Close',
      'donation.qrAria': 'Payment QR code',
      'donation.qrError': 'QR code failed to generate — please reload and try again'
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
