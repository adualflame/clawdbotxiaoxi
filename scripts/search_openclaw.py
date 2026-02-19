#!/usr/bin/env python3
"""搜索OpenClaw相关推文"""
import io, sys
from playwright.sync_api import sync_playwright

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

p = sync_playwright().start()
browser = p.chromium.connect_over_cdp('http://127.0.0.1:9222')
page = browser.contexts[0].new_page()
page.goto('https://x.com/search?q=openclaw&f=live', timeout=30000)
page.wait_for_timeout(4000)

tweets = page.evaluate('''() => {
    const items = [];
    document.querySelectorAll('[data-testid="tweetText"]').forEach(el => {
        if (el.innerText) items.push(el.innerText.slice(0, 300));
    });
    return items.slice(0, 8);
}''')

for i, t in enumerate(tweets):
    print(f'{i+1}. {t[:200]}')

page.close()
p.stop()
