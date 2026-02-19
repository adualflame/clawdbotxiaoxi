import urllib.request
import json

ids = 'hyperliquid,jupiter-exchange-solana,ondo-finance,render-token,eigenlayer,pyth-network'
url = f'https://api.coingecko.com/api/v3/simple/price?ids={ids}&vs_currencies=usd'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
data = json.loads(urllib.request.urlopen(req, timeout=15).read())

names = {'hyperliquid': 'HYPE', 'jupiter-exchange-solana': 'JUP', 'ondo-finance': 'ONDO', 
         'render-token': 'RENDER', 'eigenlayer': 'EIGEN', 'pyth-network': 'PYTH'}
for k, v in names.items():
    print(f"{v}: ${data.get(k, {}).get('usd', 'N/A')}")
