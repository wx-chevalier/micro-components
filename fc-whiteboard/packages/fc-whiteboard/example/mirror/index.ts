import { eventHub } from '../../src/event/EventHub';
import { WhitePage } from '../../src/board/WhitePage/index';

const page1 = new WhitePage(document.getElementById('image1') as HTMLImageElement, { eventHub });

page1.drawboard.show((dataUrl: string) => {
  const res = document.getElementById('resultImage') as HTMLImageElement;
  res.src = dataUrl;
});

const page2 = new WhitePage(document.getElementById('image2') as HTMLImageElement, {
  mode: 'mirror',
  eventHub
});

page2.drawboard.show((dataUrl: string) => {
  const res = document.getElementById('resultImage') as HTMLImageElement;
  res.src = dataUrl;
});
