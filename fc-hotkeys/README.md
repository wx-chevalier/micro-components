# fc-hotkeys

fc-hotkeys 提供了

# Usage

## fc-hotkeys

```ts
import { KEY_ALL, HotkeysListener } from 'fc-hotkeys';

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
```

## fc-hotkeys-react
