const { chromium } = require('playwright');

(async () => {
  // 使用 Edge 浏览器
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'msedge'
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Opening Twitter login with Edge...');
  await page.goto('https://twitter.com/login');
  
  console.log('\n=== 请手动登录 Twitter ===');
  console.log('登录成功后会自动保存状态');
  console.log('等待 5 分钟...\n');
  
  try {
    await page.waitForURL('**/home', { timeout: 300000 });
    console.log('登录成功！');
    
    await context.storageState({ path: 'twitter-auth.json' });
    console.log('状态已保存到 twitter-auth.json');
  } catch (e) {
    console.log('超时或出错:', e.message);
  }
  
  await browser.close();
})();
