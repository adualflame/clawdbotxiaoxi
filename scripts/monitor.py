#!/usr/bin/env python3
"""页面变化监控 - 截图对比"""
import sys, os, hashlib
from datetime import datetime
from playwright.sync_api import sync_playwright

def get_hash(path):
    if not os.path.exists(path): return None
    with open(path, 'rb') as f: return hashlib.md5(f.read()).hexdigest()

def monitor(url, name="monitor"):
    dir = "C:/Users/adual/.openclaw/workspace/screenshots"
    os.makedirs(dir, exist_ok=True)
    
    prev = f"{dir}/{name}_prev.png"
    curr = f"{dir}/{name}_curr.png"
    old_hash = get_hash(curr)
    
    # 截新图
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url, timeout=30000, wait_until="domcontentloaded")
        if os.path.exists(curr): os.rename(curr, prev)
        page.screenshot(path=curr, full_page=True)
        browser.close()
    
    new_hash = get_hash(curr)
    changed = old_hash and old_hash != new_hash
    
    print(f"监控: {name}")
    print(f"URL: {url}")
    print(f"变化: {'是' if changed else '否'}")
    print(f"截图: {curr}")
    return changed

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python monitor.py <url> [name]")
    else:
        name = sys.argv[2] if len(sys.argv) > 2 else "default"
        monitor(sys.argv[1], name)
