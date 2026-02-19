# Binance DCA 定投工作流

## 策略

- 定投标的：待定
- 频率：待定（每日/每周）
- 单次金额：待定

## 执行方式

使用 `binance-dca` skill

```bash
# 查看计划
binance-dca plan --pair BTCUSDT --amount 100 --frequency weekly

# 执行买入
binance-dca buy --pair BTCUSDT --amount 100
```

## 记录

- 每次执行后记录到日记
- 定期汇总成本和持仓

## 待办

- [ ] 确定定投标的和金额
- [ ] 配置自动执行 cron
- [ ] 建立定投记录表
