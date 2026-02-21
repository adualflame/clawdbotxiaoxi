import requests
import xml.etree.ElementTree as ET

FEEDS = {
    'cointelegraph': 'https://cointelegraph.com/rss',
    'coindesk': 'https://www.coindesk.com/arc/outboundfeeds/rss/',
}

def get_news(source='cointelegraph', limit=5):
    r = requests.get(FEEDS[source], timeout=10)
    root = ET.fromstring(r.text)
    items = root.findall('.//item')[:limit]
    return [{'title': i.find('title').text, 'link': i.find('link').text} for i in items]

if __name__ == '__main__':
    for n in get_news('cointelegraph', 3):
        print(n['title'][:50])
