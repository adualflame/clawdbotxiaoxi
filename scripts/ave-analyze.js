const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Opening Ave.ai...');
  await page.goto('https://ave.ai/token/0x1f6a5921477e6ce9408112206506d3a20275f091-bsc', { 
    waitUntil: 'domcontentloaded',
    timeout: 60000 
  });
  
  await page.waitForTimeout(6000);
  
  // 点击 Trade 标签
  const tradeTab = await page.locator('text=/^Trade$/i').first();
  if (tradeTab) {
    await tradeTab.click();
    await page.waitForTimeout(3000);
  }
  
  // 提取交易表格数据
  const rows = await page.locator('table tbody tr').all();
  console.log(`Found ${rows.length} trade rows`);
  
  const trades = [];
  for (let i = 0; i < Math.min(rows.length, 30); i++) {
    const row = rows[i];
    const text = await row.textContent();
    trades.push(text);
  }
  
  console.log('\n=== Recent Trades ===');
  trades.forEach((t, i) => console.log(`${i+1}: ${t.substring(0, 150)}`));
  
  // 分析地址出现频率
  const addressPattern = /0x[a-fA-F0-9]{4,}/g;
  const allAddresses = trades.join(' ').match(addressPattern) || [];
  
  const addressCount = {};
  allAddresses.forEach(addr => {
    addressCount[addr] = (addressCount[addr] || 0) + 1;
  });
  
  console.log('\n=== Address Frequency ===');
  Object.entries(addressCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([addr, count]) => {
      console.log(`${addr}: ${count} times`);
    });
  
  await page.waitForTimeout(10000);
  await browser.close();
})();
