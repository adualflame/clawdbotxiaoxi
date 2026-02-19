# Moltrade 交易监控

## 状态
- **启用**: 是
- **运行中**: 是 ✅
- **钱包**: 0x6E1c41536be29C0aa5210d0678f6976E8DAebae6
- **策略**: trend_following
- **交易对**: HYPE
- **配置**: 仓位 10%，止损 5%，止盈 15%

## 账户情况（2026-02-18 更新）
- **余额**: $100 USDC
- **持仓**: 无
- **当前信号**: HOLD

## 启动命令
```powershell
Set-Location C:\Users\adual\.openclaw\workspace\skills\moltrade\repo\trader
$env:PYTHONPATH="C:\Users\adual\.openclaw\workspace\skills\moltrade\repo"
python main.py --config config.json --strategy trend_following --symbol HYPE --interval 300
```

## 待办
- [x] ALEX 充值 $100 到 Hyperliquid
- [ ] 将 USDC 从 Spot 转到 Perp（或确认策略类型）
- [ ] 启动机器人并确认正常运行
