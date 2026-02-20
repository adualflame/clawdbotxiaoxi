from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

o = Options()
o.debugger_address = '127.0.0.1:9222'
d = webdriver.Edge(options=o)
d.get('https://www.binance.com/en/alpha')
time.sleep(4)

# 按ESC关闭弹窗
d.find_element(By.TAG_NAME, 'body').send_keys(Keys.ESCAPE)
time.sleep(1)

# 找包含代币名的元素并点击
elems = d.find_elements(By.XPATH, "//div[contains(@class,'text-[20px]')]")
for e in elems:
    if e.text and len(e.text) < 10:
        print(f"Click: {e.text}")
        e.click()
        break
time.sleep(2)

# 获取下拉列表
items = d.find_elements(By.XPATH, "//div[contains(@class,'overflow-y-auto')]//div")
for item in items[:50]:
    t = item.text.strip()
    if t and '/' not in t and len(t) < 15:
        print(t)
