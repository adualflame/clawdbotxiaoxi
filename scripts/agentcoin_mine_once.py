#!/usr/bin/env python3
"""AgentCoin 挖矿 - 动态解题版"""
import json, requests, socket, os, re
from pathlib import Path
from web3 import Web3

os.chdir(Path(__file__).parent.parent)

def proxy_ok():
    try:
        s = socket.socket(); s.settimeout(2)
        s.connect(('127.0.0.1', 7890)); s.close()
        return True
    except: return False

if not proxy_ok():
    print("Proxy offline"); exit(0)

AGENT_ID = 13307
proxies = {'http':'http://127.0.0.1:7890','https':'http://127.0.0.1:7890'}

# 获取题目
r = requests.get('https://api.agentcoin.site/api/problem/current', headers={'User-Agent':'Mozilla/5.0'}, timeout=30, proxies=proxies)
if r.status_code != 200 or not r.text.strip():
    print(f"API error: {r.status_code}"); exit(0)
try:
    p = r.json()
except: print("JSON parse failed"); exit(0)

print(f"Problem #{p['problem_id']} Active:{p.get('is_active')}")
if not p.get('is_active'):
    print("Not active"); exit(0)

# 解析题目
template = p.get('template_text', '')
print(f"Template: {template[:100]}...")

def digit_sum_base(n, base):
    s = 0
    while n > 0:
        s += n % base
        n //= base
    return s

def solve(template, agent_id):
    # 类型1: base 7 vs base 5 数字和
    if 'base 7' in template and 'base 5' in template:
        mod_val = agent_id % 17 + 1
        for n in range(1, 100001):
            sum7 = digit_sum_base(n * agent_id, 7)
            sum5 = digit_sum_base(n * mod_val, 5)
            if sum7 == sum5:
                return n
        return 0
    
    # 类型2a: FizzBuzz 变体 (3或5但不被15整除，取模)
    if 'divisible by 3' in template and 'divisible by 5' in template and 'not divisible by 15' in template:
        total = 0
        for n in range(1, agent_id + 1):
            if (n % 3 == 0 or n % 5 == 0) and n % 15 != 0:
                total += n
        mod_val = agent_id % 100 + 1
        return total % mod_val
    
    # 类型2b: FizzBuzz 标准 (3 or 5)
    if 'divisible by 3' in template and 'divisible by 5' in template:
        k3, k5, k15 = agent_id//3, agent_id//5, agent_id//15
        return 3*k3*(k3+1)//2 + 5*k5*(k5+1)//2 - 15*k15*(k15+1)//2
    
    # 类型3: 7或11整除但不同时 + mod 13 条件
    if 'divisible by 7' in template and 'divisible by 11' in template and 'mod 13' in template:
        total = 0
        for n in range(1, 1001):
            d7, d11 = n % 7 == 0, n % 11 == 0
            if (d7 or d11) and not (d7 and d11):
                if (n + agent_id) % 13 == 5:
                    total += n
        return total
    
    # 未知类型 - 主动通知
    print(f"[ALERT] Unknown problem type, need manual update!")
    print(f"Template: {template}")
    return None

ans = solve(template, AGENT_ID)
if ans is None:
    print("Cannot solve"); exit(0)

print(f"Answer: {ans}")

# 提交
w3 = Web3(Web3.HTTPProvider("https://mainnet.base.org"))
with open("secrets/base-wallet.json", encoding="utf-8") as f:
    pk = json.load(f)["private_key"]
acct = w3.eth.account.from_key(pk)

bal = float(w3.from_wei(w3.eth.get_balance(acct.address), 'ether'))
if bal < 0.0005:
    print(f"Gas low: {bal:.6f} ETH"); exit(1)

ABI = [{'inputs':[{'name':'problemId','type':'uint256'},{'name':'answer','type':'bytes32'}],'name':'submitAnswer','outputs':[],'stateMutability':'nonpayable','type':'function'}]
c = w3.eth.contract(address='0x7D563ae2881D2fC72f5f4c66334c079B4Cc051c6', abi=ABI)
tx = c.functions.submitAnswer(p['problem_id'], w3.keccak(text=str(ans))).build_transaction({
    'from': acct.address, 'nonce': w3.eth.get_transaction_count(acct.address),
    'gas': 200000, 'gasPrice': w3.eth.gas_price
})
signed = w3.eth.account.sign_transaction(tx, pk)
tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
print(f"Submitted: {tx_hash.hex()}")
