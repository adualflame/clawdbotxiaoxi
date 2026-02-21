import requests

def get_top_tvl(limit=5):
    r = requests.get('https://api.llama.fi/protocols')
    top = sorted([p for p in r.json() if p.get('tvl')], key=lambda x:x['tvl'], reverse=True)[:limit]
    return [{'name':p['name'], 'tvl':round(p['tvl']/1e9,2), 'change_1d':p.get('change_1d',0)} for p in top]

def get_protocol_tvl(name):
    r = requests.get(f'https://api.llama.fi/tvl/{name}')
    return round(r.json()/1e9, 2) if r.ok else None

def get_chains_tvl():
    r = requests.get('https://api.llama.fi/v2/chains')
    top = sorted(r.json(), key=lambda x:x.get('tvl',0), reverse=True)[:5]
    return [{'name':c['name'], 'tvl':round(c['tvl']/1e9,2)} for c in top]

if __name__ == '__main__':
    print('Top TVL:', get_top_tvl(3))
    print('Chains:', get_chains_tvl())
