import { ToolbarItem } from '../../toolbar/ToolbarItem';
import { TextMarker } from './TextMarker';

const Icon = require('./text-marker-toolbar-icon.svg');

export class TextMarkerToolbarItem implements ToolbarItem {
  public name = 'text-marker';
  public tooltipText = 'Text';

  public icon = Icon;
  public markerType = TextMarker;
}
