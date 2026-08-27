/* Donation feature E2E — local Playwright (npx cache) + jsQR decode.
   Run: node test/e2e-donation.js  (expects dev server on 127.0.0.1:63647) */

'use strict';

/* Deps (playwright, pngjs, jsqr) are dev-only; install them with npm or
   point NODE_PATH at existing copies, e.g.
   NODE_PATH="<playwright-dir>:<pngjs/jsqr-dir>" node test/e2e-donation.js */
const { chromium } = require('playwright');
const { PNG } = require('pngjs');
const jsQR = require('jsqr');

const BASE = 'http://127.0.0.1:63647/';
const ALIPAY = 'https://qr.alipay.com/fkx16432isyyhmx9ttwpi79';
const WECHAT = 'wxp://f2f1fJpOcJc7F-MSeLMxALhc6tWu-oohtxueHRbCe98bMy2AmDunimuOJFv-8bjobLBM';

let passed = 0, failed = 0;
function ok(cond, name) {
  if (cond) { passed++; console.log('  PASS ' + name); }
  else { failed++; console.log('  FAIL ' + name); }
}

async function decodeQr(page) {
  const buf = await page.locator('#donation-qr svg').screenshot();
  const png = PNG.sync.read(Buffer.from(buf));
  const res = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  return res ? res.data : null;
}

async function desktopFlow() {
  console.log('== desktop (zh) ==');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, locale: 'zh-CN' });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));

  await page.goto(BASE);
  await page.waitForLoadState('domcontentloaded');

  ok(await page.locator('#donation-entry').textContent() === '☕ 请作者喝杯咖啡', 'footer entry text (zh)');
  ok(await page.locator('#donation-dialog').isHidden(), 'dialog initially hidden');
  ok(await page.locator("script[src*='qrcode']").count() === 0, 'QR lib not loaded before first open');

  await page.click('#donation-entry');
  await page.waitForSelector('#donation-dialog:not([hidden])');
  ok(await page.locator('#donation-title').textContent() === '请作者喝杯咖啡 ☕', 'title (zh)');
  ok((await page.locator('.donation-method.active').textContent()) === '支付宝', 'alipay default');
  ok((await page.locator('#donation-hint').textContent()) === '打开支付宝扫一扫', 'hint (zh, alipay)');
  ok(await page.locator('#donation-launch').isHidden(), 'no launch affordance on desktop');
  ok(await page.locator("script[src*='qrcode']").count() === 1, 'QR lib lazy-loaded on open');
  ok(await page.locator('#donation-qr svg').getAttribute('fill') === '#111111', 'QR dark-on-light');
  ok(await decodeQr(page) === ALIPAY, 'alipay QR decodes to payment URL');

  await page.click('.donation-method[data-method="wechat"]');
  await page.waitForTimeout(100);
  ok((await page.locator('.donation-method.active').textContent()) === '微信支付', 'wechat switch active');
  ok((await page.locator('#donation-hint').textContent()) === '打开微信扫一扫', 'hint (zh, wechat)');
  ok(await decodeQr(page) === WECHAT, 'wechat QR decodes to payment URL');

  // ESC close + focus restore
  await page.keyboard.press('Escape');
  ok(await page.locator('#donation-dialog').isHidden(), 'ESC closes dialog');
  const activeId1 = await page.evaluate(() => document.activeElement && document.activeElement.id);
  ok(activeId1 === 'donation-entry', 'focus restored to entry');

  // overlay click close
  await page.click('#donation-entry');
  await page.waitForSelector('#donation-dialog:not([hidden])');
  await page.mouse.click(30, 30); // overlay area outside the box
  await page.waitForTimeout(100);
  ok(await page.locator('#donation-dialog').isHidden(), 'overlay click closes dialog');

  // language switch re-renders dialog texts
  await page.click('.lang-btn[data-lang-btn="en"]');
  await page.waitForTimeout(100);
  ok(await page.locator('#donation-entry').textContent() === '☕ Buy me a coffee', 'entry text (en)');
  await page.click('#donation-entry');
  await page.waitForSelector('#donation-dialog:not([hidden])');
  ok(await page.locator('#donation-title').textContent() === 'Buy me a coffee ☕', 'title (en)');
  ok((await page.locator('#donation-hint').textContent()) === 'Scan with Alipay', 'hint (en, alipay)');
  await page.keyboard.press('Escape');

  ok(errors.length === 0, 'no page errors (' + (errors[0] || 'clean') + ')');
  await browser.close();
}

async function mobileFlow() {
  console.log('== mobile (iPhone UA, en) ==');
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    locale: 'en-US',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });
  const page = await ctx.newPage();

  await page.goto(BASE);
  await page.waitForLoadState('domcontentloaded');
  ok(await page.locator('#donation-entry').textContent() === '☕ Buy me a coffee', 'entry text browser-lang en');

  // no horizontal scroll on narrow screen
  const overflowX = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  ok(!overflowX, 'no horizontal overflow at 390px');

  await page.click('#donation-entry');
  await page.waitForSelector('#donation-dialog:not([hidden])');
  ok(await page.locator('#donation-launch').isVisible(), 'mobile+alipay shows launch link');
  ok(await page.locator('#donation-launch').getAttribute('href') === ALIPAY, 'launch href is plain https URL');
  ok(await decodeQr(page) === ALIPAY, 'mobile alipay QR decodes');

  // launch click: page stays visible -> notOpened hint after grace
  await page.click('#donation-launch');
  await page.waitForTimeout(2000);
  ok((await page.locator('#donation-hint').textContent()) === "Didn't open automatically? Scan the QR code instead.", 'notOpened hint after failed handoff');
  ok(await page.locator('#donation-qr svg').count() === 1, 'QR still visible as fallback');

  // wechat on mobile: never tries wxp://, QR directly
  await page.click('.donation-method[data-method="wechat"]');
  await page.waitForTimeout(100);
  ok(await page.locator('#donation-launch').isHidden(), 'no launch link for wechat');
  ok((await page.locator('#donation-hint').textContent()) === 'Scan with WeChat', 'hint (en, wechat)');
  ok(await decodeQr(page) === WECHAT, 'mobile wechat QR decodes');

  const boxOverflow = await page.evaluate(() => {
    const el = document.querySelector('.donation-box');
    return el.scrollWidth > el.clientWidth || document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  ok(!boxOverflow, 'dialog fits narrow screen');

  await browser.close();
}

(async () => {
  try {
    await desktopFlow();
    await mobileFlow();
  } catch (e) {
    failed++;
    console.log('  FATAL ' + e.message);
  }
  console.log('\n' + passed + ' passed, ' + failed + ' failed');
  process.exit(failed ? 1 : 0);
})();
