import requests
import json

# CoinGecko ID 映射
TOKENS = {
    'HYPE': 'hyperliquid',
    'ONDO': 'ondo-finance', 
    'MNT': 'mantle',
    'UXLINK': 'uxlink',
    'PENGU': 'pudgy-penguins',
    'APX': 'apollox-2',
    'VIRTUAL': 'virtual-protocol',
    'AIXBT': 'aixbt',
    'CGPT': 'chaingpt',
    'ai16z': 'ai16z',
    'ME': 'magic-eden',
    'USUAL': 'usual',
    'COOKIE': 'cookie',
    'ZEREBRO': 'zerebro',
    'GEAR': 'gearbox',
    'TAO': 'bittensor',
    'SUI': 'sui',
    'ARB': 'arbitrum',
    'JUP': 'jupiter-exchange-solana',
    'SOL': 'solana'
}

ids = ','.join(TOKENS.values())
r = requests.get(f'https://api.coingecko.com/api/v3/simple/price?ids={ids}&vs_currencies=usd&include_24hr_change=true')
data = r.json()

print("币安Alpha代币最新价格:\n")
for symbol, cg_id in TOKENS.items():
    if cg_id in data:
        price = data[cg_id].get('usd', 0)
        change = data[cg_id].get('usd_24h_change', 0)
        print(f"{symbol}: ${price:.6f} ({change:+.1f}%)")
