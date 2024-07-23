import * as Arc from "./Arc.js";
import Jimp from "jimp";
import { readRgb } from "./readRgb.js";

export const writeStreamImage = async (args: {
  streamId: string;
  numbers: number[][];
}) => {
  const image = new Jimp(512, 512, "white");

  const CELL_SIZE = 16;

  for (let y = 0; y < args.numbers.length; y++) {
    for (let x = 0; x < args.numbers[y].length; x++) {
      const color = args.numbers[y][x];
      const rgb = readRgb({ value: color as Arc.Value });

      image.scan(
        x * CELL_SIZE,
        y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE,
        (x, y, idx) => {
          if (!rgb.ok) {
            image.bitmap.data[idx + 0] = 50;
            image.bitmap.data[idx + 1] = 50;
            image.bitmap.data[idx + 2] = 50;
            image.bitmap.data[idx + 3] = 255;
          } else {
            image.bitmap.data[idx + 0] = rgb.data[0];
            image.bitmap.data[idx + 1] = rgb.data[1];
            image.bitmap.data[idx + 2] = rgb.data[2];
            image.bitmap.data[idx + 3] = 255;
          }
        },
      );
    }
  }

  await image.writeAsync(
    `data/images/streams/${args.streamId}-${Date.now()}.png`,
  );
};
