import { WhitePage } from './../../board/WhitePage/index';
import { MarkerType } from './../types';
import { RectBaseMarker } from './RectBaseMarker';
import { SvgHelper } from '../../renderer/SvgHelper';

export class RectMarker extends RectBaseMarker {
  type: MarkerType = 'rect';

  public static createMarker = (page?: WhitePage): RectBaseMarker => {
    const marker = new RectMarker();
    marker.page = page;
    marker.setup();
    return marker;
  };

  protected setup() {
    super.setup();
    SvgHelper.setAttributes(this.visual, [['class', 'rect-marker']]);
  }
}
