from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.common.by import By
import time

o = Options()
o.debugger_address = '127.0.0.1:9222'
d = webdriver.Edge(options=o)
time.sleep(2)

# 获取简介
bio = d.find_elements(By.CSS_SELECTOR, '[data-testid="UserDescription"]')
if bio:
    print("Bio:", bio[0].text)

# 获取最近推文
tweets = d.find_elements(By.CSS_SELECTOR, '[data-testid="tweetText"]')
for i, t in enumerate(tweets[:3]):
    print(f"Tweet {i+1}:", t.text[:200])
