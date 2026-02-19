# BSC Copy Trader 🤖

自动跟单 BSC 链上指定钱包的交易。

## 功能

- ✅ 实时监控目标钱包交易
- ✅ 自动识别买入/卖出操作
- ✅ 自动跟单执行 (PancakeSwap)
- ✅ 支持带税代币

## 配置

1. 复制配置文件：
```bash
cp .env.example .env
```

2. 编辑 `.env`，填入：
- `PRIVATE_KEY` - 你的钱包私钥
- `BSCSCAN_API_KEY` - BSCScan API Key

## 运行

```bash
npm install
npm start
```

## ⚠️ 风险提示

- 跟单有风险，可能亏损
- 私钥务必保密
- 建议先用小额测试
