import { TextMarker } from './text/TextMarker';
import { LineMarker } from './line/LineMarker';
import { ArrowMarker } from './arrow/ArrowMarker';
import { MarkerBase } from './base/MarkerBase';
import { CoverMarker } from './cover/CoverMarker';
import { RectMarker } from './rect/RectMarker';
export type MarkerType = 'base' | 'arrow' | 'cover' | 'line' | 'rect' | 'text' | 'highlight';

export function getMarkerByType(type: MarkerType): typeof MarkerBase {
  switch (type) {
    case 'base':
      return MarkerBase;
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
      return MarkerBase;
  }
}
