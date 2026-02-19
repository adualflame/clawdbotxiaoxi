#!/usr/bin/env python3
"""连接已登录Edge浏览Twitter"""
import sys, io
from playwright.sync_api import sync_playwright

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def browse(action="timeline", query=None):
    p = sync_playwright().start()
    browser = p.chromium.connect_over_cdp("http://127.0.0.1:9222")
    ctx = browser.contexts[0]
    page = ctx.new_page()
    
    if action == "timeline":
        page.goto("https://x.com/home", timeout=30000)
    elif action == "search":
        page.goto(f"https://x.com/search?q={query}&f=live", timeout=30000)
    elif action == "user":
        page.goto(f"https://x.com/{query}", timeout=30000)
    
    page.wait_for_timeout(3000)
    
    # 抓取推文
    tweets = page.query_selector_all('article[data-testid="tweet"]')
    for i, t in enumerate(tweets[:5]):
        print(f"--- 推文 {i+1} ---")
        print(t.inner_text()[:300])
        print()
    
    # 不关闭页面，保持打开
    print("页面已打开，保持运行中...")

if __name__ == "__main__":
    action = sys.argv[1] if len(sys.argv) > 1 else "timeline"
    query = sys.argv[2] if len(sys.argv) > 2 else None
    browse(action, query)
