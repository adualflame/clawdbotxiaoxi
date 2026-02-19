# NodeReal Enhanced API 开通指南

> 免费版只有基础 RPC，需要开通 Enhanced API 才能查询交易历史

## 步骤 1：登录 NodeReal

1. 访问 https://nodereal.io/
2. 点击右上角登录（用之前注册的账号）

## 步骤 2：进入 MegaNode 控制台

1. 登录后点击顶部 **MegaNode**
2. 或直接访问 https://nodereal.io/meganode

## 步骤 3：找到你的 API Key

1. 在 Dashboard 中找到刚才创建的 Key
2. 点击 Key 名称进入详情页

## 步骤 4：开通 Enhanced API

1. 在 Key 详情页，找到 **Enhanced API** 或 **Add-ons** 选项
2. 找到以下 API 并开通（免费额度内）：
   - `nr_getTransactionsByAddress` - 查询地址交易
   - `nr_getTokenTransfers20ByAddress` - 查询代币转账

3. 如果没有单独开关，查看是否需要：
   - 升级到 Growth Plan（有免费试用）
   - 或在 Marketplace 中添加 BSC Enhanced API

## 步骤 5：验证开通成功

开通后告诉我，我来测试 API 是否可用。

---

## 备选方案

如果 Enhanced API 需要付费，我们可以改用 **WebSocket 监听** 方式：
- 不依赖交易历史 API
- 实时监听目标钱包的 pending 交易
- 反应更快，但需要代码改动

需要我准备备选方案吗？
