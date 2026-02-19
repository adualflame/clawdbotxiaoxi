const { chromium } = require('playwright');

async function sendTweet(content) {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const page = browser.contexts()[0].pages()[0];
  
  // 确保在主页
  if (!page.url().includes('x.com/home')) {
    await page.goto('https://x.com/home');
    await page.waitForTimeout(2000);
  }
  
  // 点击输入框
  const tweetBox = await page.locator('[data-testid="tweetTextarea_0"]').first();
  await tweetBox.click();
  await page.waitForTimeout(500);
  
  // 输入内容
  await page.keyboard.type(content, { delay: 30 });
  await page.waitForTimeout(1000);
  
  // 点击发送
  const postButton = await page.locator('[data-testid="tweetButtonInline"]').first();
  await postButton.click();
  
  await page.waitForTimeout(2000);
  console.log('推文已发送:', content.substring(0, 50) + '...');
}

const content = process.argv[2];
if (!content) {
  console.log('用法: node tweet.js "推文内容"');
  process.exit(1);
}

sendTweet(content).catch(console.error);
