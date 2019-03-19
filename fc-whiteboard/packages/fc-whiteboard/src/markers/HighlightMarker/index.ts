import { MarkerType } from './../types';
import { SvgHelper } from '../../renderer/SvgHelper';
import { RectBaseMarker } from '../RectMarker/RectBaseMarker';

export class HighlightMarker extends RectBaseMarker {
  type: MarkerType = 'highlight';

  public static createMarker = (): RectBaseMarker => {
    const marker = new HighlightMarker();
    marker.setup();
    return marker;
  };

  protected setup() {
    super.setup();
    SvgHelper.setAttributes(this.visual, [['class', 'highlight-marker']]);
  }
}
