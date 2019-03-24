import { ToolbarButton } from './ToolbarButton';
import { ToolbarItem } from './ToolbarItem';
import { uuid } from '../utils/uuid';

export class Toolbar {
  id: string = uuid();

  private toolbarItems: ToolbarItem[];
  private toolbarUI: HTMLElement;

  private clickHandler: (ev: MouseEvent, toolbarItem: ToolbarItem) => void;

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
    this.toolbarUI.style.opacity = '0';
    this.toolbarUI.style.zIndex = '-1';
  }

  public show() {
    this.toolbarUI.style.opacity = '1';
    this.toolbarUI.style.zIndex = '999';
  }
}
