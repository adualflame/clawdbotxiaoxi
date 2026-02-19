const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Opening Twitter login...');
  await page.goto('https://twitter.com/login');
  
  console.log('\n=== 请手动登录 Twitter ===');
  console.log('登录成功后，我会自动保存登录状态');
  console.log('等待 60 秒...\n');
  
  // 等待登录完成（检测首页元素）
  try {
    await page.waitForURL('**/home', { timeout: 300000 });
    console.log('检测到登录成功！');
    
    // 保存登录状态
    await context.storageState({ path: 'twitter-auth.json' });
    console.log('登录状态已保存到 twitter-auth.json');
  } catch (e) {
    console.log('超时，请重试');
  }
  
  await browser.close();
})();
