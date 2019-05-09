import * as Mousetrap from 'mousetrap';

import { HotkeysHandler, IMousetrap, HotkeysEventExt, KEY_ALL } from './types';
import { normalizeHotkeys, preventAndStopEvent } from './utils';

export default class HotkeysListener {
  private listeners: Record<string, HotkeysHandler[]> = {}; // hotkey => Array<callback>
  private trapObj: IMousetrap;

  constructor(element: Element = document.body, trapClass: MousetrapStatic = Mousetrap) {
    const notifyEvent = this._notify;

    class CustomTrap extends trapClass {
      handleKey(char: string, modifiers: string[], event: KeyboardEvent): void {
        const hotkey = normalizeHotkeys(char, modifiers);
        if (event && event.type !== 'keyup') {
          const extraParams: HotkeysEventExt = { char, modifiers, hotkey };
          notifyEvent(hotkey, event, extraParams);
        }
      }
    }

    this.trapObj = new CustomTrap(element);
  }

  on(hotkeys: string | string[], callback: HotkeysHandler) {
    if (typeof hotkeys === 'string') {
      const hotkey = hotkeys;
      const listeners = this.listeners[hotkey] || [];

      listeners.push(callback);

      this.listeners[hotkey] = listeners;
    } else if (Array.isArray(hotkeys)) {
      hotkeys.forEach(key => {
        this.on(key, callback);
      });
    } else {
      throw new Error('first param of on() must be a string or an array of string');
    }
  }

  off(hotkeys: string | string[], callback: HotkeysHandler) {
    if (typeof hotkeys === 'string') {
      const hotkey = hotkeys;
      const listeners = this.listeners[hotkey] || [];

      const index = listeners.indexOf(callback);
      if (index >= 0) {
        listeners.splice(index, 1);
      }

      this.listeners[hotkey] = listeners;
    } else if (Array.isArray(hotkeys)) {
      hotkeys.forEach(key => {
        this.off(key, callback);
      });
    } else {
      throw new Error('first param of off() must be a string or an array of string');
    }
  }

  reset() {
    this.listeners = {};
    this.trapObj.reset();
  }

  private _notify = (hotkey: string, event: KeyboardEvent, extraParams: HotkeysEventExt) => {
    const listenersForAllKeys = this.listeners[KEY_ALL];
    if (listenersForAllKeys && listenersForAllKeys.length > 0) {
      listenersForAllKeys.forEach(cb => {
        if (cb(event, extraParams) === false) {
          preventAndStopEvent(event);
        }
      });
    }

    const listeners = this.listeners[hotkey];
    if (listeners && listeners.length > 0) {
      listeners.forEach(cb => {
        if (cb(event, extraParams) === false) {
          preventAndStopEvent(event);
        }
      });
    }
  };
}
