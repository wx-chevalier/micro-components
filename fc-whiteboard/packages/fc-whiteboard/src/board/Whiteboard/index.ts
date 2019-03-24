import * as Siema from 'siema';

import { EventHub } from './../../event/EventHub';
import { WhitePage } from './../WhitePage/index';
import { WhiteboardMode } from '../types';
import { uuid } from 'fc-whiteboard/src/utils/uuid';

import './index.less';

export class Whiteboard {
  id: string = uuid();

  /** 元素 */
  sources: string[] = [];
  // 如果传入的是图片地址，则需要挂载到该 Target 元素下
  target: HTMLDivElement;

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
  visiblePageIndex: number = 0;

  constructor(
    target: HTMLDivElement,
    sources: string[],
    {
      eventHub,
      mode,
      visiblePageIndex
    }: { eventHub?: EventHub; mode?: WhiteboardMode; visiblePageIndex?: number } = {}
  ) {
    this.sources = sources;
    this.eventHub = eventHub;

    if (mode) {
      this.mode = mode;
    }

    if (target) {
      this.target = target;
    } else {
      this.target = document.createElement('div');
      document.body.appendChild(this.target);
    }

    if (!this.target.id) {
      this.target.id = this.id;
    }
    this.target.className = `${this.target.className} fcw-whiteboard`;

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

  /** 初始化操作 */
  private init() {
    // 初始化所有的 WhitePages
    this.sources.forEach(source => {
      const page = new WhitePage(
        { imgSrc: source },
        {
          mode: this.mode,
          eventHub: this.eventHub,
          parentContainer: this.target
        }
      );

      this.pages.push(page);
    });

    // 初始化
    this.siema = new Siema({
      selector: this.target,
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

    const prev = document.querySelector('#prev');
    const next = document.querySelector('#next');

    prev!.addEventListener('click', () => {
      console.log(11);
      this.siema.prev();
    });
    next!.addEventListener('click', () => {
      console.log(12);
      this.siema.next();
    });
  }
}
