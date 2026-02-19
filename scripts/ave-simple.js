const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('https://ave.ai/token/0x1f6a5921477e6ce9408112206506d3a20275f091-bsc');
  await page.waitForTimeout(10000);
  
  await page.screenshot({ path: 'ave-1.png' });
  console.log('Screenshot 1 done');
  
  // 滚动并截图
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'ave-2.png' });
  console.log('Screenshot 2 done');
  
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'ave-3.png' });
  console.log('Screenshot 3 done');
  
  console.log('Done. Check screenshots.');
  await browser.close();
})();
