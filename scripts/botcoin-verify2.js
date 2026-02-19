const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const page = browser.contexts()[0].pages()[0];
  
  await page.goto('https://x.com/home');
  await page.waitForTimeout(3000);
  
  // 点击输入框
  const tweetBox = await page.locator('[data-testid="tweetTextarea_0"]').first();
  await tweetBox.click();
  await page.waitForTimeout(500);
  
  // 用直引号，不用弯引号
  const content = "I'm verifying my bot on @botcoinfarm e?a? [9tmRlUXo]";
  
  // 逐字符输入，避免自动替换
  for (const char of content) {
    await page.keyboard.press(char === "'" ? "Quote" : char);
    if (char !== "'") {
      await page.keyboard.type(char, { delay: 20 });
    }
  }
  
  await page.waitForTimeout(1000);
  console.log('内容已输入，请检查后手动点发送');
})();
