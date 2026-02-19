const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Opening Ave.ai...');
  await page.goto('https://ave.ai/token/0x1f6a5921477e6ce9408112206506d3a20275f091-bsc', { 
    waitUntil: 'domcontentloaded',
    timeout: 60000 
  });
  
  console.log('Page loaded, waiting for content...');
  await page.waitForTimeout(5000);
  
  console.log('Taking screenshot...');
  await page.screenshot({ path: 'ave-token.png', fullPage: false });
  console.log('Screenshot saved to ave-token.png');
  
  // Keep browser open for manual inspection
  console.log('\nBrowser will stay open for 60 seconds...');
  await page.waitForTimeout(60000);
  
  await browser.close();
})();
