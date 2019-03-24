import { SyncEvent } from './../../event/Event';
import * as Siema from 'siema';

import { WhiteboardMode } from '../types';
import { WhitePage } from '../WhitePage/index';
import { EventHub } from '../../event/EventHub';
import { uuid } from '../../utils/uuid';
import { addClassName, createDivWithClassName } from '../../utils/dom';

import './index.less';

const LeftArrowIcon = require('../../assets/bx-left-arrow.svg');
const RightArrowIcon = require('../../assets/bx-right-arrow.svg');

const prefix = 'fcw-board';

export class SerializableWhiteboard {
  id: string;
  sources: string[];
  pageIds: string[];
  visiblePageIndex: number;
}

export class Whiteboard {
  id: string = uuid();
  sources: string[] = [];

  /** 元素 */
  // 如果传入的是图片地址，则需要挂载到该 Target 元素下
  target: HTMLDivElement;
  imgsContainer: HTMLDivElement;
  pagesContainer: HTMLDivElement;

  /** UI Options */
  // 事件中心
  eventHub?: EventHub;
  // 编辑模式
  mode: WhiteboardMode = 'master';
  // 是否为全屏模式
  isFullscreen: boolean = false;

  /** 句柄 */
  pages: WhitePage[] = [];
  siema: any;

  /** State | 内部状态 */
  // 是否被初始化过，如果尚未被初始化，则等待来自于 Master 的同步消息
  isInitialized: boolean = false;
  visiblePageIndex: number = 0;
  emitInterval: any;

  constructor(
    target: HTMLDivElement,
    {
      sources,
      eventHub,
      mode,
      visiblePageIndex
    }: {
      sources?: string[];
      eventHub?: EventHub;
      mode?: WhiteboardMode;
      visiblePageIndex?: number;
    } = {}
  ) {
    if (target) {
      this.target = target;
    } else {
      this.target = document.createElement('div');
      document.body.appendChild(this.target);
    }

    if (!this.target.id) {
      this.target.id = this.id;
    }

    addClassName(this.target, prefix);

    if (sources) {
      this.sources = sources;
    }

    this.eventHub = eventHub;

    if (mode) {
      this.mode = mode;
    }

    // set inner state
    if (typeof visiblePageIndex !== 'undefined') {
      this.visiblePageIndex = visiblePageIndex;
    }

    this.init();
  }

  /** LifeCycle */
  public open() {
    // 依次渲染所有的页，隐藏非当前页之外的其他页
    this.pages.forEach((page, i) => {
      page.open();

      if (i !== this.visiblePageIndex) {
        page.hide();
      }
    });
  }

  /** 关闭当前的 Whiteboard */
  public close() {
    if (this.emitInterval) {
      clearInterval(this.emitInterval);
    }
  }

  /** 获取当前快照 */
  public snap(): SerializableWhiteboard {
    return {
      id: this.id,
      sources: this.sources,
      pageIds: this.pages.map(page => page.id),
      visiblePageIndex: this.visiblePageIndex
    };
  }

  /** 初始化操作 */
  private init() {
    // 为 target 添加子 imgs 容器
    this.imgsContainer = createDivWithClassName(`${prefix}-imgs`, this.target);
    // 为 target 添加子 pages 容器
    this.pagesContainer = createDivWithClassName(`${prefix}-pages`, this.target);

    if (this.mode === 'master') {
      this.initMaster();

      this.emitSnapshot();
    }

    if (this.mode === 'mirror') {
      this.initMirror();
    }
  }

  /** 以主模式启动 */
  private initMaster() {
    // 初始化所有的 WhitePages
    this.sources.forEach(source => {
      const page = new WhitePage(
        { imgSrc: source },
        {
          mode: this.mode,
          eventHub: this.eventHub,
          parentContainer: this.pagesContainer
        }
      );

      // 这里隐藏 Dashboard 的图片源，Siema 切换的是占位图片
      page.container.style.opacity = '0';

      this.pages.push(page);
    });

    this.initSiema();

    // 初始化控制节点
    const controller = createDivWithClassName(`${prefix}-controller`, this.target);

    const prevEle = createDivWithClassName(`${prefix}-flip-arrow`, controller);
    prevEle.innerHTML = LeftArrowIcon;

    const nextEle = createDivWithClassName(`${prefix}-flip-arrow`, controller);
    nextEle.innerHTML = RightArrowIcon;

    nextEle!.addEventListener('click', () => {
      const nextPageIndex =
        this.visiblePageIndex + 1 > this.pages.length - 1 ? 0 : this.visiblePageIndex + 1;
      this.onPageChange(nextPageIndex);
    });
    prevEle!.addEventListener('click', () => {
      const nextPageIndex =
        this.visiblePageIndex - 1 < 0 ? this.pages.length - 1 : this.visiblePageIndex - 1;

      this.onPageChange(nextPageIndex);
    });
  }

  /** 以镜像模式启动 */
  private initMirror() {
    if (!this.eventHub) {
      throw new Error('Invalid eventHub');
    }

    this.eventHub.on('sync', (ev: SyncEvent) => {
      if (ev.target === 'whiteboard' && ev.event === 'snap') {
        // 如果已经初始化完毕，则直接跳过
        if (this.isInitialized) {
          return;
        }

        this.onSnapshot(ev.data as SerializableWhiteboard);
      }
    });
  }

  /** 初始化 Siema */
  private initSiema() {
    // 初始化所有的占位图片，用于给 Siema 播放使用
    this.sources.forEach(source => {
      const imgEle = document.createElement('img');
      addClassName(imgEle, `${prefix}-img`);
      imgEle.src = source;
      imgEle.alt = 'Siema image';

      this.imgsContainer.appendChild(imgEle);
    });

    // 初始化 Siema，并且添加控制节点
    this.siema = new Siema({
      selector: this.imgsContainer,
      duration: 200,
      easing: 'ease-out',
      perPage: 1,
      startIndex: 0,
      draggable: false,
      multipleDrag: true,
      threshold: 20,
      loop: false,
      rtl: false
    });
  }

  /** 响应页面切换的事件 */
  private onPageChange(nextPageIndex: number) {
    this.siema.goTo(nextPageIndex);
    this.visiblePageIndex = nextPageIndex;

    // 将所有的 Page 隐藏
    this.pages.forEach((page, i) => {
      if (nextPageIndex === i) {
        page.show();
      } else {
        page.hide();
      }
    });
  }

  private emitSnapshot() {
    const innerFunc = () => {
      if (this.eventHub) {
        this.eventHub.emit('sync', {
          event: 'snap',
          id: this.id,
          target: 'whiteboard',
          data: this.snap()
        });
      }
    };

    // 定期触发事件
    this.emitInterval = setInterval(() => {
      innerFunc();
    }, 5 * 1000);

    // 首次事件，延时 500ms 发出
    setTimeout(innerFunc, 500);
  }

  /** 响应获取到的快照事件 */
  private onSnapshot(snap: SerializableWhiteboard) {
    const { sources, pageIds } = snap;

    if (!this.isInitialized) {
      this.sources = sources;
      this.initSiema();

      // 初始化所有的 WhitePages
      this.sources.forEach((source, i) => {
        const page = new WhitePage(
          { imgSrc: source },
          {
            mode: this.mode,
            eventHub: this.eventHub,
            parentContainer: this.pagesContainer
          }
        );
        page.id = pageIds[i];

        // 这里隐藏 Dashboard 的图片源，Siema 切换的是占位图片
        page.container.style.opacity = '0';

        this.pages.push(page);

        page.open();
      });
    }

    this.isInitialized = true;
  }
}
