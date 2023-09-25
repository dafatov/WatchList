const {createCanvas} = require('canvas');
const {theme} = require('../styles/theme');

export const createWatchingList = (title, animeList) => {
  const titleFont = '72px sans-serif';
  const listFont = '48px sans-serif';
  const r = 16;
  const indent = 8;

  const heightAfterTitle = 2 * indent + getTextHeight([title], titleFont);
  const {w, h} = {
    w: getMaxTextWidth(animeList, title, titleFont, listFont) + 8 * indent,
    h: heightAfterTitle + getTextHeight(animeList, listFont) + 2 * (animeList.length + 2) * indent,
  };

  const canvas = createCanvas(w, h);
  const context = canvas.getContext('2d');

  context.fillStyle = theme.palette.primary.main;
  context.fillRect(0, 0, w, h);

  context.fillStyle = theme.palette.primary.dark;
  context.font = titleFont;
  context.fillText(title, (w - context.measureText(title).width) / 2, getTextBaseLineHeight(title, titleFont) + indent);

  drawRoundRect(context, [2 * indent, heightAfterTitle], [w - 2 * indent, h - 2 * indent], r);

  context.fillStyle = theme.palette.primary.main;
  context.font = listFont;
  animeList.reduce((acc, anime) => {
    context.fillText(anime, 4 * indent, acc + getTextBaseLineHeight(anime, listFont) + 2 * indent);

    return acc + getTextHeight([anime], listFont) + 2 * indent;
  }, heightAfterTitle);

  return canvas.toDataURL();
};

const getMaxTextWidth = (animeList, title, titleFont, listFont) => testCanvas(context => {
  context.font = titleFont;
  return Math.max(context.measureText(title).width, ...animeList.map(anime => {
    context.font = listFont;
    return context.measureText(anime).width;
  }));
});

const getTextBaseLineHeight = (text, font) => testCanvas(context => {
  context.font = font;
  return context.measureText(text).actualBoundingBoxAscent;
});

const getTextHeight = (textList, font) => testCanvas(context => {
  context.font = font;
  return textList.reduce((acc, text) => {
    const metrics = context.measureText(text);

    return acc + metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  }, 0);
});

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

const testCanvas = callback => {
  const testCanvas = createCanvas(1, 1);
  const testContext = testCanvas.getContext('2d');

  return callback?.(testContext);
};
