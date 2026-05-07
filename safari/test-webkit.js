// test-webkit.js
const { webkit } = require('playwright');

(async () => {
  const browser = await webkit.launch({
    headless: false
  });

  const context = await browser.newContext({
    // 标准桌面 Mac 浏览器尺寸
    viewport: { width: 1440, height: 900 },

    // 桌面屏幕缩放，Mac 常见是 2
    deviceScaleFactor: 2,

    // 桌面环境不要开移动端参数
    isMobile: false,
    hasTouch: false,

    // 模拟 macOS + Safari
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',

    // 可选：更像正常 Mac 用户环境
    locale: 'en-US',
    colorScheme: 'light'
  });

  const page = await context.newPage();
  await page.goto('https://example.com');
  await page.pause();
})();