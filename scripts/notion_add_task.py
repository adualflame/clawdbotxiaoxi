import requests
import os

NOTION_KEY = os.environ.get("NOTION_KEY", "")
DB_ID = os.environ.get("NOTION_DB_ID", "")

headers = {
    "Authorization": f"Bearer {NOTION_KEY}",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json"
}

data = {
    "parent": {"database_id": DB_ID},
    "properties": {
        "任务名称": {"title": [{"text": {"content": "[自动] Alpha代币新增 - 每天15:00"}}]},
        "优先级": {"select": {"name": "中"}},
        "状态": {"status": {"name": "进行中"}}
    }
}

r = requests.post("https://api.notion.com/v1/pages", headers=headers, json=data)
print("OK" if r.ok else r.text)
