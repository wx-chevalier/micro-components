import { BaseMarker } from './../markers/BaseMarker/index';

/** 对于工具栏的定义 */
export class ToolbarItem {
  name: string;
  tooltipText: string;
  icon?: string;
  markerType?: typeof BaseMarker;
  onClick?: () => void;

  constructor({
    name,
    tooltipText,
    icon,
    markerType,
    onClick
  }: {
    name: string;
    tooltipText: string;
    icon?: string;
    markerType?: typeof BaseMarker;
    onClick?: () => void;
  }) {
    this.name = name;
    this.tooltipText = tooltipText;
    this.icon = icon;
    this.markerType = markerType;
    this.onClick = onClick;
  }
}
