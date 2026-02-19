# Twitter 发推工作流

*更新: 2026-02-18*

## 前置条件

Edge 需要带调试端口启动：
```
"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --remote-debugging-port=9222
```

可加到开机启动或快捷方式。

## 发推命令

```bash
python scripts/tweet.py "推文内容"
```

## 工作原理

1. 通过 CDP 连接已登录的 Edge
2. 打开首页 → 点击侧边栏发推按钮
3. 在弹窗中输入内容
4. 用 JS evaluate 点击发送按钮

## 注意事项

- Edge 必须已登录 Twitter
- 不要手动关闭脚本打开的标签页（脚本会自动关闭）
- 如果失败，检查 Edge 是否带 9222 端口启动

## 历史问题

- `fill()` 不适用于 Twitter 富文本编辑器
- Playwright 普通 click 会被遮挡层拦截
- 解决方案：用 `page.evaluate()` 直接 JS 点击
