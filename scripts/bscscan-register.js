const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Opening BSCScan...');
  await page.goto('https://bscscan.com/register');
  
  console.log('\n=== 请手动完成注册 ===');
  console.log('1. 填写用户名、邮箱、密码');
  console.log('2. 完成验证码');
  console.log('3. 注册成功后登录');
  console.log('4. 进入 API Keys 页面');
  console.log('\n浏览器会保持打开，完成后按 Ctrl+C 退出');
  
  // Keep browser open
  await new Promise(() => {});
})();
