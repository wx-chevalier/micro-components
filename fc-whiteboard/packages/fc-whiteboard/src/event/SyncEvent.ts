import { BorderEventType } from './border-events';
import { MarkerEventType, MarkerData } from './marker-events';
import { WhiteboardSnap } from '../whiteboard/WhiteboardSnap';

export type TargetType = 'whiteboard' | 'page' | 'marker';

export type EventType = MarkerEventType | BorderEventType;

export type onSyncFunc = (ev: SyncEvent) => void;

export interface SyncEvent {
  target: TargetType;
  id?: string;
  parentId?: string;
  event: EventType;
  marker?: MarkerData;
  border?: WhiteboardSnap;
  timestamp?: number;
}
