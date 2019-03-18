import { MarkerType } from './../types';
import { SvgHelper } from '../../renderer/SvgHelper';
import { RectMarkerBase } from '../rect/RectMarkerBase';

export class CoverMarker extends RectMarkerBase {
  type: MarkerType = 'cover';

  public static createMarker = (): RectMarkerBase => {
    const marker = new CoverMarker();
    marker.setup();
    return marker;
  };

  protected setup() {
    super.setup();
    SvgHelper.setAttributes(this.visual, [['class', 'cover-marker']]);
  }
}
