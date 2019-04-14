import { WhitePage } from '../WhitePage/index';
import { createDivWithClassName } from '../../utils/dom';
import { AbstractWhiteboard } from '../AbstractWhiteboard/index';
import { Mode } from '../../utils/types';

const LeftArrowIcon = require('../../assets/bx-left-arrow.svg');
const RightArrowIcon = require('../../assets/bx-right-arrow.svg');

const prefix = 'fcw-board';

export class Whiteboard extends AbstractWhiteboard {
  mode: Mode = 'master';

  /** 初始化操作 */
  protected init() {
    // 为 target 添加子 imgs 容器
    this.imgsContainer = createDivWithClassName(`${prefix}-imgs`, this.target);
    // 为 target 添加子 pages 容器
    this.pagesContainer = createDivWithClassName(`${prefix}-pages`, this.target);

    this.initMaster();

    this.emitSnapshot();
  }

  /** 以主模式启动 */
  private initMaster() {
    // 初始化所有的 WhitePages
    this.sources.forEach(source => {
      const page = new WhitePage(
        { imgSrc: source },
        {
          mode: this.mode,
          whiteboard: this,
          parentContainer: this.pagesContainer
        }
      );

      // 这里隐藏 Dashboard 的图片源，Siema 切换的是占位图片
      page.container.style.visibility = 'hidden';

      this.pages.push(page);
    });

    this.initSiema();

    // 初始化控制节点
    const controller = createDivWithClassName(`${prefix}-controller`, this.target);

    const prevEle = createDivWithClassName(`${prefix}-flip-arrow`, controller);
    prevEle.innerHTML = LeftArrowIcon;

    const nextEle = createDivWithClassName(`${prefix}-flip-arrow`, controller);
    nextEle.innerHTML = RightArrowIcon;

    nextEle!.addEventListener('click', () => {
      const nextPageIndex =
        this.visiblePageIndex + 1 > this.pages.length - 1 ? 0 : this.visiblePageIndex + 1;
      this.onPageChange(nextPageIndex);
    });
    prevEle!.addEventListener('click', () => {
      const nextPageIndex =
        this.visiblePageIndex - 1 < 0 ? this.pages.length - 1 : this.visiblePageIndex - 1;

      this.onPageChange(nextPageIndex);
    });
  }

  /** 响应页面切换的事件 */
  private onPageChange(nextPageIndex: number) {
    if (this.visiblePageIndex === nextPageIndex) {
      return;
    }

    this.siema.goTo(nextPageIndex);
    this.visiblePageIndex = nextPageIndex;

    // 将所有的 Page 隐藏
    this.pages.forEach((page, i) => {
      if (nextPageIndex === i) {
        page.show();
      } else {
        page.hide();
      }
    });

    this.emit({
      event: 'borderChangePage',
      id: this.id,
      target: 'whiteboard',
      border: this.captureSnap()
    });
  }

  /** 触发快照事件 */
  private emitSnapshot() {
    const innerFunc = () => {
      this.emit({
        event: 'borderSnap',
        id: this.id,
        target: 'whiteboard',
        border: this.captureSnap(false)
      });
    };

    // 定期触发事件
    this.emitInterval = setInterval(() => {
      innerFunc();
    }, this.snapInterval);

    // 首次事件，延时 500ms 发出
    setTimeout(innerFunc, 500);
  }
}
