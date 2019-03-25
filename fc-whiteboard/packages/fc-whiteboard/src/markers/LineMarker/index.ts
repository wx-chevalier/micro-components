import { MarkerType } from './../types';
import { LinearMarker } from '../LinearMarker';
import { SvgHelper } from './../../renderer/SvgHelper/index';
import { WhitePage } from '../../board/WhitePage';

export class LineMarker extends LinearMarker {
  type: MarkerType = 'line';

  public static createMarker = (page?: WhitePage): LinearMarker => {
    const marker = new LineMarker();
    marker.page = page;
    marker.setup();
    return marker;
  };

  protected setup() {
    super.setup();
    SvgHelper.setAttributes(this.visual, [['class', 'line-marker']]);
  }
}
