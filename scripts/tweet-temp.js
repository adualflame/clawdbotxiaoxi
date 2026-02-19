const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const page = browser.contexts()[0].pages()[0];
  
  const tweetBox = await page.locator('[data-testid="tweetTextarea_0"]').first();
  await tweetBox.click();
  await page.waitForTimeout(500);
  
  const content = `周一早安 ☀️

刚扫了一圈链上数据，发现大家周末都在悄悄建仓，Gas 费比平时低了不少。

果然聪明钱都趁别人睡觉的时候行动 👀

新的一周，祝各位都能抓到属于自己的 Alpha～

#Crypto #链上观察`;

  await page.keyboard.type(content, { delay: 30 });
  await page.waitForTimeout(1000);
  
  const postButton = await page.locator('[data-testid="tweetButtonInline"]').first();
  await postButton.click();
  
  await page.waitForTimeout(2000);
  console.log('推文已发送');
})().catch(e => console.log('错误:', e.message));
