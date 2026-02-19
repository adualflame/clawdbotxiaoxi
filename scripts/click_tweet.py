from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp("http://127.0.0.1:9222")
    ctx = browser.contexts[0]
    page = [pg for pg in ctx.pages if "x.com" in pg.url][0]
    page.locator('[data-testid="tweetButton"]').click()
    print("clicked")
