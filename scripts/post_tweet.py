from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.common.by import By
import time

tweet = """🤖 Virtuals 生态持续活跃，TIBBIR 单日 +20%

AI Agent 从概念到落地，正在经历第一轮洗牌。

能跑出来的项目有两个特征：
1. 有真实使用场景
2. 社区不只是喊单

你在关注哪些 AI 项目？"""

o = Options()
o.debugger_address = '127.0.0.1:9222'
d = webdriver.Edge(options=o)
d.get('https://x.com/compose/post')
time.sleep(4)

# 关闭可能的弹窗
try:
    mask = d.find_elements(By.CSS_SELECTOR, '[data-testid="mask"]')
    if mask:
        d.execute_script("arguments[0].remove()", mask[0])
except:
    pass

time.sleep(1)
box = d.find_element(By.CSS_SELECTOR, '[data-testid="tweetTextarea_0"]')
d.execute_script("arguments[0].focus()", box)
box.send_keys(tweet)
print("Done")
