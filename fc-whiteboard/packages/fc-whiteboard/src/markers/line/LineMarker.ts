import { MarkerType } from './../types';
import { SvgHelper } from '../../renderer/SvgHelper';
import { LineMarkerBase } from './LineMarkerBase';

export class LineMarker extends LineMarkerBase {
  type: MarkerType = 'line';

  public static createMarker = (): LineMarkerBase => {
    const marker = new LineMarker();
    marker.setup();
    return marker;
  };

  protected setup() {
    super.setup();
    SvgHelper.setAttributes(this.visual, [['class', 'line-marker']]);
  }
}
