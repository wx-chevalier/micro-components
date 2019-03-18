import { ToolbarItem } from '../../toolbar/ToolbarItem';
import { HighlightMarker } from './HighlightMarker';

const Icon = require('./highlight-marker-toolbar-icon.svg');

export class HighlightMarkerToolbarItem implements ToolbarItem {
  public name = 'cover-marker';
  public tooltipText = 'Cover';

  public icon = Icon;
  public markerType = HighlightMarker;
}
