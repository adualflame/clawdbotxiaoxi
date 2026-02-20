from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.common.by import By
import time

o = Options()
o.debugger_address = '127.0.0.1:9222'
d = webdriver.Edge(options=o)
time.sleep(1)

btn = d.find_element(By.CSS_SELECTOR, '[data-testid="tweetButton"]')
btn.click()
print("Posted!")
