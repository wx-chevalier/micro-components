import { MarkerType } from './../types';
import { SvgHelper } from '../../renderer/SvgHelper';
import { RectBaseMarker } from '../RectMarker/RectBaseMarker';
import { WhitePage } from 'fc-whiteboard/src/board/WhitePage';

export class CoverMarker extends RectBaseMarker {
  type: MarkerType = 'cover';

  public static createMarker = (page?: WhitePage): RectBaseMarker => {
    const marker = new CoverMarker();
    marker.page = page;
    marker.setup();
    return marker;
  };

  protected setup() {
    super.setup();
    SvgHelper.setAttributes(this.visual, [['class', 'cover-marker']]);
  }
}
