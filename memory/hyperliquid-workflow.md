# Hyperliquid 交易监控工作流

## 账户信息

- 钱包：0x6E1c41536be29C0aa5210d0678f6976E8DAebae6
- 资金：$100 USDC

## 机器人配置

- 策略：trend_following
- 交易对：HYPE
- 刷新间隔：5 分钟
- min_adx：20
- 交易间隔：2 小时
- 止损：5%
- 止盈：15%
- 仓位：10%

## 启动命令

```powershell
cd C:\Users\adual\.openclaw\workspace\skills\moltrade\repo\trader
$env:PYTHONPATH="C:\Users\adual\.openclaw\workspace\skills\moltrade\repo"
python main.py --config config.json --strategy trend_following --symbol HYPE --interval 300
```

## 查询余额

```python
python -c "
import urllib.request, json
url = 'https://api.hyperliquid.xyz/info'
data = json.dumps({'type': 'spotClearinghouseState', 'user': '0x6E1c41536be29C0aa5210d0678f6976E8DAebae6'}).encode()
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
print(json.loads(urllib.request.urlopen(req, timeout=15).read()))
"
```

## 监控 cron

已配置：每天 9/13/18/22 点检查状态

## 注意事项

- Hyperliquid 统一账户，不分 Spot/Perp
- 机器人需后台持续运行
- 日志：trading_bot.log
