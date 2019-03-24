// 是主动绘制模式，还是镜像模式
export type WhiteboardMode = 'master' | 'mirror';

export type WhitePageSource = {
  // 需要展示的图片元素
  imgEle?: HTMLImageElement;

  // 需要展示的图片地址
  imgSrc?: string;
};
