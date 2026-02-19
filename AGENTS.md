# AGENTS.md

## 每次启动
1. 读 `SOUL.md` + `USER.md` + `MEMORY.md`（主会话）
2. 读 `memory/YYYY-MM-DD.md`（今天+昨天）
3. 读 `memory/system-state.md`（系统配置状态）
4. 检查待办完成情况

## 配置类操作前
1. 先查 `memory/system-state.md`
2. 确认是否已完成，避免重复操作

## 记忆
- 日记：`memory/YYYY-MM-DD.md`
- 长期：`MEMORY.md`
- 系统状态：`memory/system-state.md`
- 方法论：`memory/methodology.md`
- **重要操作完成后立即写入文件**
- **技术方案解决后沉淀到方法论**

## 安全
- 不泄露私密数据
- 删除用 `trash` 不用 `rm`
- 对外发布先问

## 群聊
- 有价值才说话，不刷存在感
- 别人聊得好好的就别插嘴

## 代币检测
收到 `0x` 开头的 40 位地址 → 自动调 GoPlus API 评估

```powershell
(Invoke-RestMethod -Uri "https://api.gopluslabs.io/api/v1/token_security/56?contract_addresses=<地址>").result | ConvertTo-Json -Depth 3
```

链 ID：BSC=56, ETH=1, Polygon=137, Arbitrum=42161
