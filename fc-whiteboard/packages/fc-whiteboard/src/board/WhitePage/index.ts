import { MarkerType } from './../../markers/types';
import { ChangeEvent } from './../../event/Event';
import { EventHub } from '../../event/EventHub';
import { WhiteboardMode } from './../types';
import { Drawboard } from './../Drawboard/index';
import { uuid } from './../../utils/uuid';
import { getMarkerByType } from '../../markers/types';

/** 白板中的每一页 */
export class WhitePage {
  id: string = uuid();

  drawboard: Drawboard;
  mode: WhiteboardMode = 'master';

  constructor(
    target: HTMLImageElement,
    { mode, eventHub }: { mode?: WhiteboardMode; eventHub?: EventHub } = {}
  ) {
    if (mode) {
      this.mode = mode;
    }

    if (this.mode === 'master') {
      if (eventHub) {
        this.drawboard = new Drawboard(this, target, {
          onChange: ev => eventHub.emit('change', ev)
        });
      } else {
        this.drawboard = new Drawboard(this, target);
      }
    }

    if (this.mode === 'mirror') {
      if (!eventHub) {
        throw new Error('Invalid eventHub');
      }

      this.drawboard = new Drawboard(this, target);

      eventHub.on('change', (ev: ChangeEvent) => {
        if (ev.event === 'add') {
          const data: { id: string; type: MarkerType } = ev.data as {
            id: string;
            type: MarkerType;
          };
          this.drawboard.addMarker(getMarkerByType(data.type), { id: data.id });
        }

        if (ev.event === 'move' || ev.event === 'resize') {
          const marker = this.drawboard.markerMap[ev.id];

          marker.reactToManipulation(ev.event, ev.data as any);
        }
      });
    }
  }
}
