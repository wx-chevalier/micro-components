export const KEY_ESC = 'ESC';
export const KEY_ALL = '*';

export const normalizeModifiersMap: Record<string, string> = {
  ctrl: 'Ctrl',
  control: 'Ctrl',
  alt: 'Alt',
  shift: 'Shift',
  command: 'Command',
  meta: 'Command'
};

export interface IMousetrap {
  handleKey(char: string, modifiers: string[], event: KeyboardEvent): void;
  reset(): void;
}

export interface IMousetrapClass {
  new (element: HTMLElement | HTMLDocument): IMousetrap;
}

export interface HotkeysEventExt {
  char: string;
  modifiers: string[];
  hotkey: string;
}

export type HotkeysHandler = (event: KeyboardEvent, extraParams: HotkeysEventExt) => false | void;
