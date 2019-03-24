import { Whiteboard } from './../src/board/Whiteboard/index';

const images = [
  'https://upload-images.jianshu.io/upload_images/1647496-6bede989c09af527.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
  'http://upload-images.jianshu.io/upload_images/1647496-d281090a702045e5.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240'
];

const whiteboard = new Whiteboard(document.getElementById('root') as HTMLDivElement, images);

whiteboard.open();
