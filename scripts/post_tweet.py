from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.common.by import By
import time

o = Options()
o.debugger_address = '127.0.0.1:9222'
d = webdriver.Edge(options=o)
time.sleep(2)

elems = d.find_elements(By.CSS_SELECTOR, '[role="textbox"]')
print(f"Found {len(elems)} textbox")
if elems:
    elems[0].click()
    time.sleep(0.5)
    elems[0].send_keys("SOL 稳在 $83，生态持续发力。JUP、PENGU 都在 Solana 上，这条链的故事还长。")
    print("Tweet typed")
