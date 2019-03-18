// 是主动绘制模式，还是镜像模式
export type WhiteboardMode = 'master' | 'mirror';

export type RenderCallback = (container: HTMLElement) => void;

export type WhitePageSource = string | RenderCallback;
