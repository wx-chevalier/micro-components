import { TextMarker } from './../../markers/TextMarker/index';
import { MarkerType } from './../../markers/types';
import { ChangeEvent } from './../../event/Event';
import { EventHub } from '../../event/EventHub';
import { WhiteboardMode, WhitePageSource } from './../types';
import { Drawboard } from './../Drawboard/index';
import { uuid } from './../../utils/uuid';
import { getMarkerByType } from '../../markers/types';

/** 白板中的每一页 */
export class WhitePage {
  id: string = uuid();

  source: WhitePageSource;
  target: HTMLImageElement;

  /** UI Options */
  container?: HTMLDivElement;
  // 父容器指针
  parentContainer?: HTMLDivElement;
  mode: WhiteboardMode = 'master';

  /** Handlers */
  drawboard: Drawboard;
  eventHub?: EventHub;

  constructor(
    source: WhitePageSource,
    {
      mode,
      eventHub,
      parentContainer
    }: { mode?: WhiteboardMode; eventHub?: EventHub; parentContainer?: HTMLDivElement } = {}
  ) {
    if (mode) {
      this.mode = mode;
    }
    this.eventHub = eventHub;
    this.parentContainer = parentContainer;

    this.initSource(source);

    if (this.mode === 'master') {
      this.initMaster();
    }

    if (this.mode === 'mirror') {
      this.initMirror();
    }
  }

  /** LifeCycle open - close */
  public open() {
    this.drawboard.open();
  }

  public hide() {
    this.drawboard.hide();
  }

  public show() {
    this.drawboard.show();
  }

  public close() {
    this.drawboard.close();
  }

  /** 初始化源 */
  private initSource(source: WhitePageSource) {
    // 判断 Source 的类型是否符合要求
    if (typeof source.imgSrc === 'string' && !this.parentContainer) {
      throw new Error('Invalid source, If you set image url, you must also set parentContainer');
    }

    this.source = source;

    // 如果传入的 imgEle，则直接使用
    if (source.imgEle) {
      this.target = source.imgEle!;
    }

    // 如果是图片，则需要创建 Image 元素
    if (typeof source.imgSrc === 'string') {
      this.container = document.createElement('div');

      this.target = document.createElement('img');
      this.target.src = source.imgSrc;
      this.target.alt = 'Siema image';

      this.container.appendChild(this.target);
      this.parentContainer!.appendChild(this.container);
    }

    // 设置 target 的一系列属性
    this.target.className = `${this.target.className || ''} fcw-whitepage`.trim();
  }

  /** 以 Master 模式启动 */
  protected initMaster() {
    if (this.eventHub) {
      // 对于 WhitePage 中加载的 Drawboard，必须是传入自身可控的 Image 元素
      this.drawboard = new Drawboard(
        { imgEle: this.target },
        {
          page: this,
          onChange: ev => this.eventHub!.emit('change', ev)
        }
      );
    } else {
      this.drawboard = new Drawboard({ imgEle: this.target }, { page: this });
    }
  }

  protected initMirror() {
    if (!this.eventHub) {
      throw new Error('Invalid eventHub');
    }

    this.drawboard = new Drawboard({ imgEle: this.target }, { page: this });

    this.eventHub.on('change', (ev: ChangeEvent) => {
      if (ev.event === 'add') {
        const data: { id: string; type: MarkerType } = ev.data as {
          id: string;
          type: MarkerType;
        };

        // 这里判断该 Marker 是否已经添加过；如果已经存在则忽略
        const marker = this.drawboard.markerMap[data.id];
        if (!marker) {
          this.drawboard.addMarker(getMarkerByType(data.type), { id: data.id });
        }
      }

      if (ev.event === 'remove') {
        const data: { id: string } = ev.data as {
          id: string;
        };

        const marker = this.drawboard.markerMap[data.id];
        this.drawboard.deleteMarker(marker);
      }

      if (ev.event === 'move' || ev.event === 'resize') {
        const marker = this.drawboard.markerMap[ev.id];

        if (marker) {
          marker.reactToManipulation(ev.event, ev.data as any);
        }
      }

      // 响应文本变化事件
      if (ev.event === 'changeText') {
        const marker = this.drawboard.markerMap[ev.id] as TextMarker;
        if (marker) {
          marker.setText(ev.data as string);
        }
      }
    });
  }
}
