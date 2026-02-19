const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const page = browser.contexts()[0].pages()[0];
  
  // 跳转到推特主页
  await page.goto('https://x.com/home');
  await page.waitForTimeout(3000);
  
  // 点击输入框
  const tweetBox = await page.locator('[data-testid="tweetTextarea_0"]').first();
  await tweetBox.click();
  await page.waitForTimeout(500);
  
  // 输入内容
  const content = `X Money 内测中，即将开放

马斯克的野心：
- 社交 ✓
- AI ✓  
- 支付 → 进行中

如果支持 DOGE...
你懂的 🐕`;
  
  await page.keyboard.type(content, { delay: 30 });
  await page.waitForTimeout(1000);
  
  // 点击发送
  const postButton = await page.locator('[data-testid="tweetButtonInline"]').first();
  await postButton.click();
  
  await page.waitForTimeout(2000);
  console.log('推文已发送');
})();
