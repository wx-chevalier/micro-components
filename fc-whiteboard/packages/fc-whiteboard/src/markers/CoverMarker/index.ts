import { MarkerType } from './../types';
import { SvgHelper } from '../../renderer/SvgHelper';
import { RectBaseMarker } from '../RectMarker/RectBaseMarker';

export class CoverMarker extends RectBaseMarker {
  type: MarkerType = 'cover';

  public static createMarker = (): RectBaseMarker => {
    const marker = new CoverMarker();
    marker.setup();
    return marker;
  };

  protected setup() {
    super.setup();
    SvgHelper.setAttributes(this.visual, [['class', 'cover-marker']]);
  }
}
