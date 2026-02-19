# BSC API Key 申请指南

> 2025年12月起，BSCScan API 已迁移至 Etherscan V2 统一平台

## 方案一：Etherscan V2 API（推荐）

### 步骤 1：注册 Etherscan 账号

1. 访问 https://etherscan.io/register
2. 填写邮箱、用户名、密码
3. 完成邮箱验证

### 步骤 2：创建 API Key

1. 登录后，点击右上角用户名
2. 选择 **API Keys**
3. 点击 **Add** 按钮
4. 输入 App Name（随便填，如 "bsc-copy-trader"）
5. 点击 **Create New API Key**

### 步骤 3：使用 API Key

新的 V2 API 格式：
```
https://api.etherscan.io/v2/api?chainid=56&module=account&action=txlist&address=钱包地址&apikey=你的KEY
```

**关键点：** `chainid=56` 表示 BSC 主网

### 免费额度

- 5 次/秒
- 100,000 次/天

---

## 方案二：BSCTrace / NodeReal（备选）

如果 Etherscan V2 不稳定，可以用 NodeReal 的 BSCTrace：

### 步骤 1：注册 NodeReal

1. 访问 https://nodereal.io/
2. 点击 **Sign Up**
3. 可用 Google/GitHub 快速注册

### 步骤 2：创建 API Key

1. 登录后进入 Dashboard
2. 选择 **MegaNode**
3. 点击 **Create New Key**
4. 选择 **BNB Smart Chain**
5. 复制生成的 API Key

### 步骤 3：使用

RPC 端点格式：
```
https://bsc-mainnet.nodereal.io/v1/你的API_KEY
```

### 免费额度

- 300 次/秒
- 300,000,000 CU/月

---

## 常见问题

**Q: 原来的 BSCScan API Key 还能用吗？**
A: 不能，已完全迁移到 Etherscan V2

**Q: 两个方案选哪个？**
A: 先试 Etherscan V2，如果有问题再用 NodeReal

**Q: chainid 怎么填？**
A: BSC 主网 = 56，BSC 测试网 = 97
