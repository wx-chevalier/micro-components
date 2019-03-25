import { WhitePage } from './../../board/WhitePage/index';
import { PositionType } from '../../event/Event';
import { onSyncFunc, EventType } from '../../event/Event';
import { MarkerType } from '../types';
import * as uuid from 'uuid/v1';
import { SvgHelper } from '../../renderer/SvgHelper';

export class BaseMarker {
  id: string = uuid();
  type: MarkerType = 'base';
  // 归属的
  page?: WhitePage;
  // Marker 的属性发生变化后的回调
  onChange: onSyncFunc = () => {};

  public static createMarker = (page?: WhitePage): BaseMarker => {
    const marker = new BaseMarker();
    marker.page = page;
    marker.setup();
    return marker;
  };

  public visual: SVGGElement;
  public renderVisual: SVGGElement;

  public onSelected: (marker: BaseMarker) => void;

  public defs: SVGElement[] = [];

  protected width: number = 200;
  protected height: number = 50;

  protected isActive: boolean = true;
  protected isDragging: boolean = false;
  protected isResizing: boolean = false;

  protected previousMouseX: number = 0;
  protected previousMouseY: number = 0;

  public reactToManipulation(
    type: EventType,
    { dx, dy, pos }: { dx: number; dy: number; pos: PositionType }
  ) {
    if (type === 'move') {
      this.move(dx, dy);
    }

    if (type === 'resize') {
      this.resizeByEvent(dx, dy, pos);
    }
  }

  /** 响应元素视图状态变化 */
  public manipulate = (ev: MouseEvent) => {
    const scale = this.visual.getScreenCTM()!.a;
    const dx = (ev.screenX - this.previousMouseX) / scale;
    const dy = (ev.screenY - this.previousMouseY) / scale;

    if (this.isDragging) {
      this.onChange({ target: 'marker', id: this.id, event: 'move', data: { dx, dy } });
      this.move(dx, dy);
    }

    if (this.isResizing) {
      this.resize(dx, dy, (pos: PositionType) => {
        this.onChange({ target: 'marker', id: this.id, event: 'resize', data: { dx, dy, pos } });
      });
    }

    this.previousMouseX = ev.screenX;
    this.previousMouseY = ev.screenY;
  };

  public endManipulation() {
    this.isDragging = false;
    this.isResizing = false;
  }

  public select() {
    this.isActive = true;
    if (this.onSelected) {
      this.onSelected(this);
    }
    return;
  }

  public deselect() {
    this.isActive = false;
    this.endManipulation();
    return;
  }

  protected setup() {
    this.visual = SvgHelper.createGroup();
    // translate
    this.visual.transform.baseVal.appendItem(SvgHelper.createTransform());

    this.visual.addEventListener('mousedown', this.mouseDown);
    this.visual.addEventListener('mouseup', this.mouseUp);
    this.visual.addEventListener('mousemove', this.mouseMove);

    this.visual.addEventListener('touchstart', this.onTouch, { passive: false });
    this.visual.addEventListener('touchend', this.onTouch, { passive: false });
    this.visual.addEventListener('touchmove', this.onTouch, { passive: false });

    this.renderVisual = SvgHelper.createGroup([['class', 'render-visual']]);
    this.visual.appendChild(this.renderVisual);
  }

  protected addToVisual = (el: SVGElement) => {
    this.visual.appendChild(el);
  };

  protected addToRenderVisual = (el: SVGElement) => {
    this.renderVisual.appendChild(el);
  };

  protected resize(x: number, y: number, cb?: Function) {
    return;
  }
  protected resizeByEvent(x: number, y: number, pos?: PositionType) {
    return;
  }

  /** 截获 Touch 事件，并且转发为 Mouse 事件 */
  protected onTouch(ev: TouchEvent) {
    ev.preventDefault();
    const newEvt = document.createEvent('MouseEvents');
    const touch = ev.changedTouches[0];
    let type = null;

    switch (ev.type) {
      case 'touchstart':
        type = 'mousedown';
        break;
      case 'touchmove':
        type = 'mousemove';
        break;
      case 'touchend':
        type = 'mouseup';
        break;
      default:
        break;
    }

    newEvt.initMouseEvent(
      type!,
      true,
      true,
      window,
      0,
      touch.screenX,
      touch.screenY,
      touch.clientX,
      touch.clientY,
      ev.ctrlKey,
      ev.altKey,
      ev.shiftKey,
      ev.metaKey,
      0,
      null
    );

    ev.target!.dispatchEvent(newEvt);
  }

  private mouseDown = (ev: MouseEvent) => {
    ev.stopPropagation();

    if (this.page && this.page.mode === 'mirror') {
      return;
    }

    this.select();
    this.isDragging = true;
    this.previousMouseX = ev.screenX;
    this.previousMouseY = ev.screenY;
  };

  private mouseUp = (ev: MouseEvent) => {
    ev.stopPropagation();
    this.endManipulation();
  };

  private mouseMove = (ev: MouseEvent) => {
    ev.stopPropagation();
    this.manipulate(ev);
  };

  private move = (dx: number, dy: number) => {
    const translate = this.visual.transform.baseVal.getItem(0);
    translate.setMatrix(translate.matrix.translate(dx, dy));
    this.visual.transform.baseVal.replaceItem(translate, 0);
  };
}
