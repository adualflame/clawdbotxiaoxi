const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const page = browser.contexts()[0].pages()[0];
  
  await page.goto('https://x.com/xiaoxi_ai/status/2022273012901593214');
  await page.waitForTimeout(3000);
  
  const tweetText = await page.locator('[data-testid="tweetText"]').first().textContent();
  console.log('推文内容:', tweetText);
  console.log('字符编码:', JSON.stringify(tweetText));
})();
