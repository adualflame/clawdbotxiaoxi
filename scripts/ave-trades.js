const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Opening Ave.ai...');
  await page.goto('https://ave.ai/token/0x1f6a5921477e6ce9408112206506d3a20275f091-bsc', { 
    waitUntil: 'domcontentloaded',
    timeout: 60000 
  });
  
  await page.waitForTimeout(5000);
  console.log('Page loaded');
  
  // Try to find and click on trades/transactions tab
  const tabs = await page.locator('text=/Trade|交易|Txns|Transactions/i').all();
  console.log(`Found ${tabs.length} potential trade tabs`);
  
  if (tabs.length > 0) {
    await tabs[0].click();
    await page.waitForTimeout(3000);
  }
  
  // Screenshot the trades section
  await page.screenshot({ path: 'ave-trades.png', fullPage: false });
  console.log('Trades screenshot saved');
  
  // Get page content for analysis
  const content = await page.content();
  console.log('Page content length:', content.length);
  
  // Look for holder/trader info
  const holderTab = await page.locator('text=/Holder|持仓|Top/i').all();
  console.log(`Found ${holderTab.length} holder tabs`);
  
  if (holderTab.length > 0) {
    await holderTab[0].click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'ave-holders.png', fullPage: false });
    console.log('Holders screenshot saved');
  }
  
  console.log('\nKeeping browser open for 30 seconds...');
  await page.waitForTimeout(30000);
  
  await browser.close();
})();
