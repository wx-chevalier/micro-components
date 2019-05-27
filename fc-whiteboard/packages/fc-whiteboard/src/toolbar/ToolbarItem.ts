import { BaseMarker } from './../markers/BaseMarker/index';

/** 对于工具栏的定义 */
export class ToolbarItem {
  name: string;
  tooltipText?: string;
  icon?: string;
  markerType?: typeof BaseMarker;
  onRender?: () => HTMLDivElement;
  onClick?: () => void;

  draggable?: boolean;

  constructor({
    name,
    tooltipText,
    icon,
    draggable,
    markerType,
    onRender,
    onClick
  }: Partial<ToolbarItem>) {
    if (!name) {
      throw new Error('Invalid params');
    }

    this.name = name;
    this.tooltipText = tooltipText;
    this.icon = icon;
    this.markerType = markerType;
    this.draggable = draggable;

    this.onClick = onClick;
    this.onRender = onRender;
  }
}
