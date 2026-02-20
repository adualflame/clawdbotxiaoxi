# MEMORY.md - 长期记忆

*最后更新: 2026-02-20*

## 核心系统

### 代币评分
- 详情：`memory/token-rating-system.md`
- 评分：合约安全(30) + 流动性(25) + 持仓(25) + 项目(20)
- 等级：A(90+) / B(75-89) / C(60-74) / D(40-59) / F(<40)

### Twitter
- 详情：`memory/twitter-growth-plan.md`
- 定位：实战派市场观察者
- 流程：小晰写 → ALEX 发
- 目标：4月底 1000+ 粉丝

## 重要决定

- 02-04：代币评分系统上线
- 02-04：Twitter 三阶段计划
- 02-04：手动发推（bird CLI 暂不支持 Windows+代理）
- 02-16：脚本优先用 Python（Windows 兼容性更好，避免 curl/PowerShell 坑）
- 02-18：**Hyperliquid 不区分现货/合约账户，USDC 可直接交易**
- 02-19：**放弃 Nowledge Mem，回归文件系统记忆**（实测效果不如原生文件）
- 02-20：**Notion 任务同步上线**（双向模式：ALEX 在 Notion 管理，小晰读取执行）

## 工作流管理

- 工作流文件位于 `memory/*-workflow.md`
- **原则：讨论到细节优化时，立即更新对应工作流文件**
- 确保工作流程持续迭代优化

## 待办

### 高优先级
- [ ] 推文产出（连续三天零产出）
- [ ] 配置每日自动读取 Notion 任务

### 已完成
- [x] Notion 任务同步 ✅ 02-20
- [x] Git 备份配置 ✅ 02-19
- [x] Telegram 频道推送 ✅ 02-18

### 不再使用
- ~~Nowledge Mem~~ - 02-19 放弃，回归文件系统

### 低优先级
- [ ] 检查 bird CLI 更新
- [ ] Python PPT 生成环境
