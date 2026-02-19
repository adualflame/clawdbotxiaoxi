const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('Fetching Binance Alpha list from Foresight News...');
  await page.goto('https://foresightnews.pro/article/detail/78553', {
    waitUntil: 'networkidle',
    timeout: 30000
  });
  
  await page.waitForTimeout(3000);
  
  // 获取文章内容
  const content = await page.evaluate(() => {
    const article = document.querySelector('article') || document.querySelector('.article-content') || document.body;
    return article.innerText;
  });
  
  console.log('\n=== Content ===\n');
  console.log(content.substring(0, 5000));
  
  await browser.close();
})();
