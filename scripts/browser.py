#!/usr/bin/env python3
"""浏览器自动化工具 - 截图/快照/交互"""
import sys, json, io
from playwright.sync_api import sync_playwright

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

class Browser:
    def __init__(self):
        self.pw = sync_playwright().start()
        self.browser = self.pw.chromium.launch(headless=True)
        self.page = self.browser.new_page()
    
    def open(self, url):
        self.page.goto(url, timeout=30000, wait_until="domcontentloaded")
        return f"已打开: {self.page.title()}"
    
    def snapshot(self):
        """获取页面交互元素"""
        elements = self.page.evaluate('''() => {
            const items = [];
            document.querySelectorAll('a, button, input, textarea, select, [role="button"]').forEach((el, i) => {
                const text = el.innerText?.slice(0,50) || el.placeholder || el.value || '';
                const tag = el.tagName.toLowerCase();
                if (text || tag === 'input') items.push({ref: 'e'+i, tag, text: text.trim()});
            });
            return items.slice(0, 30);
        }''')
        return elements
    
    def click(self, ref):
        idx = int(ref.replace('e','').replace('@',''))
        el = self.page.query_selector_all('a, button, input, textarea, select, [role="button"]')[idx]
        el.click()
        return f"已点击 @{ref}"
    
    def fill(self, ref, text):
        idx = int(ref.replace('e','').replace('@',''))
        el = self.page.query_selector_all('a, button, input, textarea, select, [role="button"]')[idx]
        el.fill(text)
        return f"已填写 @{ref}: {text}"
    
    def screenshot(self, path="screenshot.png"):
        self.page.screenshot(path=path, full_page=True)
        return f"截图已保存: {path}"
    
    def text(self):
        return self.page.inner_text("body")[:2000]
    
    def close(self):
        self.browser.close()
        self.pw.stop()

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("用法: python browser.py <url> <命令> [参数]")
        print("命令: snapshot, screenshot [path], click <ref>, fill <ref> <text>, text")
        sys.exit(1)
    
    b = Browser()
    url, cmd = sys.argv[1], sys.argv[2]
    b.open(url)
    
    try:
        if cmd == "snapshot":
            print(json.dumps(b.snapshot(), ensure_ascii=False, indent=2))
        elif cmd == "screenshot":
            print(b.screenshot(sys.argv[3] if len(sys.argv)>3 else "screenshot.png"))
        elif cmd == "click" and len(sys.argv) > 3:
            print(b.click(sys.argv[3]))
        elif cmd == "fill" and len(sys.argv) > 4:
            print(b.fill(sys.argv[3], sys.argv[4]))
        elif cmd == "text":
            print(b.text())
        else:
            print(f"参数不足: {cmd}")
    finally:
        b.close()
