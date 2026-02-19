const { chromium } = require('playwright');
const path = require('path');

(async () => {
  // 使用持久化上下文，保持登录状态
  const userDataDir = path.join(process.cwd(), 'twitter-profile');
  
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    channel: 'msedge',
    viewport: { width: 1280, height: 800 }
  });
  
  const page = context.pages()[0] || await context.newPage();
  
  console.log('Opening Twitter...');
  await page.goto('https://twitter.com');
  
  console.log('\n=== 浏览器已打开 ===');
  console.log('如果需要登录，请手动登录');
  console.log('登录后状态会自动保存');
  console.log('\n按 Ctrl+C 关闭\n');
  
  // 保持运行
  await new Promise(() => {});
})();
