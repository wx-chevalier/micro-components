import { MarkerBase } from '../markers/base/MarkerBase';

export interface ToolbarItem {
  name: string;
  tooltipText: string;
  icon?: string;
  markerType?: typeof MarkerBase;
}
