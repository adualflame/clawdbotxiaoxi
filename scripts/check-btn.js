const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const page = browser.contexts()[0].pages()[0];
  
  // 检查各种可能的按钮选择器
  const selectors = [
    '[data-testid="tweetButtonInline"]',
    '[data-testid="tweetButton"]',
    'button[type="button"]'
  ];
  
  for (const sel of selectors) {
    const count = await page.locator(sel).count();
    console.log(sel, ':', count);
  }
  
  // 尝试直接点击发帖按钮
  const btn = await page.locator('[data-testid="tweetButtonInline"]').first();
  if (await btn.count() > 0) {
    await btn.click({ force: true });
    console.log('已强制点击发帖按钮');
  }
})().catch(e => console.log('错误:', e.message));
