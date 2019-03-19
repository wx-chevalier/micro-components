import { TextMarker } from './TextMarker/index';
import { ArrowMarker } from './ArrowMarker/index';
import { BaseMarker } from './BaseMarker/index';
import { CoverMarker } from './CoverMarker';
import { LineMarker } from './LineMarker';
import { RectMarker } from './RectMarker';

export type MarkerType = 'base' | 'arrow' | 'cover' | 'line' | 'rect' | 'text' | 'highlight';

export function getMarkerByType(type: MarkerType): typeof BaseMarker {
  switch (type) {
    case 'base':
      return BaseMarker;
    case 'arrow':
      return ArrowMarker;
    case 'cover':
      return CoverMarker;
    case 'line':
      return LineMarker;
    case 'rect':
      return RectMarker;
    case 'text':
      return TextMarker;
    default:
      return BaseMarker;
  }
}
