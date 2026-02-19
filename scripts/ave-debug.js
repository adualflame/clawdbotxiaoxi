const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Opening Ave.ai...');
  await page.goto('https://ave.ai/token/0x1f6a5921477e6ce9408112206506d3a20275f091-bsc', { 
    waitUntil: 'networkidle',
    timeout: 60000 
  });
  
  await page.waitForTimeout(8000);
  console.log('Page loaded');
  
  // 截图当前页面
  await page.screenshot({ path: 'ave-main.png' });
  
  // 获取所有可点击元素
  const buttons = await page.locator('button, [role="tab"], .tab').all();
  console.log(`Found ${buttons.length} buttons/tabs`);
  
  for (let i = 0; i < Math.min(buttons.length, 10); i++) {
    const text = await buttons[i].textContent().catch(() => '');
    console.log(`Button ${i}: ${text.trim().substring(0, 30)}`);
  }
  
  // 直接获取页面上的表格数据
  const tables = await page.locator('table').all();
  console.log(`\nFound ${tables.length} tables`);
  
  if (tables.length > 0) {
    const tableText = await tables[0].textContent();
    console.log('\nFirst table content (first 500 chars):');
    console.log(tableText.substring(0, 500));
  }
  
  await page.waitForTimeout(15000);
  await browser.close();
})();
