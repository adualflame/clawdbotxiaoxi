import requests

BOT_TOKEN = "7631500496:AAFl3uP1PIQCoBkqiJn6Ev-NMCQkcoSjyFo"
CHAT_ID = 6051021067

def send(text):
    r = requests.post(f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage',
                      json={'chat_id': CHAT_ID, 'text': text})
    return r.json().get('ok')

if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:
        send(' '.join(sys.argv[1:]))
