const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const page = browser.contexts()[0].pages()[0];
  
  // 点击发推输入框
  const tweetBox = await page.locator('[data-testid="tweetTextarea_0"]').first();
  await tweetBox.click();
  await page.keyboard.type('测试推文 - 这是小晰自动发的，如果你看到请忽略 🤖', { delay: 50 });
  
  console.log('已填入内容，请检查 Edge 窗口');
})();
