import { ToolbarButton } from './ToolbarButton';
import { ToolbarItem } from './ToolbarItem';
import { uuid } from '../utils/uuid';

export class Toolbar {
  id: string = uuid();
  zIndex: number = 999;

  toolbarItems: ToolbarItem[];
  toolbarUI: HTMLElement;

  clickHandler: (ev: MouseEvent, toolbarItem: ToolbarItem) => void;

  constructor(
    toolbarItems: ToolbarItem[],
    clickHandler: (ev: MouseEvent, toolbarItem: ToolbarItem) => void
  ) {
    this.toolbarItems = toolbarItems;
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
}
