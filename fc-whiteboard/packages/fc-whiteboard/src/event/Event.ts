export type TargetType = 'whiteboard' | 'page' | 'marker';
export type EventType =
  // 完全的状态同步，FCW 支持两种状态的同步交换：Snapshot(Snap) 与 KeyActions(KA) 方式
  | 'snap'
  // 添加
  | 'add'
  // 尺寸重置
  | 'resize'
  // 移动
  | 'move'
  // 移除
  | 'remove'
  // 下标改变
  | 'changeIndex'
  // 文本改变
  | 'changeText';
export type PositionType =
  | 'left'
  | 'right'
  | 'topLeft'
  | 'bottomLeft'
  | 'topRight'
  | 'bottomRight'
  | 'centerLeft'
  | 'centerRight'
  | 'topCenter'
  | 'bottomCenter';

export interface SyncEvent {
  target: TargetType;
  id?: string;
  parentId?: string;
  event: EventType;
  data?: object | string | number;
}

export type onSyncFunc = (ev: SyncEvent) => void;
