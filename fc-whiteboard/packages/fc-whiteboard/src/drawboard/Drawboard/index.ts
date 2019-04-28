import { Source } from './../../utils/types';
import { Baseboard } from './../Baseboard/index';
import { BaseMarker } from './../../markers/BaseMarker/index';
import { getToolbars } from './../../toolbar/toolbar-items';
import { WhitePage } from '../../whiteboard/WhitePage';
import { onSyncFunc } from '../../event/SyncEvent';

import { Synthetizer } from '../../renderer/Synthetizer';
import { Toolbar } from '../../toolbar/Toolbar';
import { ToolbarItem } from '../../toolbar/ToolbarItem';

import './index.less';

export class Drawboard extends Baseboard {
  /** Options */
  scale = 1.0;
  zIndex: number = 999;

  /** 句柄 */
  page: WhitePage;

  markers: BaseMarker[];
  get markerMap(): { [key: string]: BaseMarker } {
    const map = {};
    this.markers.forEach(marker => {
      map[marker.id] = marker;
    });
    return map;
  }
  activeMarker: BaseMarker | null;

  toolbarItems: ToolbarItem[];

  toolbar: Toolbar;
  toolbarUI: HTMLElement;

  /** 回调 */
  onComplete: (dataUrl: string) => void = () => {};
  onChange: onSyncFunc = () => {};
  onCancel: () => void;

  constructor(
    source: Source,
    {
      page,
      zIndex,
      extraToolbarItems,
      onChange
    }: Partial<Drawboard> & { extraToolbarItems?: ToolbarItem[] } = {}
  ) {
    super(source);

    if (page) {
      this.page = page;
    }

    if (zIndex) {
      this.zIndex = zIndex;
    }

    this.markers = [];
    this.activeMarker = null;

    const toolbarItems = getToolbars(page);

    if (extraToolbarItems) {
      toolbarItems.push(...extraToolbarItems);
    }

    this.toolbarItems = toolbarItems;

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

    if ((this.page && this.page.mode === 'master') || !this.page) {
      this.showUI();
    }
  };

  public hide = () => {
    if (this.source.imgSrc) {
      this.target.style.display = 'none';
    }
    // 这里不使用 display:none，是为了保证在隐藏时候仍然可以执行更新
    this.boardHolder.style.visibility = 'hidden';
    this.boardHolder.style.zIndex = '-1';

    if (this.toolbar) {
      this.toolbar.hide();
    }
  };

  public show = () => {
    if (this.source.imgSrc) {
      this.target.style.display = 'block';
    }

    this.boardHolder.style.visibility = 'visible';
    this.boardHolder.style.zIndex = `${this.zIndex}`;

    if (this.toolbar) {
      this.toolbar.show();
    }
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

  /** 添加某个 Marker */
  public addMarker = (markerType: typeof BaseMarker, { id }: { id?: string } = {}) => {
    // 假如 Drawboard 存在 Page 引用，则传导给 Marker
    const marker = markerType.createMarker(this.page);

    if (id) {
      marker.id = id;
    }

    marker.drawboard = this;
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
      target: 'marker',
      parentId: this.page ? this.page.id : this.id,
      event: 'addMarker',
      marker: { type: marker.type, id: marker.id }
    });

    this.markers.push(marker);
    this.selectMarker(marker);
    this.boardCanvas.appendChild(marker.visual);

    // 默认居中
    const bbox = marker.visual.getBBox();
    const x = this.width / 2 / this.scale - bbox.width / 2;
    const y = this.height / 2 / this.scale - bbox.height / 2;

    marker.moveTo(x, y);

    return marker;
  };

  public deleteActiveMarker = () => {
    if (this.activeMarker) {
      // 触发事件
      if (this.onChange) {
        this.onChange({
          event: 'removeMarker',
          id: this.activeMarker.id,
          target: 'marker',
          marker: { id: this.activeMarker.id }
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
    this.toolbar = new Toolbar(this.toolbarItems, this.toolbarClick);
    this.toolbar.zIndex = this.zIndex;

    this.toolbarUI = this.toolbar.getUI(this);

    document.body.appendChild(this.toolbarUI);
    this.toolbarUI.style.position = 'absolute';

    this.positionToolbar();

    // 处理元素的拖拽事件
    this.toolbar.toolbarButtons.forEach(button => {
      if (button.toolbarItem.draggable) {
        button.container.draggable = true;
        button.container.ondragstart = ev => {
          if (ev) {
            ev.dataTransfer!.setData('id', button.id);
          }
        };
      }
    });

    this.boardCanvas.ondragover = ev => {
      ev.preventDefault();
    };
    this.boardCanvas.ondrop = ev => {
      console.log(ev);
    };
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

  /** 处理 Toolbar 的点击事件 */
  private toolbarClick = (ev: MouseEvent, toolbarItem: ToolbarItem) => {
    if (toolbarItem.onClick) {
      toolbarItem.onClick();
    } else if (toolbarItem.markerType) {
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
