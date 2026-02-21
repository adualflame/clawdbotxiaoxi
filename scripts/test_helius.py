import requests
import time

url = 'https://mainnet.helius-rpc.com/?api-key=test'
times = []

for i in range(5):
    start = time.time()
    r = requests.post(url, json={'jsonrpc':'2.0','id':1,'method':'getSlot'})
    t = (time.time() - start) * 1000
    times.append(t)
    slot = r.json().get('result', 'err')
    print(f"Test {i+1}: {t:.0f}ms, slot={slot}")

print(f"Avg: {sum(times)/len(times):.0f}ms")
