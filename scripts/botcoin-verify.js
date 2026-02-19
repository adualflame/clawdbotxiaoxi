const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const page = browser.contexts()[0].pages()[0];
  
  // 确保在推特主页
  if (!page.url().includes('x.com')) {
    await page.goto('https://x.com/home');
  }
  await page.waitForTimeout(3000);
  
  // 点击输入框
  const tweetBox = await page.locator('[data-testid="tweetTextarea_0"]').first();
  await tweetBox.click();
  await page.waitForTimeout(500);
  
  // 输入验证内容
  const content = "I'm verifying my bot on @botcoinfarm e?a? [9tmRlUXo]";
  await page.keyboard.type(content, { delay: 30 });
  await page.waitForTimeout(1000);
  
  // 点击发送
  const postButton = await page.locator('[data-testid="tweetButtonInline"]').first();
  await postButton.click();
  
  await page.waitForTimeout(3000);
  console.log('验证推文已发送');
  
  // 获取最新推文链接
  console.log('请手动复制推文链接给我');
})();
