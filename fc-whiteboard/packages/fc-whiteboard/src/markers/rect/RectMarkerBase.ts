import { SvgHelper } from '../../renderer/SvgHelper';
import { RectangularMarkerBase } from '../base/RectangularMarkerBase';
import { PositionType } from 'fc-whiteboard/src/event/Event';

export class RectMarkerBase extends RectangularMarkerBase {
  public static createMarker = (): RectMarkerBase => {
    const marker = new RectMarkerBase();
    marker.setup();
    return marker;
  };

  private markerRect: SVGRectElement;

  protected setup() {
    super.setup();

    this.markerRect = SvgHelper.createRect(this.width, this.height);
    this.addToRenderVisual(this.markerRect);
  }

  protected resize(x: number, y: number, onPosition?: (pos: PositionType) => void) {
    super.resize(x, y, onPosition);
    this.markerRect.setAttribute('width', this.width.toString());
    this.markerRect.setAttribute('height', this.height.toString());
  }
}
