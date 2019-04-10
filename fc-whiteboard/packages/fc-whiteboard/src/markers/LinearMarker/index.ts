import { WhitePage } from '../../whiteboard/WhitePage/index';
import { BaseMarker } from '../BaseMarker';
import { ResizeGrip } from '../BaseMarker/ResizeGrip';
import { SvgHelper } from '../../renderer/SvgHelper';
import { PositionType } from '../../utils/layout';

export class LinearMarker extends BaseMarker {
  public static createMarker = (page?: WhitePage): LinearMarker => {
    const marker = new LinearMarker();
    marker.page = page;
    marker.setup();
    return marker;
  };

  protected markerLine: SVGLineElement;

  private readonly MIN_LENGTH = 20;

  private markerBgLine: SVGLineElement; // touch target

  private controlBox: SVGGElement;

  private controlGrips: { left: ResizeGrip; right: ResizeGrip };
  private activeGrip: ResizeGrip | null;

  private x1: number = 0;
  private y1: number = 0;
  private x2: number = this.width;
  private y2: number = 0;

  public endManipulation() {
    super.endManipulation();
    this.isResizing = false;
    this.activeGrip = null;
  }

  public select() {
    super.select();
    this.controlBox.style.display = '';
  }

  public deselect() {
    super.deselect();
    this.controlBox.style.display = 'none';
  }

  protected setup() {
    super.setup();

    this.markerBgLine = SvgHelper.createLine(0, 0, this.x2, 0, [
      ['stroke', 'transparent'],
      ['stroke-width', '30']
    ]);
    this.addToRenderVisual(this.markerBgLine);
    this.markerLine = SvgHelper.createLine(0, 0, this.x2, 0);
    this.addToRenderVisual(this.markerLine);

    this.addControlBox();

    if (this.page && this.page.mode === 'mirror') {
      this.controlBox.style.display = 'none';
    }
  }

  protected resize(x: number, y: number, onPosition?: (pos: PositionType) => void) {
    if (this.activeGrip) {
      if (
        this.activeGrip === this.controlGrips.left &&
        this.getLineLength(this.x1 + x, this.y1 + 1, this.x2, this.y2) >= this.MIN_LENGTH
      ) {
        this.x1 += x;
        this.y1 += y;
        this.markerBgLine.setAttribute('x1', this.x1.toString());
        this.markerBgLine.setAttribute('y1', this.y1.toString());
        this.markerLine.setAttribute('x1', this.x1.toString());
        this.markerLine.setAttribute('y1', this.y1.toString());
        if (onPosition) {
          onPosition('left');
        }
      } else if (
        this.activeGrip === this.controlGrips.right &&
        this.getLineLength(this.x1, this.y1, this.x2 + x, this.y2 + y) >= this.MIN_LENGTH
      ) {
        this.x2 += x;
        this.y2 += y;
        this.markerBgLine.setAttribute('x2', this.x2.toString());
        this.markerBgLine.setAttribute('y2', this.y2.toString());
        this.markerLine.setAttribute('x2', this.x2.toString());
        this.markerLine.setAttribute('y2', this.y2.toString());
        if (onPosition) {
          onPosition('right');
        }
      }
    }

    this.adjustControlBox();
  }

  protected resizeByEvent(x: number, y: number, pos?: PositionType) {
    if (pos === 'left') {
      this.activeGrip = this.controlGrips.left;
    } else {
      this.activeGrip = this.controlGrips.right;
    }

    this.resize(x, y);
  }

  private getLineLength = (x1: number, y1: number, x2: number, y2: number): number => {
    const dx = Math.abs(x1 - x2);
    const dy = Math.abs(y1 - y2);

    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  };

  private addControlBox = () => {
    this.controlBox = SvgHelper.createGroup([['class', 'fc-whiteboard-line-control-box']]);
    this.addToVisual(this.controlBox);

    this.addControlGrips();
  };

  private adjustControlBox = () => {
    this.positionGrips();
  };

  private addControlGrips = () => {
    this.controlGrips = {
      left: this.createGrip(),
      right: this.createGrip()
    };

    this.positionGrips();
  };

  private createGrip = (): ResizeGrip => {
    const grip = new ResizeGrip();
    grip.visual.transform.baseVal.appendItem(SvgHelper.createTransform());
    this.controlBox.appendChild(grip.visual);

    grip.visual.addEventListener('mousedown', this.gripMouseDown);
    grip.visual.addEventListener('mousemove', this.gripMouseMove);
    grip.visual.addEventListener('mouseup', this.gripMouseUp);

    grip.visual.addEventListener('touchstart', this.onTouch, { passive: false });
    grip.visual.addEventListener('touchend', this.onTouch, { passive: false });
    grip.visual.addEventListener('touchmove', this.onTouch, { passive: false });

    return grip;
  };

  private positionGrips = () => {
    const gripSize = this.controlGrips.left.GRIP_SIZE;

    const x1 = this.x1 - gripSize / 2;
    const y1 = this.y1 - gripSize / 2;
    const x2 = this.x2 - gripSize / 2;
    const y2 = this.y2 - gripSize / 2;

    this.positionGrip(this.controlGrips.left.visual, x1, y1);
    this.positionGrip(this.controlGrips.right.visual, x2, y2);
  };

  private positionGrip = (grip: SVGGraphicsElement, x: number, y: number) => {
    const translate = grip.transform.baseVal.getItem(0);
    translate.setTranslate(x, y);
    grip.transform.baseVal.replaceItem(translate, 0);
  };

  private gripMouseDown = (ev: MouseEvent) => {
    this.isResizing = true;
    this.activeGrip =
      (ev.target as SVGGraphicsElement) === this.controlGrips.left.visual
        ? this.controlGrips.left
        : this.controlGrips.right;
    this.previousMouseX = ev.screenX;
    this.previousMouseY = ev.screenY;
    ev.stopPropagation();
  };

  private gripMouseUp = (ev: MouseEvent) => {
    this.isResizing = false;
    this.activeGrip = null;
    ev.stopPropagation();
  };

  private gripMouseMove = (ev: MouseEvent) => {
    if (this.isResizing) {
      this.resize(ev.movementX, ev.movementY);
    }
  };
}
