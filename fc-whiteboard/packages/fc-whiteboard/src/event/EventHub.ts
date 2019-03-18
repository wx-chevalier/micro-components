import { ChangeEvent } from './Event';
import * as EventEmitter from 'eventemitter3';

export class EventHub extends EventEmitter<'change'> {}

export const eventHub = new EventHub();

eventHub.on('change', (changeEv: ChangeEvent) => {
  console.log(changeEv);
});
