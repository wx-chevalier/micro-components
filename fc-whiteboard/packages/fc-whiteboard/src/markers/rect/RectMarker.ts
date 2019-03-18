import { RectMarkerBase } from './RectMarkerBase';
import { MarkerType } from './../types';
import { SvgHelper } from '../../renderer/SvgHelper';

export class RectMarker extends RectMarkerBase {
  type: MarkerType = 'rect';

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
