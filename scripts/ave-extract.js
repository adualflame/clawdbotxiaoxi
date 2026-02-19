const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Opening Ave.ai...');
  await page.goto('https://ave.ai/token/0x1f6a5921477e6ce9408112206506d3a20275f091-bsc', { 
    waitUntil: 'networkidle',
    timeout: 60000 
  });
  
  await page.waitForTimeout(6000);
  
  // 滚动到交易区域
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(2000);
  
  // 获取页面所有文本内容
  const bodyText = await page.locator('body').textContent();
  
  // 提取交易相关信息
  const lines = bodyText.split('\n').filter(l => 
    l.includes('Buy') || l.includes('Sell') || l.includes('0x')
  );
  
  console.log('=== Trade-related lines ===');
  lines.slice(0, 30).forEach((l, i) => {
    const clean = l.trim().substring(0, 80);
    if (clean.length > 5) console.log(`${i}: ${clean}`);
  });
  
  await page.waitForTimeout(5000);
  await browser.close();
})();
