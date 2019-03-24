import { EventHub } from './../../src/event/EventHub';
import { WhitePage } from '../../src/board/WhitePage/index';
import { ChangeEvent } from '../../src/event/Event';

const eventHub = new EventHub();

eventHub.on('change', (changeEv: ChangeEvent) => {
  console.log(changeEv);
});

const page1 = new WhitePage(
  { imgEle: document.getElementById('image1') as HTMLImageElement },
  { eventHub }
);

page1.drawboard.open((dataUrl: string) => {
  const res = document.getElementById('resultImage') as HTMLImageElement;
  res.src = dataUrl;
});

const page2 = new WhitePage(
  { imgEle: document.getElementById('image2') as HTMLImageElement },
  {
    mode: 'mirror',
    eventHub
  }
);

page2.drawboard.open((dataUrl: string) => {
  const res = document.getElementById('resultImage') as HTMLImageElement;
  res.src = dataUrl;
});
