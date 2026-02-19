#!/usr/bin/env python3
import requests, json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE = "http://127.0.0.1:14242/mcp"
HEADERS = {'Accept': 'application/json, text/event-stream', 'Content-Type': 'application/json'}

tool = sys.argv[1] if len(sys.argv) > 1 else 'graph_stats'
args = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {}

data = {'jsonrpc': '2.0', 'method': 'tools/call', 'id': 1, 'params': {'name': tool, 'arguments': args}}
r = requests.post(BASE, headers=HEADERS, json=data, timeout=60)

for line in r.text.split('\n'):
    if line.startswith('data: '):
        print(json.dumps(json.loads(line[6:]), ensure_ascii=False, indent=2))
