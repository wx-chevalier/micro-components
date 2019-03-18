import { MarkerType } from './../types';
import { SvgHelper } from '../../renderer/SvgHelper';
import { RectMarkerBase } from './RectMarkerBase';

export class RectMarker extends RectMarkerBase {
  type: MarkerType = 'line';

  public static createMarker = (): RectMarkerBase => {
    const marker = new RectMarker();
    marker.setup();
    return marker;
  };

  protected setup() {
    super.setup();
    SvgHelper.setAttributes(this.visual, [['class', 'rect-marker']]);
  }
}
