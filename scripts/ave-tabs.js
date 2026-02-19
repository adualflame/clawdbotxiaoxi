const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('https://ave.ai/token/0x1f6a5921477e6ce9408112206506d3a20275f091-bsc', { 
    waitUntil: 'networkidle',
    timeout: 60000 
  });
  
  await page.waitForTimeout(8000);
  
  // 点击 Holders 标签
  const holdersTab = page.locator('text=Holders');
  await holdersTab.first().click().catch(() => console.log('Holders tab not found'));
  await page.waitForTimeout(3000);
  
  await page.screenshot({ path: 'ave-holders-detail.png', fullPage: false });
  console.log('Holders screenshot saved');
  
  // 点击 Transactions 标签
  const txTab = page.locator('text=Transactions');
  await txTab.first().click().catch(() => console.log('Tx tab not found'));
  await page.waitForTimeout(3000);
  
  await page.screenshot({ path: 'ave-tx-detail.png', fullPage: false });
  console.log('Transactions screenshot saved');
  
  await page.waitForTimeout(10000);
  await browser.close();
})();
