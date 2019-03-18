import { MarkerType } from './../types';
import { LineMarkerBase } from '../line/LineMarkerBase';
import { SvgHelper } from '../../renderer/SvgHelper';

export class ArrowMarker extends LineMarkerBase {
  type: MarkerType = 'arrow';

  public static createMarker = (): LineMarkerBase => {
    const marker = new ArrowMarker();
    marker.setup();
    return marker;
  };

  private readonly ARROW_SIZE = 6;

  protected setup() {
    super.setup();
    SvgHelper.setAttributes(this.visual, [['class', 'arrow-marker']]);

    const tip = SvgHelper.createPolygon(
      `0,0 ${this.ARROW_SIZE},${this.ARROW_SIZE / 2} 0,${this.ARROW_SIZE}`,
      [['class', 'arrow-marker-tip']]
    );
    this.defs.push(
      SvgHelper.createMarker(
        'arrow-marker-head',
        'auto',
        this.ARROW_SIZE,
        this.ARROW_SIZE,
        this.ARROW_SIZE - 1,
        this.ARROW_SIZE / 2,
        tip
      )
    );

    this.markerLine.setAttribute('marker-end', 'url(#arrow-marker-head');
  }
}
