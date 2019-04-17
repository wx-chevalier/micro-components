# fc-whiteboard

Web whiteboard screencasting(both live and playback mode) with background slides, can be used as a graphics tablet for online tutoring or remote collaboration.

![](https://i.postimg.cc/CLG53MF8/image.png)

# Usage

## Whiteboard live mode

![](https://i.postimg.cc/65t7MNBQ/Kapture-2019-04-17-at-13-47-52.gif)

Source code can be found in [Code Sandbox](https://codesandbox.io/s/3q1z35q53p) or [Demo](https://3q1z35q53p.codesandbox.io/);

```ts
import { EventHub, Whiteboard, MirrorWhiteboard } from 'fc-whiteboard';

const eventHub = new EventHub();

eventHub.on('sync', (changeEv: SyncEvent) => {
  console.log(changeEv);
});

const images = [
  'https://upload-images.jianshu.io/upload_images/1647496-6bede989c09af527.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
  'http://upload-images.jianshu.io/upload_images/1647496-d281090a702045e5.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
  'http://upload-images.jianshu.io/upload_images/1647496-611a416be07d7ca3.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240'
];

const whiteboard = new Whiteboard(document.getElementById('root') as HTMLDivElement, {
  sources: images,
  eventHub,
  // Enable this option to disable incremental sync, just use full sync
  onlyEmitSnap: false
});

whiteboard.open();

const mirrorWhiteboard = new MirrorWhiteboard(
  document.getElementById('root-mirror') as HTMLDivElement,
  {
    sources: images,
    eventHub
  }
);

mirrorWhiteboard.open();
```

## Whiteboard replay mode

```ts
import { ReplayWhiteboard } from 'fc-whiteboard';
import * as events from './events.json';

let hasSend = false;

const whiteboard = new ReplayWhiteboard(document.getElementById('root') as HTMLDivElement);

whiteboard.setContext(events[0].timestamp, async (t1, t2) => {
  if (!hasSend) {
    hasSend = true;
    return events as any;
  }

  return [];
});

whiteboard.open();
```

The persistent events are listed as follow:

```json
[
  {
    "event": "borderSnap",
    "id": "08e65660-6064-11e9-be21-fb33250b411f",
    "target": "whiteboard",
    "border": {
      "id": "08e65660-6064-11e9-be21-fb33250b411f",
      "sources": [
        "https://upload-images.jianshu.io/upload_images/1647496-6bede989c09af527.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240",
        "http://upload-images.jianshu.io/upload_images/1647496-d281090a702045e5.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240",
        "http://upload-images.jianshu.io/upload_images/1647496-611a416be07d7ca3.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240"
      ],
      "pageIds": [
        "08e65661-6064-11e9-be21-fb33250b411f",
        "08e6a480-6064-11e9-be21-fb33250b411f",
        "08e6cb91-6064-11e9-be21-fb33250b411f"
      ],
      "visiblePageIndex": 0,
      "pages": [
        { "id": "08e65661-6064-11e9-be21-fb33250b411f", "markers": [] },
        { "id": "08e6a480-6064-11e9-be21-fb33250b411f", "markers": [] },
        { "id": "08e6cb91-6064-11e9-be21-fb33250b411f", "markers": [] }
      ]
    },
    "timestamp": 1555431837
  }
  ...
]
```

## Use drawboard alone

```html
<img id="root" src="https://upload-images.jianshu.io/upload_images/1647496-6bede989c09af527.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240"></img>
```

```ts
import { Drawboard } from 'fc-whiteboard/src';

const d = new Drawboard({
  imgEle: document.getElementById('root') as HTMLImageElement
});

d.open();
```

# Event System | 事件系统

仅在 WhiteBoard 与 WhitePage 级别提供了事件的响应，而在 Drawboard 与 Marker 级别提供了事件的触发。

事件类型分为 Snapshot（snap）与 Key Actions（ka）两种。

# Todos

- [x] 结构化事件信息，添加绝对时间戳以适应重放的需求；将 WhitePage 中的事件响应统一提取到 Whiteboard 中。
- [x] 引入全量的状态订正，每 5 秒订正一次，设置线性 Marker 的全量同步规则
- [x] 设置矩形类 Marker 的全量同步规则，设置仅全量同步模式
- [x] 将白板划分为 Whiteboard, MirrorWhiteboard, ReplayWhiteboard 三种模式，开始编写录播模式，修复增量同步与全量同步冲突的问题。
- [x] 根据获得到的事件的时间进行重播，完善录播模式功能。
- [x] 优化 Toolbar 样式，增加 Toolbar 拖拽功能
- [ ] 增加拖拽绘制功能
- [ ] 添加全屏的绘制功能，全屏绘制会基于新的全局 div 元素，而非直接将当前元素扩大化
- [ ] 添加 Whiteboard 的 Loading 界面
- [ ] 支持编辑中途的缩放能力，将全屏的画板与局部画板的事件达到同步

# Motivation & Credits

- [markerjs](https://markerjs.com/)
