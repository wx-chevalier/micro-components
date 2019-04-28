import { Mode } from './../../utils/types';
import { SyncEvent } from '../../event/SyncEvent';

import { WhitePage } from '../WhitePage/index';
import { EventHub } from '../../event/EventHub';
import { uuid } from '../../utils/uuid';
import { addClassName } from '../../utils/dom';

import './index.less';
import { WhiteboardSnap } from '../AbstractWhiteboard/snap';
import * as Siema from 'siema';

const prefix = 'fcw-board';

export abstract class AbstractWhiteboard {
  id: string = uuid();
  sources: string[] = [];

  /** 元素 */
  // 如果传入的是图片地址，则需要挂载到该 Target 元素下
  target: HTMLDivElement;
  imgEles: HTMLImageElement[] = [];
  imgsContainer: HTMLDivElement;
  pagesContainer: HTMLDivElement;

  /** Options */
  // 是否仅同步快照数据，用于弱网状态下
  onlyEmitSnap: boolean = false;
  snapInterval: number = 15 * 1000;

  /** UI Options */
  // 事件中心
  eventHub?: EventHub;
  // 编辑模式
  mode: Mode = 'master';
  // 是否为全屏模式
  isFullscreen: boolean = false;

  /** 句柄 */
  pages: WhitePage[] = [];
  get activePage() {
    return this.pages[this.visiblePageIndex];
  }
  get pageMap(): Record<string, WhitePage> {
    const map = {};
    this.pages.forEach(p => (map[p.id] = p));

    return map;
  }
  siema: any;

  /** State | 内部状态 */
  // 是否被初始化过，如果尚未被初始化，则等待来自于 Master 的同步消息
  isInitialized: boolean = false;
  isSyncing: boolean = false;
  visiblePageIndex: number = 0;
  emitInterval: any;

  constructor(
    target: HTMLDivElement,
    { sources, eventHub, visiblePageIndex, onlyEmitSnap }: Partial<AbstractWhiteboard> = {}
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

    // set inner state
    if (typeof visiblePageIndex !== 'undefined') {
      this.visiblePageIndex = visiblePageIndex;
    }

    this.onlyEmitSnap = !!onlyEmitSnap;

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

  /** 展示当前的 WhitePage */
  public show() {
    if (this.activePage) {
      this.activePage.show();
    }
  }

  public hide() {
    if (this.activePage) {
      this.activePage.hide();
    }
  }

  /** 触发事件 */
  public emit(borderEvent: SyncEvent) {
    if (this.mode !== 'master' || !this.eventHub) {
      return;
    }

    // 在快照模式下，仅同步快照消息
    if (this.onlyEmitSnap) {
      if (borderEvent.event !== 'borderSnap') {
        return;
      }
    }

    borderEvent.timestamp = Math.floor(Date.now() / 1000);
    this.eventHub.emit('sync', borderEvent);
  }

  /** 获取当前快照 */
  public captureSnap(shadow: boolean = true): WhiteboardSnap {
    if (shadow) {
      return {
        id: this.id,
        sources: this.sources,
        pageIds: this.pages.map(page => page.id),
        visiblePageIndex: this.visiblePageIndex
      };
    }

    return {
      id: this.id,
      sources: this.sources,
      pageIds: this.pages.map(page => page.id),
      visiblePageIndex: this.visiblePageIndex,
      pages: this.pages.map(p => p.captureSnap())
    };
  }

  /** 初始化操作 */
  protected abstract init(): void;

  /** 初始化 Siema */
  protected initSiema() {
    // 初始化所有的占位图片，用于给 Siema 播放使用
    this.sources.forEach(source => {
      const imgEle = document.createElement('img');
      addClassName(imgEle, `${prefix}-img`);
      imgEle.src = source;
      imgEle.alt = 'Siema image';

      this.imgEles.push(imgEle);
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
}