# Todos

- Whiteboard 切换 WhitePage 时，控制 Marker 层的显示与隐藏，解决 Toolbar 绝对定位问题；添加切换 WhitePage 的事件，细化事件系统
- 保证 Whiteboard 级别的本地同步：添加 Whiteboard 状态的定期同步，如果 Mirror 模式的 Whiteboard 尚未初始化过，则等待 Master 传送全量状态信息；添加 Whiteboard 的 Loading 界面
- 引入全量的状态订正，每秒订正一次
