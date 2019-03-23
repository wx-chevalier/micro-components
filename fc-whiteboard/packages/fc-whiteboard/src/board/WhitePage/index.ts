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
  mode: WhiteboardMode = 'master';

  source: WhitePageSource;

  drawboard: Drawboard;
  eventHub?: EventHub;

  constructor(
    source: WhitePageSource,
    { mode, eventHub }: { mode?: WhiteboardMode; eventHub?: EventHub } = {}
  ) {
    if (mode) {
      this.mode = mode;
    }

    this.initSource(source);

    this.eventHub = eventHub;

    if (this.mode === 'master') {
      this.initMaster();
    }

    if (this.mode === 'mirror') {
      this.initMirror();
    }
  }

  /** 初始化源 */
  initSource(source: WhitePageSource) {
    this.source = source;
    ``;
  }

  /** 以 Master 模式启动 */
  initMaster() {
    if (this.eventHub) {
      this.drawboard = new Drawboard(this.source, {
        page: this,
        onChange: ev => this.eventHub!.emit('change', ev)
      });
    } else {
      this.drawboard = new Drawboard(this.source, { page: this });
    }
  }

  initMirror() {
    if (!this.eventHub) {
      throw new Error('Invalid eventHub');
    }

    this.drawboard = new Drawboard(this.source, { page: this });

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
