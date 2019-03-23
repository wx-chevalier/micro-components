import { WhitePageSource } from './../types';
import { SvgHelper } from './../../renderer/SvgHelper/index';
import { isHTMLImageElement } from 'fc-whiteboard/src/utils/validator';
/** 基础的绘制版 */
export class Baseboard {
  /** 元素 */
  source: WhitePageSource;

  // 目前使用 Image 元素作为输出源
  target: HTMLImageElement;
  targetRect: ClientRect;

  board: SVGSVGElement;
  boardHolder: HTMLDivElement;
  defs: SVGDefsElement;

  width: number;
  height: number;

  constructor(source: WhitePageSource) {
    if (isHTMLImageElement(source)) {
      this.target = source as HTMLImageElement;

      // 如果仅传入图片地址或者 Blob，则必须为全屏模式
      this.width = this.target.clientWidth;
      this.height = this.target.clientHeight;
    }
  }

  protected initBoard = () => {
    this.boardHolder = document.createElement('div');
    // fix for Edge's touch behavior
    this.boardHolder.style.setProperty('touch-action', 'none');
    this.boardHolder.style.setProperty('-ms-touch-action', 'none');

    this.board = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.board.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    this.board.setAttribute('width', this.width.toString());
    this.board.setAttribute('height', this.height.toString());
    this.board.setAttribute(
      'viewBox',
      '0 0 ' + this.width.toString() + ' ' + this.height.toString()
    );

    this.boardHolder.style.position = 'absolute';
    this.boardHolder.style.width = `${this.width}px`;
    this.boardHolder.style.height = `${this.height}px`;
    this.boardHolder.style.transformOrigin = 'top left';
    this.positionBoard();

    this.defs = SvgHelper.createDefs();
    this.board.appendChild(this.defs);

    this.boardHolder.appendChild(this.board);

    document.body.appendChild(this.boardHolder);
  };

  protected positionBoard = () => {
    this.boardHolder.style.top = this.targetRect.top + 'px';
    this.boardHolder.style.left = this.targetRect.left + 'px';
  };
}
