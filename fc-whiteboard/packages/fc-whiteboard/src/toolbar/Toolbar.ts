import { ToolbarButton } from './ToolbarButton';
import { ToolbarItem } from './ToolbarItem';
import { uuid } from '../utils/uuid';

import './index.less';
import { DomEventAware } from '../renderer/DomEventAware/index';
import { dragToolbarItem } from './toolbar-items';

export type MouseHandler = (ev: MouseEvent) => void;

export class Toolbar extends DomEventAware {
  id: string = uuid();
  zIndex: number = 999;

  toolbarItems: ToolbarItem[];
  toolbarUI: HTMLElement;
  isDragging: boolean = false;

  clickHandler: (ev: MouseEvent, toolbarItem: ToolbarItem) => void;

  constructor(
    toolbarItems: ToolbarItem[],
    clickHandler: (ev: MouseEvent, toolbarItem: ToolbarItem) => void
  ) {
    super();

    this.toolbarItems = [dragToolbarItem, ...toolbarItems];
    this.clickHandler = clickHandler;
  }

  /** 获取 UI 元素 */
  public getUI = (): HTMLElement => {
    this.toolbarUI = document.createElement('div');
    this.toolbarUI.id = `fcw-toolbar-${this.id}`;
    this.toolbarUI.className = 'fc-whiteboard-toolbar';

    for (const toolbarItem of this.toolbarItems) {
      const toolbarButton = new ToolbarButton(toolbarItem, this.clickHandler);
      this.toolbarUI.appendChild(toolbarButton.getElement());
    }

    super.init(this.toolbarUI);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);

    return this.toolbarUI;
  };

  public hide() {
    this.toolbarUI.style.visibility = 'hidden';
    this.toolbarUI.style.zIndex = '-1';
  }

  public show() {
    this.toolbarUI.style.visibility = 'visible';
    this.toolbarUI.style.zIndex = `${this.zIndex}`;
  }

  protected onMouseDown = (downEv: MouseEvent) => {
    downEv.stopPropagation();

    this.previousMouseX = downEv.screenX;
    this.previousMouseY = downEv.screenY;

    if (downEv.target && downEv.target['id'] === 'drag') {
      this.isDragging = true;

      this._trackDrag(
        e => {
          if (this.isDragging && e.target && e.target['id'] === 'drag') {
            const dx = e.screenX - this.previousMouseX;
            const dy = e.screenY - this.previousMouseY;
            const rect = this.toolbarUI.getBoundingClientRect();

            this.toolbarUI.style.left = `${rect.left + dx}px`;
            this.toolbarUI.style.top = `${rect.top + dy}px`;
          }
          this.previousMouseX = e.screenX;
          this.previousMouseY = e.screenY;
        },
        e => {
          this.isDragging = false;
        }
      );
    }
  };

  protected onMouseUp = (ev: MouseEvent) => {};

  protected onMouseMove = (ev: MouseEvent) => {};

  _trackDrag(onMouseMove: MouseHandler, onMouseUp: MouseHandler) {
    function onDragEnd(e: MouseEvent) {
      // Remove event listerners
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onDragEnd);

      if (onMouseUp) {
        onMouseUp(e);
      }
    }

    // Add event listeners to window
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onDragEnd);
  }
}
