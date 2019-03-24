import { WhitePageSource } from './../types';
import { Baseboard } from './../Baseboard/index';
import { BaseMarker } from './../../markers/BaseMarker/index';
import { getToolbars } from './../../toolbar/toolbar-items';
import { WhitePage } from './../WhitePage/index';
import { onChangeFunc } from './../../event/Event';

import { Synthetizer } from '../../renderer/Synthetizer';
import { Toolbar } from '../../toolbar/Toolbar';
import { ToolbarItem } from '../../toolbar/ToolbarItem';

import './index.less';

export class Drawboard extends Baseboard {
  /** 句柄 */
  page: WhitePage;

  private markers: BaseMarker[];
  get markerMap(): { [key: string]: BaseMarker } {
    const map = {};
    this.markers.forEach(marker => {
      map[marker.id] = marker;
    });
    return map;
  }
  private activeMarker: BaseMarker | null;

  private toolbar: Toolbar;
  private toolbarUI: HTMLElement;

  /** 回调 */
  private onComplete: (dataUrl: string) => void = () => {};
  private onChange: onChangeFunc = () => {};
  private onCancel: () => void;

  private toolbars: ToolbarItem[] = getToolbars();
  private scale = 1.0;

  constructor(
    source: WhitePageSource,
    { page, onChange }: { page?: WhitePage; onChange?: onChangeFunc } = {}
  ) {
    super(source);

    if (page) {
      this.page = page;
    }

    this.markers = [];
    this.activeMarker = null;

    if (onChange) {
      this.onChange = onChange;
    }
  }

  /** @region LifeCycle open - hide - show - ... - close */
  /** 打开画板 */
  public open = (onComplete?: (dataUrl: string) => void, onCancel?: () => void) => {
    if (onComplete) {
      this.onComplete = onComplete;
    }

    if (onCancel) {
      this.onCancel = onCancel;
    }

    this.setTargetRect();

    this.initBoard();
    this.attachEvents();
    this.setStyles();

    window.addEventListener('resize', this.adjustUI);

    if (this.page.mode !== 'mirror') {
      this.showUI();
    }
  };

  public hide = () => {
    if (this.source.imgSrc) {
      this.target.style.display = 'none';
    }
    // 这里不使用 display:none，是为了保证在隐藏时候仍然可以执行更新
    this.boardHolder.style.opacity = '0';
    this.boardHolder.style.zIndex = '-1';
    this.toolbar.hide();
  };

  public show = () => {
    if (this.source.imgSrc) {
      this.target.style.display = 'block';
    }

    this.boardHolder.style.opacity = '1';
    this.boardHolder.style.zIndex = '9999';
    this.toolbar.show();
  };

  public close = () => {
    if (this.toolbarUI) {
      document.body.removeChild(this.toolbarUI);
    }
    if (this.boardCanvas) {
      document.body.removeChild(this.boardHolder);
    }
  };

  public render = (onComplete: (dataUrl: string) => void, onCancel?: () => void) => {
    this.onComplete = onComplete;

    if (onCancel) {
      this.onCancel = onCancel;
    }

    this.selectMarker(null);
    this.startRender(this.renderFinished);
  };

  public addMarker = (markerType: typeof BaseMarker, { id }: { id?: string } = {}) => {
    const marker = markerType.createMarker();

    // 假如 Drawboard 存在 Page 引用，则传导给 Marker
    if (this.page) {
      marker.page = this.page;
    }

    if (id) {
      marker.id = id;
    }

    marker.onSelected = this.selectMarker;
    marker.onChange = this.onChange;

    if (marker.defs && marker.defs.length > 0) {
      for (const d of marker.defs) {
        if (d.id && !this.boardCanvas.getElementById(d.id)) {
          this.defs.appendChild(d);
        }
      }
    }

    // 触发事件流
    this.onChange({
      target: 'drawboard',
      id: this.id,
      event: 'add',
      data: { type: marker.type, id: marker.id }
    });

    this.markers.push(marker);

    this.selectMarker(marker);

    this.boardCanvas.appendChild(marker.visual);

    const bbox = marker.visual.getBBox();
    const x = this.width / 2 / this.scale - bbox.width / 2;
    const y = this.height / 2 / this.scale - bbox.height / 2;

    const translate = marker.visual.transform.baseVal.getItem(0);
    translate.setMatrix(translate.matrix.translate(x, y));
    marker.visual.transform.baseVal.replaceItem(translate, 0);
  };

  public deleteActiveMarker = () => {
    if (this.activeMarker) {
      // 触发事件
      if (this.onChange) {
        this.onChange({
          event: 'remove',
          id: this.id,
          target: 'drawboard',
          data: { id: this.activeMarker.id }
        });
      }
      this.deleteMarker(this.activeMarker);
    }
  };

  private setTargetRect = () => {
    const targetRect = this.target.getBoundingClientRect() as DOMRect;
    const bodyRect = document.body.parentElement!.getBoundingClientRect();
    this.targetRect = {
      left: targetRect.left - bodyRect.left,
      top: targetRect.top - bodyRect.top
    } as ClientRect;
  };

  private startRender = (done: (dataUrl: string) => void) => {
    const renderer = new Synthetizer();
    renderer.rasterize(this.target, this.boardCanvas, done);
  };

  private attachEvents = () => {
    this.boardCanvas.addEventListener('mousedown', this.mouseDown);
    this.boardCanvas.addEventListener('mousemove', this.mouseMove);
    this.boardCanvas.addEventListener('mouseup', this.mouseUp);
  };

  private mouseDown = (ev: MouseEvent) => {
    /* tslint:disable:no-bitwise */
    if (this.activeMarker && (ev.buttons & 1) > 0) {
      this.activeMarker.deselect();
      this.activeMarker = null;
    }
  };

  private mouseMove = (ev: MouseEvent) => {
    /* tslint:disable:no-bitwise */
    if (this.activeMarker && (ev.buttons & 1) > 0) {
      this.activeMarker.manipulate(ev);
    }
  };

  private mouseUp = (ev: MouseEvent) => {
    if (this.activeMarker) {
      this.activeMarker.endManipulation();
    }
  };

  private adjustUI = (ev: UIEvent) => {
    this.adjustSize();
    this.positionUI();
  };

  private adjustSize = () => {
    this.width = this.target.clientWidth;
    this.height = this.target.clientHeight;

    const scale = this.target.clientWidth / this.boardHolder.clientWidth;
    if (scale !== 1.0) {
      this.scale *= scale;
      this.boardHolder.style.width = `${this.width}px`;
      this.boardHolder.style.height = `${this.height}px`;

      this.boardHolder.style.transform = `scale(${this.scale})`;
    }
  };

  private positionUI = () => {
    this.setTargetRect();
    this.positionBoard();
    this.positionToolbar();
  };

  private positionToolbar = () => {
    this.toolbarUI.style.left = `${this.targetRect.left +
      this.target.offsetWidth -
      this.toolbarUI.clientWidth}px`;
    this.toolbarUI.style.top = `${this.targetRect.top - this.toolbarUI.clientHeight}px`;
  };

  private showUI = () => {
    this.toolbar = new Toolbar(this.toolbars, this.toolbarClick);
    this.toolbarUI = this.toolbar.getUI();
    document.body.appendChild(this.toolbarUI);
    this.toolbarUI.style.position = 'absolute';
    this.positionToolbar();
  };

  private setStyles = () => {
    const editorStyleSheet = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    editorStyleSheet.innerHTML = `
            .rect-marker .render-visual {
                stroke: #ff0000;
                stroke-width: 3;
                fill: transparent;
            }
            .cover-marker .render-visual {
                stroke-width: 0;
                fill: #000000;
            }
            .highlight-marker .render-visual {
                stroke: transparent;
                stroke-width: 0;
                fill: #ffff00;
                fill-opacity: 0.4;
            }
            .line-marker .render-visual {
                stroke: #ff0000;
                stroke-width: 3;
                fill: transparent;
            }
            .arrow-marker .render-visual {
                stroke: #ff0000;
                stroke-width: 3;
                fill: transparent;
            }
            .arrow-marker-tip {
                stroke-width: 0;
                fill: #ff0000;
            }
            .text-marker text {
                fill: #ff0000;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
                    Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji",
                    "Segoe UI Emoji", "Segoe UI Symbol";
            }
            .fc-whiteboard-rect-control-box .fc-whiteboard-rect-control-rect {
                stroke: black;
                stroke-width: 1;
                stroke-opacity: 0.5;
                stroke-dasharray: 3, 2;
                fill: transparent;
            }
            .fc-whiteboard-control-grip {
                fill: #cccccc;
                stroke: #333333;
                stroke-width: 2;
            }
        `;

    this.boardCanvas.appendChild(editorStyleSheet);
  };

  private toolbarClick = (ev: MouseEvent, toolbarItem: ToolbarItem) => {
    if (toolbarItem.markerType) {
      this.addMarker(toolbarItem.markerType);
    } else {
      // command button
      switch (toolbarItem.name) {
        case 'delete': {
          this.deleteActiveMarker();
          break;
        }
        case 'pointer': {
          if (this.activeMarker) {
            this.selectMarker(null);
          }
          break;
        }
        case 'close': {
          this.cancel();
          break;
        }
        case 'ok': {
          this.complete();
          break;
        }
        default:
          break;
      }
    }
  };

  private selectMarker = (marker: BaseMarker | null) => {
    if (this.activeMarker && this.activeMarker !== marker) {
      this.activeMarker.deselect();
    }
    this.activeMarker = marker;
  };

  public deleteMarker = (marker: BaseMarker) => {
    this.boardCanvas.removeChild(marker.visual);
    if (this.activeMarker === marker) {
      this.activeMarker = null;
    }
    this.markers.splice(this.markers.indexOf(marker), 1);
  };

  private complete = () => {
    this.selectMarker(null);
    this.startRender(this.renderFinishedClose);
  };

  private cancel = () => {
    this.close();
    if (this.onCancel) {
      this.onCancel();
    }
  };

  private renderFinished = (dataUrl: string) => {
    this.onComplete(dataUrl);
  };

  private renderFinishedClose = (dataUrl: string) => {
    this.close();
    this.onComplete(dataUrl);
  };
}
