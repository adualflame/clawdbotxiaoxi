#!/usr/bin/env python3
"""AgentCoin 自动挖矿脚本 - Base 链"""
import json
import time
import requests
from web3 import Web3

# 配置
BASE_RPC = "https://mainnet.base.org"
API_BASE = "https://api.agentcoin.site/api"
REGISTRY_ADDR = "0x5A899d52C9450a06808182FdB1D1e4e23AdFe04D"
PROBLEM_ADDR = "0x7D563ae2881D2fC72f5f4c66334c079B4Cc051c6"
MIN_GAS_ETH = 0.0005  # 最低 gas 提醒阈值

# 加载私钥
with open("secrets/base-wallet.json", encoding="utf-8") as f:
    PRIVATE_KEY = json.load(f)["private_key"]

w3 = Web3(Web3.HTTPProvider(BASE_RPC))
account = w3.eth.account.from_key(PRIVATE_KEY)
WALLET = account.address

print(f"钱包: {WALLET}")

# 简化 ABI
REGISTRY_ABI = [{"inputs":[{"name":"xAccountHash","type":"bytes32"}],"name":"registerAgent","outputs":[{"name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"wallet","type":"address"}],"name":"getAgentByWallet","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
PROBLEM_ABI = [{"inputs":[{"name":"problemId","type":"uint256"},{"name":"answer","type":"bytes32"}],"name":"submitAnswer","outputs":[],"stateMutability":"nonpayable","type":"function"}]

registry = w3.eth.contract(address=REGISTRY_ADDR, abi=REGISTRY_ABI)
problem_mgr = w3.eth.contract(address=PROBLEM_ADDR, abi=PROBLEM_ABI)

def check_gas():
    bal = w3.eth.get_balance(WALLET)
    eth = w3.from_wei(bal, 'ether')
    if eth < MIN_GAS_ETH:
        print(f"⚠️ Gas 不足! 余额: {eth:.6f} ETH")
        return False
    print(f"Gas: {eth:.6f} ETH")
    return True

def get_agent_id():
    return 13307  # 已注册

def get_problem():
    r = requests.get(f"{API_BASE}/problem/current", headers={'User-Agent':'Mozilla/5.0'}, timeout=30)
    return r.json()

def solve(template, agent_id):
    """计算答案 - 能被3或5整除但不能被15整除的数之和"""
    n = agent_id
    k3, k5, k15 = n//3, n//5, n//15
    return 3*k3*(k3+1)//2 + 5*k5*(k5+1)//2 - 2*15*k15*(k15+1)//2

def submit_answer(problem_id, answer):
    ans_bytes = w3.keccak(text=str(answer))
    tx = problem_mgr.functions.submitAnswer(problem_id, ans_bytes).build_transaction({
        'from': WALLET, 'nonce': w3.eth.get_transaction_count(WALLET),
        'gas': 200000, 'gasPrice': w3.eth.gas_price
    })
    signed = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
    return w3.eth.send_raw_transaction(signed.raw_transaction)

if __name__ == "__main__":
    agent_id = get_agent_id()
    print(f"Agent ID: {agent_id or '未注册'}")
    if not check_gas():
        exit(1)
    if not agent_id:
        print("请先注册 Agent")
        exit(1)
    
    while True:
        try:
            p = get_problem()
            print(f"\n题目 #{p['problem_id']} - {p['status']}")
            if p.get('is_active'):
                ans = solve(p['template_text'], agent_id)
                print(f"答案: {ans}")
                tx = submit_answer(p['problem_id'], ans)
                print(f"已提交: {tx.hex()}")
            time.sleep(300)
        except Exception as e:
            print(f"错误: {e}")
            time.sleep(30)
