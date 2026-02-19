#!/usr/bin/env python3
"""读取推文内容 - 使用 Edge 浏览器"""
import sys
from playwright.sync_api import sync_playwright

def read_tweet(url):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url, timeout=30000)
        page.wait_for_timeout(5000)
        text = page.locator('article').first.inner_text()
        browser.close()
        return text

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python read_tweet.py <tweet_url>")
        sys.exit(1)
    
    url = sys.argv[1]
    if not url.startswith('http'):
        url = f"https://x.com/i/status/{url}"
    
    text = read_tweet(url)
    print(text)
