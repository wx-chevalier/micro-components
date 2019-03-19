import { MarkerType } from './../types';
import { LinearMarker } from '../LinearMarker';
import { SvgHelper } from './../../renderer/SvgHelper/index';

export class LineMarker extends LinearMarker {
  type: MarkerType = 'line';

  public static createMarker = (): LinearMarker => {
    const marker = new LineMarker();
    marker.setup();
    return marker;
  };

  protected setup() {
    super.setup();
    SvgHelper.setAttributes(this.visual, [['class', 'line-marker']]);
  }
}
