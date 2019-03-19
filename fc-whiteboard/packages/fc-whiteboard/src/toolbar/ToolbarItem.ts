import { BaseMarker } from './../markers/BaseMarker/index';
export class ToolbarItem {
  name: string;
  tooltipText: string;
  icon?: string;
  markerType?: typeof BaseMarker;

  constructor({
    name,
    tooltipText,
    icon,
    markerType
  }: {
    name: string;
    tooltipText: string;
    icon?: string;
    markerType?: typeof BaseMarker;
  }) {
    this.name = name;
    this.tooltipText = tooltipText;
    this.icon = icon;
    this.markerType = markerType;
  }
}
