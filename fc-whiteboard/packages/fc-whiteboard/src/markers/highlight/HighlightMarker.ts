import { MarkerType } from './../types';
import { SvgHelper } from '../../renderer/SvgHelper';
import { RectMarkerBase } from '../rect/RectMarkerBase';

export class HighlightMarker extends RectMarkerBase {
  type: MarkerType = 'highlight';

  public static createMarker = (): RectMarkerBase => {
    const marker = new HighlightMarker();
    marker.setup();
    return marker;
  };

  protected setup() {
    super.setup();
    SvgHelper.setAttributes(this.visual, [['class', 'highlight-marker']]);
  }
}
