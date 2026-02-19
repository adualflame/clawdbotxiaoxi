"""
总指挥调度系统 - 监听群消息，派发任务给其他 agent
"""
import requests
import json
import time

# Claude API (通过代理)
CLAUDE_URL = "https://code.newcli.com/claude/droid/v1/messages"
CLAUDE_KEY = "sk-ant-oat01-zIUgWjfyr9havCTP8Zh2M3nZyrO4mvj-WL_eY1NIscJsB22PCjRBjo2eUiBlV5HbO-X1qG3777xmFEXdJcZP_uoBDBfYsAA"

# 角色 system prompt
ROLE_PROMPTS = {
    "strategist": "你是军师，专注交易策略和买卖决策。给出明确的操作建议，包括仓位、止损止盈。简洁直接。",
    "analyst": "你是智库，专注行情分析和市场研判。分析走势、趋势、关键点位。数据说话，不废话。",
    "creator": "你是创作官，专注推文和内容创作。风格：专业但不枯燥，有观点有态度。",
    "engineer": "你是工程师，专注技术和自动化。给出可执行的代码或方案。",
}

# Bot 配置
BOTS = {
    "commander": {"name": "总指挥", "token": "7631500496:AAFl3uP1PIQCoBkqiJn6Ev-NMCQkcoSjyFo"},
    "strategist": {"name": "军师", "token": "8481496931:AAGSa-WLPR8Vw6lEgL7J_CTv2cxPRYOxWSo"},
    "engineer": {"name": "工程师", "token": "8591172854:AAHGt6NBunRml_wYqiM4LTjMopbwTgud2JA"},
    "creator": {"name": "创作官", "token": "7918096518:AAG0NLXZRlBP7lg-uM3BMXtIGMwwV4UmGWk"},
    "analyst": {"name": "智库", "token": "8315084913:AAFTYI3B2g_0UzxYRj-o8vOQkXNlcAlBE_g"},
}

GROUP_ID = -1003749473984

# 角色关键词映射
# 军师：交易决策  智库：行情分析  创作官：内容  工程师：技术
ROLE_KEYWORDS = {
    "strategist": ["买", "卖", "操作", "策略", "仓位", "开仓", "平仓", "止损", "止盈", "该不该"],
    "analyst": ["分析", "行情", "走势", "市场", "趋势", "怎么样", "看法", "研判", "代币", "合约", "0x"],
    "creator": ["推文", "文案", "内容", "写", "发推", "tweet"],
    "engineer": ["脚本", "代码", "bug", "修复", "部署", "技术", "自动化", "开发"],
}

def call_ai(role: str, task: str) -> str:
    """调用 Claude API"""
    headers = {"x-api-key": CLAUDE_KEY, "Content-Type": "application/json", "anthropic-version": "2023-06-01"}
    data = {
        "model": "claude-opus-4-5-20251101",
        "max_tokens": 1000,
        "system": ROLE_PROMPTS.get(role, ""),
        "messages": [{"role": "user", "content": task}]
    }
    try:
        r = requests.post(CLAUDE_URL, headers=headers, json=data, timeout=60)
        return r.json()["content"][0]["text"]
    except Exception as e:
        return f"调用失败: {e}"

def send_msg(bot_key: str, text: str, reply_to: int = None):
    """发送消息"""
    bot = BOTS[bot_key]
    url = f"https://api.telegram.org/bot{bot['token']}/sendMessage"
    data = {"chat_id": GROUP_ID, "text": text}
    if reply_to:
        data["reply_to_message_id"] = reply_to
    return requests.post(url, json=data).json()

def get_updates(bot_key: str, offset: int = None):
    """获取消息"""
    bot = BOTS[bot_key]
    url = f"https://api.telegram.org/bot{bot['token']}/getUpdates"
    params = {"timeout": 30}
    if offset:
        params["offset"] = offset
    return requests.get(url, params=params).json()

def detect_role(text: str) -> str:
    """根据内容判断该派给谁"""
    text_lower = text.lower()
    for role, keywords in ROLE_KEYWORDS.items():
        if any(kw in text_lower for kw in keywords):
            return role
    return None

def main():
    print("总指挥上线，开始监听...", flush=True)
    offset = None
    
    while True:
        try:
            updates = get_updates("commander", offset)
            if not updates.get("ok"):
                print(f"获取更新失败: {updates}", flush=True)
                time.sleep(5)
                continue
                
            for update in updates.get("result", []):
                offset = update["update_id"] + 1
                msg = update.get("message", {})
                text = msg.get("text", "")
                msg_id = msg.get("message_id")
                
                if not text or msg.get("from", {}).get("is_bot"):
                    continue
                
                print(f"收到: {text[:50]}...", flush=True)
                
                role = detect_role(text)
                if role:
                    bot_name = BOTS[role]["name"]
                    print(f"派给: {bot_name}", flush=True)
                    send_msg("commander", f"收到，派给{bot_name}处理 👉", msg_id)
                    print("调用AI中...", flush=True)
                    result = call_ai(role, text)
                    print(f"AI返回: {result[:100]}...", flush=True)
                    send_msg(role, result)
                    print("发送完成", flush=True)
                    
        except Exception as e:
            print(f"错误: {e}", flush=True)
            time.sleep(5)

if __name__ == "__main__":
    main()
