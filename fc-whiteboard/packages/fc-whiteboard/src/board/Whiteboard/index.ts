import { WhiteboardMode, WhitePageSource } from '../types';

export class Whiteboard {
  mode: WhiteboardMode = 'master';
  sources: WhitePageSource[] = [];

  /** @region UI Options */
  // 是否为全屏模式
  isFullscreen: boolean = false;

  constructor() {}

  /** 初始化操作 */
  init() {}
}
