import { SyncEvent } from '../../event/SyncEvent';
import { WhitePage } from '../WhitePage/index';
import { createDivWithClassName } from '../../utils/dom';
import { WhiteboardSnap } from '../AbstractWhiteboard/snap';
import { AbstractWhiteboard } from '../AbstractWhiteboard/index';
import { Mode } from '../../utils/types';

const prefix = 'fcw-board';

export class MirrorWhiteboard extends AbstractWhiteboard {
  mode: Mode = 'mirror';

  /** 初始化操作 */
  protected init() {
    // 为 target 添加子 imgs 容器
    this.imgsContainer = createDivWithClassName(`${prefix}-imgs`, this.target);
    // 为 target 添加子 pages 容器
    this.pagesContainer = createDivWithClassName(`${prefix}-pages`, this.target);

    if (!this.eventHub) {
      throw new Error('Invalid eventHub');
    }

    this.eventHub.on('sync', (ev: SyncEvent) => {
      if (ev.target !== 'whiteboard' || !ev.border) {
        return;
      }

      if (ev.event === 'borderSnap') {
        this.applySnap(ev.border);
      }

      if (ev.event === 'borderChangePage' && ev.id === this.id) {
        if (this.isInitialized) {
          this.onPageChange(ev.border.visiblePageIndex);
        }
      }
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

  /** 响应获取到的快照事件 */
  private applySnap(snap: WhiteboardSnap) {
    const { id, sources, pageIds, visiblePageIndex } = snap;

    if (!this.isInitialized && !this.isSyncing) {
      this.id = id;
      this.sources = sources;
      this.isSyncing = true;

      // 初始化所有的 WhitePages
      this.sources.forEach((source, i) => {
        const page = new WhitePage(
          { imgSrc: source },
          {
            mode: this.mode,
            whiteboard: this,
            parentContainer: this.pagesContainer
          }
        );
        page.id = pageIds[i];

        // 这里隐藏 Dashboard 的图片源，Siema 切换的是占位图片
        page.container.style.visibility = 'hidden';

        this.pages.push(page);

        page.open();
      });

      this.initSiema();
      this.isInitialized = true;
      this.isSyncing = false;
      this.onPageChange(visiblePageIndex);
    }

    // 如果已经初始化完毕，则进行状态同步
    this.onPageChange(snap.visiblePageIndex);

    // 同步 Pages
    (snap.pages || []).forEach(pageSnap => {
      const page = this.pageMap[pageSnap.id];

      if (page) {
        page.applySnap(pageSnap);
      }
    });
  }
}
