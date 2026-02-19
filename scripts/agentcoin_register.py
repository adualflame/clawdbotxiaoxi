#!/usr/bin/env python3
"""AgentCoin 注册脚本"""
import json
from web3 import Web3

BASE_RPC = "https://mainnet.base.org"
REGISTRY = "0x5A899d52C9450a06808182FdB1D1e4e23AdFe04D"

with open("secrets/base-wallet.json", encoding="utf-8") as f:
    PK = json.load(f)["private_key"]

w3 = Web3(Web3.HTTPProvider(BASE_RPC))
acct = w3.eth.account.from_key(PK)

ABI = [{"inputs":[{"name":"xAccountHash","type":"bytes32"}],"name":"registerAgent","outputs":[{"name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"}]
registry = w3.eth.contract(address=REGISTRY, abi=ABI)

# muxing39623457 的哈希
x_hash = w3.keccak(text="muxing39623457")
print(f"钱包: {acct.address}")
print(f"X Hash: {x_hash.hex()}")

bal = w3.from_wei(w3.eth.get_balance(acct.address), 'ether')
print(f"余额: {bal} ETH")

if bal < 0.0003:
    print("Gas 不足!")
    exit(1)

tx = registry.functions.registerAgent(x_hash).build_transaction({
    'from': acct.address,
    'nonce': w3.eth.get_transaction_count(acct.address),
    'gas': 150000,
    'gasPrice': w3.eth.gas_price
})
signed = w3.eth.account.sign_transaction(tx, PK)
tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
print(f"注册交易: {tx_hash.hex()}")
