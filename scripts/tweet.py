#!/usr/bin/env python3
"""用已登录的 Edge 发推文 - 通过 CDP 连接"""
import sys, time
from playwright.sync_api import sync_playwright

def tweet(text):
    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp("http://127.0.0.1:9222")
        ctx = browser.contexts[0]
        page = ctx.new_page()
        page.goto("https://x.com/home", timeout=60000)
        time.sleep(2)
        # 点击首页的发推按钮
        page.locator('[data-testid="SideNav_NewTweet_Button"]').click()
        time.sleep(1)
        page.wait_for_selector('[data-testid="tweetTextarea_0"]', timeout=10000)
        time.sleep(0.5)
        # 输入内容
        page.keyboard.type(text, delay=50)
        time.sleep(2)
        # 等待按钮可用再点击
        page.wait_for_selector('[data-testid="tweetButton"]:not([disabled])', timeout=10000)
        page.evaluate('document.querySelector(\'[data-testid="tweetButton"]\').click()')
        time.sleep(3)
        page.close()
        print("OK")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python tweet.py '推文内容'")
        sys.exit(1)
    tweet(sys.argv[1])
