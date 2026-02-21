import requests, os
headers = {
    "Authorization": f"Bearer {os.environ.get('NOTION_KEY', '')}",
    "Notion-Version": "2022-06-28"
}
r = requests.post(f"https://api.notion.com/v1/databases/{os.environ.get('NOTION_DB_ID', '')}/query", headers=headers, json={})
if r.ok:
    for p in r.json().get("results", []):
        props = p.get("properties", {})
        title = props.get("任务名称", {}).get("title", [{}])[0].get("text", {}).get("content", "N/A")
        status = props.get("状态", {}).get("status", {}).get("name", "N/A")
        pri = props.get("优先级", {}).get("select") or {}
        print(f"{status} | {pri.get('name','N/A')} | {title}")
else:
    print(f"Error: {r.status_code}")
