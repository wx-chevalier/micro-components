import { WhitePageSource } from './../board/types';

/** 判断是否为有效的 HTMLImageElement */
export function isHTMLImageElement(ele: WhitePageSource) {
  if (typeof ele === 'object' && ele instanceof HTMLImageElement) {
    return true;
  }

  return false;
}
