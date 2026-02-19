const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Opening Ave.ai...');
  await page.goto('https://ave.ai/token/0x1f6a5921477e6ce9408112206506d3a20275f091-bsc', { 
    waitUntil: 'networkidle',
    timeout: 60000 
  });
  
  await page.waitForTimeout(5000);
  
  // 滚动页面找交易记录
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'ave-scroll1.png' });
  console.log('Screenshot 1 saved');
  
  // 继续滚动
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'ave-scroll2.png' });
  console.log('Screenshot 2 saved');
  
  // 查找包含地址的元素
  const addrElements = await page.locator('text=/0x[a-fA-F0-9]{6}/').all();
  console.log(`Found ${addrElements.length} address elements`);
  
  // 提取前20个地址
  for (let i = 0; i < Math.min(addrElements.length, 20); i++) {
    const text = await addrElements[i].textContent().catch(() => '');
    if (text.includes('0x')) {
      console.log(`Addr ${i}: ${text.trim().substring(0, 50)}`);
    }
  }
  
  await page.waitForTimeout(10000);
  await browser.close();
})();
