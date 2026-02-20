from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.common.by import By
import time

o = Options()
o.debugger_address = '127.0.0.1:9222'
d = webdriver.Edge(options=o)
d.get('https://www.binance.com/en/alpha')
time.sleep(5)

# 点击代币列表/下拉菜单
try:
    # 找到代币选择器
    elems = d.find_elements(By.XPATH, "//*[contains(text(),'WMTX') or contains(text(),'Select')]")
    for e in elems[:3]:
        print(f"Found: {e.tag_name} - {e.text[:50]}")
        if e.is_displayed():
            e.click()
            time.sleep(2)
            break
except Exception as ex:
    print(f"Error: {ex}")

# 获取下拉列表中的代币
tokens = d.find_elements(By.XPATH, "//div[contains(@class,'dropdown')]//span | //li//span")
for t in tokens[:30]:
    if t.text and len(t.text) < 15:
        print(t.text)
