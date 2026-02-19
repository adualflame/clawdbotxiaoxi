# 🔄 OpenClaw 多 Agent 重构计划

## 📊 架构总览

```
┌─────────────────────────────────────────────────────────────────┐
│                      OpenClaw Gateway                            │
│                    (单进程，统一路由)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  │ 总指挥   │  │  军师    │  │ 工程师   │  │ 创作官   │  │  智库    │
│  │ (小晰)   │  │          │  │          │  │          │  │          │
│  │          │  │          │  │          │  │          │  │          │
│  │ 全局监听 │  │ @触发    │  │ @触发    │  │ @触发    │  │ @触发    │
│  │ 任务派工 │  │ 策略分析 │  │ 技术执行 │  │ 内容创作 │  │ 质量审核 │
│  │ 进度收口 │  │ 风险评估 │  │ 脚本开发 │  │ 推文输出 │  │ 代币审核 │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘
│       │              │             │             │             │
│       ▼              ▼             ▼             ▼             ▼
│  workspace-     workspace-    workspace-   workspace-    workspace-
│  commander      strategist    engineer     creator       auditor
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Discord 服务器  │
                    │ "小晰和她的朋友们"│
                    └─────────────────┘
```

## 📁 文件分类整理

### 1️⃣ 总指挥 (Commander/小晰)
**职责**: 全局监听、任务拆解、派工、收口

| 类型 | 文件 | 说明 |
|------|------|------|
| 核心 | SOUL.md | 人格定义 |
| 核心 | USER.md | 用户画像 (ALEX) |
| 核心 | MEMORY.md | 长期记忆 |
| 核心 | AGENTS.md | 运行手册 |
| 记忆 | memory/2026-*.md | 日记 |
| 工作流 | memory/daily-checklist-workflow.md | 每日检查 |

### 2️⃣ 军师 (Strategist)
**职责**: 市场分析、交易策略、风险评估

| 类型 | 文件 | 说明 |
|------|------|------|
| 工作流 | memory/hyperliquid-workflow.md | Hyperliquid 交易 |
| 工作流 | memory/binance-dca-workflow.md | Binance DCA |
| 工作流 | memory/moltrade-status.md | Moltrade 状态 |
| 工作流 | memory/predictme-workflow.md | PredictMe 预测 |
| 研究 | memory/ai-mining-research.md | AI 挖矿研究 |
| 研究 | memory/crypto-report-system.md | 加密报告系统 |

### 3️⃣ 工程师 (Engineer)
**职责**: 脚本开发、系统维护、自动化

| 类型 | 文件 | 说明 |
|------|------|------|
| 配置 | memory/system-state.md | 系统状态 |
| 配置 | memory/openclaw-learnings.md | OpenClaw 经验 |
| 脚本 | scripts/*.py | Python 脚本 |
| 脚本 | scripts/*.js | JS 脚本 |
| 项目 | projects/twitter-bot/ | Twitter Bot |
| 项目 | projects/meme-scanner/ | Meme 扫描器 |

### 4️⃣ 创作官 (Creator)
**职责**: 推文创作、内容输出

| 类型 | 文件 | 说明 |
|------|------|------|
| 计划 | memory/twitter-growth-plan.md | Twitter 增长计划 |
| 工作流 | memory/twitter-workflow.md | 发推流程 |
| 工作流 | memory/content-collect-workflow.md | 内容收集 |
| 工作流 | memory/moments-workflow.md | 朋友圈运营 |
| 工作流 | memory/openclaw-moments-plan.md | 朋友圈计划 |

### 5️⃣ 智库 (Auditor)
**职责**: 代币审核、质量把关

| 类型 | 文件 | 说明 |
|------|------|------|
| 系统 | memory/token-rating-system.md | 代币评分系统 |
| 工作流 | memory/token-analysis-workflow.md | 代币分析流程 |
| 工作流 | memory/onchain-monitor-workflow.md | 链上监控 |
| 项目 | projects/token-rating-system/ | 评分系统项目 |

### 🔧 共享资源
**所有 Agent 共用**

| 类型 | 文件 | 说明 |
|------|------|------|
| 规则 | shared/TEAM-RULEBOOK.md | 协作规则 |
| 目录 | shared/TEAM-DIRECTORY.md | 角色目录 |
| 技能 | skills/* | 所有技能包 |
| 密钥 | secrets/* | 敏感信息 |

## 🚀 执行步骤

### 第一步：备份
```
1. 整个 workspace 目录备份到 GitHub
2. openclaw.json 配置备份
3. Discord bot tokens 记录
```

### 第二步：清理重装
```
1. 停止 Gateway
2. 卸载 OpenClaw
3. 删除 ~/.openclaw 目录
4. 全新安装 OpenClaw
```

### 第三步：重建
```
1. 从 GitHub 拉取备份
2. 按 5 agent 架构重新组织文件
3. 配置 openclaw.json
4. 启动测试
```

## ⏳ 当前状态

- [x] 5 个 Discord bot 已创建
- [x] 5 个 workspace 目录已创建
- [x] SOUL.md / AGENTS.md 已写好
- [ ] Discord 连接问题待解决
- [ ] 文件迁移待执行
- [ ] 测试验证待完成
