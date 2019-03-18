import { ToolbarItem } from '../../toolbar/ToolbarItem';
import { RectMarker } from './RectMarker';

const Icon = require('./rect-marker-toolbar-icon.svg');

export class RectMarkerToolbarItem implements ToolbarItem {
  public name = 'rect-marker';
  public tooltipText = 'Rectangle';

  public icon = Icon;
  public markerType = RectMarker;
}
