import requests

def get_reddit_hot(sub='cryptocurrency', limit=5):
    r = requests.get(f'https://old.reddit.com/r/{sub}/.json?limit={limit}', 
                     headers={'User-Agent':'CryptoBot/1.0'})
    posts = r.json()['data']['children']
    return [{'title': p['data']['title'], 'score': p['data']['score']} for p in posts]

if __name__ == '__main__':
    for p in get_reddit_hot(limit=3):
        print(p['score'], p['title'][:40])
