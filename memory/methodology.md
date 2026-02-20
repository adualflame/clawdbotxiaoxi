# 方法论 - 技术方案沉淀

*解决过的问题，不重复踩坑*

## Telegram Bot 配置

### 问题：Bot 收不到群消息
**解决：**
1. BotFather → /mybots → 选 bot → Bot Settings → Group Privacy → Turn off
2. 把 bot 踢出群再重新拉进来（权限才生效）

### 问题：获取群 chat_id
**解决：** 拉 @RawDataBot 进群，它会发消息显示 chat_id，然后踢掉

## OpenClaw 配置

### Telegram channel 配置
```json
"channels": {
  "telegram": {
    "enabled": true,
    "botToken": "xxx:xxx",
    "allowFrom": [用户ID数字],
    "groupPolicy": "allowlist"
  }
}
```
改完执行 `openclaw gateway restart`

## 数据源备选方案

### web_search 不可用时
**替代方案：CoinGecko API**
- 热门代币：`GET /api/v3/search/trending`
- 价格查询：`GET /api/v3/simple/price?ids=xxx&vs_currencies=usd`
- 无需 API Key，免费可用

**已更新的 cron：**
- Alpha速递、推文计划、抄底监控 → 改用 CoinGecko

## Twitter 自动发推

### 前置条件
1. 关闭所有 Edge 窗口
2. 运行：`"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --remote-debugging-port=9222`
3. 手动登录 Twitter

### 发推流程
```python
# 1. 输入内容
python scripts/post_tweet.py  # 修改里面的推文内容

# 2. 点击发布
python scripts/click_post.py
```

### 脚本位置
- `scripts/post_tweet.py` - 输入推文
- `scripts/click_post.py` - 点击发布

## 内容制作工具链

| 类型 | 工具 | 说明 |
|------|------|------|
| 文案 | 小晰 | 直接写 |
| PPT | Gamma.app | 粘贴大纲自动生成 |
| 图片 | Ideogram | 免费，效果自然 |
| 视频 | Pika | 免费额度，质量好 |
| 配音 | 剪映 | 中文语音效果好 |

### 长视频制作流程
1. 小晰写分镜脚本（每段 3-4 秒）
2. ALEX 用 Pika 逐段生成
3. 剪映合成 + 配音 + 字幕

## PPT 生成

### 工具：Gamma.app
- 网址：https://gamma.app
- 免费版够用

### 工作流
1. 小晰写大纲（Markdown 格式）
2. ALEX 粘贴到 Gamma → Create new → Paste in text
3. 选风格，一键生成
4. 微调后导出 PDF/PPTX

### 大纲格式
```
标题

# 第一页标题
- 要点1
- 要点2

# 第二页标题
- 要点1
- 要点2
```

## Python 脚本

### Windows 编码问题
日志含 emoji 会报 GBK 编码错误，不影响运行，可忽略

### 脚本优先用 Python
Windows 兼容性比 curl/PowerShell 好

## Hyperliquid API

### 余额查询（强制规则）
**所有 Hyperliquid 交易品种必须用此方式查余额：**

```python
requests.post('https://api.hyperliquid.xyz/info', 
    json={'type': 'spotClearinghouseState', 'user': address})
```

- ✅ `spotClearinghouseState` → 正确
- ❌ `clearinghouseState` → 禁止使用

## Moltrade 自主交易配置

### 启动命令
```powershell
cd C:\Users\adual\.openclaw\workspace\skills\moltrade\repo\trader
$env:PYTHONPATH="C:\Users\adual\.openclaw\workspace\skills\moltrade\repo"
Start-Process python -ArgumentList "main.py","--config","config.json" -WindowStyle Hidden
```

### 进程守护
- cron 每小时检查进程是否存活
- 停止则自动重启

### 异常处理优化
主循环内捕获异常，遇错等待60秒重试，不退出：
```python
while True:
    try:
        # 交易逻辑
    except KeyboardInterrupt:
        shutdown()
        break
    except Exception as e:
        logger.error(f"Loop error: {e}")
        with open("error.log", "a", encoding="utf-8") as f:
            f.write(f"{datetime.now()} - Error: {e}\n")
        time.sleep(60)
```

### 日志文件
- `trading_bot.log` - 主日志（可能有编码问题）
- `error.log` - 错误日志（UTF-8）

### 常见问题
1. **频繁停止** → 检查异常处理是否在循环外
2. **余额查询失败** → 用 `spotClearinghouseState`
3. **日志为空** → Windows 编码问题，用 error.log

---
*碰到新方案及时补充*
