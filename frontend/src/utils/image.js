const {createCanvas} = require('canvas');
const {theme} = require('../styles/theme');

export const createWatchingList = (title, animeList) => {
  const r = 12;
  const indent = 8;
  const height72 = 64;
  const heightAfterTitle = 2 * indent + height72;
  const titleFont = '72px sans-serif';
  const listFont = '24px sans-serif';
  const {w, h} = {w: getTextWidth(animeList, title, titleFont, listFont) + 8 * indent, h: heightAfterTitle + 4 * (animeList.length + 1) * indent};
  const canvas = createCanvas(w, h);
  const context = canvas.getContext('2d');

  context.fillStyle = theme.palette.primary.main;
  context.fillRect(0, 0, w, h);

  context.fillStyle = theme.palette.primary.dark;
  context.font = titleFont;
  context.fillText(title, (w - context.measureText(title).width) / 2, height72);

  drawRoundRect(context, [2 * indent, heightAfterTitle], [w - 2 * indent, h - 2 * indent], r);

  context.fillStyle = theme.palette.primary.main;
  context.font = listFont;
  // eslint-disable-next-line no-loops/no-loops
  for (let i = 0; i < animeList.length; i++) {
    context.fillText(animeList[i], 4 * indent, heightAfterTitle + 4 * (i + 1) * indent);
  }

  return canvas.toDataURL();
};

const getTextWidth = (animeList, title, titleFont, listFont) => {
  const testCanvas = createCanvas(1, 1);
  const testContext = testCanvas.getContext('2d');

  testContext.font = titleFont;
  return Math.max(testContext.measureText(title).width, ...animeList.map(anime => {
    testContext.font = listFont;
    return testContext.measureText(anime).width;
  }));
};

const drawRoundRect = (context, [x1, y1], [x2, y2], r) => {
  context.beginPath();
  context.moveTo(x1 + r, y1);
  context.arcTo(x2, y1, x2, y1 + r, r);
  context.arcTo(x2, y2, x2 - r, y2, r);
  context.arcTo(x1, y2, x1, y2 - r, r);
  context.arcTo(x1, y1, x1 + r, y1, r);
  context.closePath();
  context.fill();
};
