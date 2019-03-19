import { MarkerType } from './../types';
import { RectBaseMarker } from './RectBaseMarker';
import { SvgHelper } from 'fc-whiteboard/src/renderer/SvgHelper';

export class RectMarker extends RectBaseMarker {
  type: MarkerType = 'rect';

  public static createMarker = (): RectBaseMarker => {
    const marker = new RectMarker();
    marker.setup();
    return marker;
  };

  protected setup() {
    super.setup();
    SvgHelper.setAttributes(this.visual, [['class', 'rect-marker']]);
  }
}
