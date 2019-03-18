export type TargetType = 'page' | 'drawboard' | 'marker';
export type EventType = 'add' | 'resize' | 'move' | 'remove';

export interface ChangeEvent {
  target: TargetType;
  id: string;
  event: EventType;
  data?: object | string;
}

export type onChangeFunc = (ev: ChangeEvent) => void;
