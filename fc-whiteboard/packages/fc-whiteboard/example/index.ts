import { Drawboard } from '../src';

const m = new Drawboard(document.getElementById('image') as HTMLImageElement);

m.show((dataUrl: string) => {
  const res = document.getElementById('resultImage') as HTMLImageElement;
  res.src = dataUrl;
});
