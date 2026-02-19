"""
5 Agent Telegram Bot 配置
"""
import requests

# Bot 配置
BOTS = {
    "commander": {
        "name": "总指挥",
        "token": "7631500496:AAFl3uP1PIQCoBkqiJn6Ev-NMCQkcoSjyFo",
    },
    "strategist": {
        "name": "军师",
        "token": "8481496931:AAGSa-WLPR8Vw6lEgL7J_CTv2cxPRYOxWSo",
    },
    "engineer": {
        "name": "工程师",
        "token": "8591172854:AAHGt6NBunRml_wYqiM4LTjMopbwTgud2JA",
    },
    "creator": {
        "name": "创作官",
        "token": "7918096518:AAG0NLXZRlBP7lg-uM3BMXtIGMwwV4UmGWk",
    },
    "analyst": {
        "name": "智库",
        "token": "8315084913:AAFTYI3B2g_0UzxYRj-o8vOQkXNlcAlBE_g",
    },
}

GROUP_ID = -1003749473984

def send_message(bot_key: str, text: str, chat_id: int = GROUP_ID):
    """用指定 bot 发送消息"""
    bot = BOTS[bot_key]
    url = f"https://api.telegram.org/bot{bot['token']}/sendMessage"
    resp = requests.post(url, json={"chat_id": chat_id, "text": text})
    return resp.json()

def test_all_bots():
    """测试所有 bot 能否发消息"""
    for key, bot in BOTS.items():
        result = send_message(key, f"✅ {bot['name']} 上线")
        print(f"{bot['name']}: {'OK' if result.get('ok') else result}")

if __name__ == "__main__":
    test_all_bots()
