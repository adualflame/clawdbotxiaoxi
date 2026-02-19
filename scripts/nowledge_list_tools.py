#!/usr/bin/env python3
import requests, json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE = "http://127.0.0.1:14242/mcp"
HEADERS = {'Accept': 'application/json, text/event-stream', 'Content-Type': 'application/json'}

data = {'jsonrpc': '2.0', 'method': 'tools/list', 'id': 1}
r = requests.post(BASE, headers=HEADERS, json=data, timeout=30)

for line in r.text.split('\n'):
    if line.startswith('data: '):
        result = json.loads(line[6:])
        for tool in result.get('result', {}).get('tools', []):
            print(tool['name'])
