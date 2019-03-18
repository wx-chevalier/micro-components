import { ToolbarItem } from './ToolbarItem';

export class ToolbarButton {
  private toolbarItem: ToolbarItem;
  private clickHandler: (ev: MouseEvent, toolbarItem: ToolbarItem) => void;

  constructor(
    toolbarItem: ToolbarItem,
    clickHandler?: (ev: MouseEvent, toolbarItem: ToolbarItem) => void
  ) {
    this.toolbarItem = toolbarItem;

    if (clickHandler) {
      this.clickHandler = clickHandler;
    }
  }

  public getElement = (): HTMLElement => {
    const div = document.createElement('div');
    if (this.toolbarItem.name !== 'separator') {
      div.className = 'fc-whiteboard-toolbar-button';
      if (this.clickHandler) {
        div.addEventListener('click', (ev: MouseEvent) => {
          if (this.clickHandler) {
            this.clickHandler(ev, this.toolbarItem);
          }
        });
      }

      if (this.toolbarItem.icon) {
        div.title = this.toolbarItem.tooltipText;
        div.innerHTML = this.toolbarItem.icon;
      } else {
        div.innerText = this.toolbarItem.tooltipText;
      }
    } else {
      div.className = 'fc-whiteboard-toolbar-separator';
    }

    return div;
  };
}
