import requests
import os

NOTION_KEY = os.environ.get("NOTION_KEY", "")
DB_ID = os.environ.get("NOTION_DB_ID", "")

headers = {
    "Authorization": f"Bearer {NOTION_KEY}",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json"
}

tasks = [
    ("晨会", "每天 8:00", "高"),
    ("Alpha速递", "每天 10/14/18点", "中"),
    ("推文计划", "每天 11:00", "高"),
    ("朋友圈计划", "每天 19:00", "中"),
    ("晚报", "每天 22:30", "高"),
    ("Git备份", "每天 23:00", "低"),
    ("Moltrade守护", "每小时", "高"),
    ("Moltrade检查", "每4小时", "中"),
    ("币安Alpha抄底监控", "每天 9/13/21点", "中"),
    ("币安Alpha周更新", "每周一 10:00", "中"),
    ("代币评估周报", "每周五 18:00", "低"),
    ("代币评估月报", "每月1号 18:00", "低"),
]

for name, schedule, priority in tasks:
    data = {
        "parent": {"database_id": DB_ID},
        "properties": {
            "任务名称": {"title": [{"text": {"content": f"[自动] {name} - {schedule}"}}]},
            "优先级": {"select": {"name": priority}},
            "状态": {"status": {"name": "进行中"}}
        }
    }
    r = requests.post("https://api.notion.com/v1/pages", headers=headers, json=data)
    print(f"{name}: {'OK' if r.ok else r.status_code}")
