const { chromium } = require('playwright');
const readline = require('readline');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Opening Twitter...');
  await page.goto('https://twitter.com/login');
  console.log('Twitter opened. Please login manually.');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('\nPress Enter after login to save state...', async () => {
    try {
      await context.storageState({ path: 'twitter-auth.json' });
      console.log('Auth saved to twitter-auth.json');
    } catch (e) {
      console.log('Error saving:', e.message);
    }
    await browser.close();
    rl.close();
  });
})();
