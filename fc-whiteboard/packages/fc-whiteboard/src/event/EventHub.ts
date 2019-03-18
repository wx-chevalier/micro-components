import * as EventEmitter from 'eventemitter3';

import { EventType } from './Event';

export class EventHub extends EventEmitter<EventType> {}

export const eventHub = new EventHub();

eventHub.on('add', data => {
  console.log(data);
});
