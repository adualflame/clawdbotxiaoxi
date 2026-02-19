const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const page = browser.contexts()[0].pages()[0];
  
  // 查找所有带 testid 的按钮
  const buttons = await page.locator('[data-testid]').all();
  
  for (const btn of buttons) {
    const testid = await btn.getAttribute('data-testid');
    if (testid && testid.toLowerCase().includes('tweet')) {
      const text = await btn.textContent().catch(() => '');
      console.log(`找到: ${testid} - ${text.substring(0, 30)}`);
    }
  }
})();
