#!/usr/bin/env python3
"""Twitter 市场情绪分析 - 修复版"""
import io, sys
from datetime import datetime
from playwright.sync_api import sync_playwright

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

KEYWORDS = ['BTC', 'ETH', 'SOL', 'AI agent']

def extract_tweets(page):
    """提取推文内容"""
    page.wait_for_timeout(4000)
    tweets = page.evaluate('''() => {
        const items = [];
        document.querySelectorAll('[data-testid="tweetText"]').forEach(el => {
            if (el.innerText) items.push(el.innerText.slice(0, 200));
        });
        return items.slice(0, 5);
    }''')
    return tweets

def analyze_sentiment(tweets):
    bullish = ['涨', '牛', 'bull', 'pump', 'moon', '抄底', 'buy', '看多', 'ATH', 'up', 'long']
    bearish = ['跌', '熊', 'bear', 'dump', 'crash', '割肉', 'sell', '看空', '崩', 'down', 'short']
    
    text = ' '.join(tweets).lower()
    bull = sum(1 for w in bullish if w in text)
    bear = sum(1 for w in bearish if w in text)
    
    total = bull + bear
    if total == 0: return 50, "中性"
    pct = int(bull / total * 100)
    return pct, "偏多" if pct >= 60 else "偏空" if pct <= 40 else "中性"

def run():
    p = sync_playwright().start()
    browser = p.chromium.connect_over_cdp('http://127.0.0.1:9222')
    page = browser.contexts[0].new_page()
    
    all_tweets = []
    results = {}
    
    for kw in KEYWORDS:
        page.goto(f'https://x.com/search?q={kw}&f=live', timeout=30000)
        tweets = extract_tweets(page)
        results[kw] = tweets[:2]
        all_tweets.extend(tweets)
    
    page.close()
    p.stop()
    
    pct, sentiment = analyze_sentiment(all_tweets)
    now = datetime.now().strftime('%Y-%m-%d %H:%M')
    
    print(f"📊 Twitter 市场情绪速报\n时间：{now}\n")
    print(f"🔥 话题：{', '.join(KEYWORDS)}")
    print(f"📈 情绪：{sentiment}（{pct}%看涨）\n")
    print("热门推文：")
    for kw, tweets in results.items():
        if tweets:
            print(f"\n[{kw}] {tweets[0][:100]}...")

if __name__ == "__main__":
    run()
