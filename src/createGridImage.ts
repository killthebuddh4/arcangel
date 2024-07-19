import * as Arc from "./Arc.js";
import Jimp from "jimp";

const COLORS = [
  [0, 0, 0],
  [30, 147, 255],
  [249, 60, 49],
  [79, 204, 48],
  [255, 220, 0],
  [153, 153, 153],
  [229, 58, 163],
  [255, 133, 27],
  [0, 212, 255],
  [146, 18, 49],
];

export const createGridImage = (grid: Arc.Grid) => {
  const image = new Jimp(512, 512, "white");

  const width = 15;
  const height = 15;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const colorIndex = grid[i][j];

      if (colorIndex < 0 || colorIndex >= COLORS.length) {
        throw new Error(`Invalid color index: ${colorIndex}`);
      }

      const colorRgb = COLORS[colorIndex];

      image.scan(j * width, i * height, width, height, (x, y, idx) => {
        image.bitmap.data[idx + 0] = colorRgb[0];
        image.bitmap.data[idx + 1] = colorRgb[1];
        image.bitmap.data[idx + 2] = colorRgb[2];
        image.bitmap.data[idx + 3] = 255;
      });
    }
  }

  return image;
};
