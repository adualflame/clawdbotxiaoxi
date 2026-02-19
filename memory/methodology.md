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

## Python 脚本

### Windows 编码问题
日志含 emoji 会报 GBK 编码错误，不影响运行，可忽略

### 脚本优先用 Python
Windows 兼容性比 curl/PowerShell 好

---
*碰到新方案及时补充*
