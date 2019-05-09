import { normalizeModifiersMap } from './types';

export function normalizeHotkeys(char: string, modifiers: string[]) {
  const parts = modifiers.map(m => normalizeModifiersMap[m] || m).reverse();

  if (modifiers.indexOf(char) < 0 && parts.indexOf(char) < 0) {
    parts.push(char.toUpperCase());
  }

  return parts.join('+');
}

export function preventAndStopEvent(event: Event) {
  event.preventDefault();
  event.stopPropagation();
}
