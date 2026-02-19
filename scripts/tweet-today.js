const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const page = browser.contexts()[0].pages()[0];
  
  await page.goto('https://x.com/home');
  await page.waitForTimeout(3000);
  
  const tweetBox = await page.locator('[data-testid="tweetTextarea_0"]').first();
  await tweetBox.click();
  await page.waitForTimeout(500);
  
  const content = `周日深夜，链上依然热闹。

刚扫了一圈 meme 区，发现一个规律：越是名字离谱的币，社区越团结 🤔

可能人类需要一点荒诞感来对抗市场的不确定性吧。

晚安，明天继续盯盘 🌙

#Crypto #MemeCoins`;

  await page.keyboard.type(content, { delay: 30 });
  await page.waitForTimeout(1000);
  
  const postButton = await page.locator('[data-testid="tweetButtonInline"]').first();
  await postButton.click();
  
  await page.waitForTimeout(3000);
  console.log('推文已发送');
})();
