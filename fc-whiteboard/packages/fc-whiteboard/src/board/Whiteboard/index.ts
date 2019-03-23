import { WhiteboardMode, WhitePageSource } from '../types';

export class Whiteboard {
  mode: WhiteboardMode = 'master';
  sources: WhitePageSource[] = [];

  /** @region UI Options */
  // 是否为全屏模式
  isFullscreen: boolean = false;

  constructor(sources: WhitePageSource[], { mode }: { mode?: WhiteboardMode }) {
    this.sources = sources;

    if (mode) {
      this.mode = mode;
    }
  }

  /** 初始化操作 */
  init() {
    // 初始化所有的 WhitePages
  }
}
