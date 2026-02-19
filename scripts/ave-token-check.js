const { chromium } = require('playwright');

// ========== 配置区 ==========
const TOKEN_ADDRESS = '0x1f6a5921477e6ce9408112206506d3a20275f091';
const CHAIN = 'bsc';  // bsc, eth, arb, polygon 等
// ============================

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const url = `https://ave.ai/token/${TOKEN_ADDRESS}-${CHAIN}`;
  console.log(`Opening: ${url}`);
  
  await page.goto(url);
  await page.waitForTimeout(10000);
  
  await page.screenshot({ path: 'ave-1.png' });
  console.log('Screenshot 1: Overview');
  
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'ave-2.png' });
  console.log('Screenshot 2: Trades');
  
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'ave-3.png' });
  console.log('Screenshot 3: More');
  
  console.log('Done. Check ave-1/2/3.png');
  await browser.close();
})();
