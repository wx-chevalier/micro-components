import HotkeysListener from '../src/HotkeysListener';
import { KEY_ALL } from '../src/types';

const listener = new HotkeysListener();

listener.on(KEY_ALL, (e, { hotkey }) => {
  const divEl = document.createElement('div');
  divEl.innerText = hotkey;

  e.preventDefault();
  e.stopPropagation();

  document.body.appendChild(divEl);
});

listener.on('Command+A', (e, { hotkey }) => {
  const divEl = document.createElement('div');
  divEl.innerText = hotkey;

  e.preventDefault();
  e.stopPropagation();

  document.body.appendChild(divEl);
});
