#!/usr/bin/env python3
"""Nowledge Mem MCP 客户端"""
import requests, json, sys

BASE = "http://127.0.0.1:14242/mcp"
HEADERS = {'Accept': 'application/json, text/event-stream', 'Content-Type': 'application/json'}

def call_mcp(method, params=None):
    data = {'jsonrpc': '2.0', 'method': method, 'id': 1}
    if params: data['params'] = params
    r = requests.post(BASE, headers=HEADERS, json=data, timeout=30)
    if r.ok:
        for line in r.text.split('\n'):
            if line.startswith('data: '):
                return json.loads(line[6:])
    return {'error': r.text}

def search(query, limit=5):
    return call_mcp('tools/call', {'name': 'memory_search', 'arguments': {'query': query, 'limit': limit}})

def add(content, title=None, labels=None):
    args = {'content': content}
    if title: args['title'] = title
    if labels: args['labels'] = labels
    return call_mcp('tools/call', {'name': 'memory_add', 'arguments': args})

def stats():
    return call_mcp('tools/call', {'name': 'graph_stats', 'arguments': {}})

if __name__ == "__main__":
    import sys, io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    if len(sys.argv) < 2:
        print("Usage: python nowledge_mem.py search|add|stats [args]")
    elif sys.argv[1] == "search" and len(sys.argv) > 2:
        print(json.dumps(search(sys.argv[2]), ensure_ascii=False, indent=2))
    elif sys.argv[1] == "add" and len(sys.argv) > 2:
        print(json.dumps(add(sys.argv[2]), ensure_ascii=False, indent=2))
    elif sys.argv[1] == "stats":
        print(json.dumps(stats(), ensure_ascii=False, indent=2))
