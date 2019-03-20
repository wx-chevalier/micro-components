export type TargetType = 'page' | 'drawboard' | 'marker';
export type EventType = 'add' | 'resize' | 'move' | 'remove';
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

export interface ChangeEvent {
  target: TargetType;
  id: string;
  event: EventType;
  data?: object | string;
}

export type onChangeFunc = (ev: ChangeEvent) => void;
