import Jimp from "jimp";
import { Grid } from "../types/Grid.js";
import { getCell } from "./getCell.js";
import { getRgb } from "./getRgb.js";
import { createException } from "./createException.js";

const CELL_SIZE = 40;
const CELL_PADDING = 4;
// const FONT_SIZE = 18;
const I_SIZE = 512;
// const font = await Jimp.loadFont(Jimp.FONT_SANS_8_BLACK);

export const getImage = async (args: {
  grid: Grid;
}): Promise<{ image: Jimp; dataUrl: string }> => {
  const image = new Jimp(I_SIZE, I_SIZE, "white");

  const xOffset = (I_SIZE - args.grid.width * CELL_SIZE) / 2;
  const yOffset = (I_SIZE - args.grid.height * CELL_SIZE) / 2;

  for (let y = 0; y < args.grid.height; y++) {
    for (let x = 0; x < args.grid.width; x++) {
      const cell = getCell({
        grid: args.grid,
        x,
        y,
      });

      const rgb = getRgb({
        color: cell.color,
      });

      if (!rgb.ok) {
        throw createException({
          code: "GET_RGB_FAILED",
          reason: "TODO",
        });
      }

      image.scan(
        xOffset + CELL_PADDING + x * CELL_SIZE,
        yOffset + CELL_PADDING + y * CELL_SIZE,
        CELL_SIZE - 2 * CELL_PADDING,
        CELL_SIZE - 2 * CELL_PADDING,
        (_x, _y, idx) => {
          image.bitmap.data[idx + 0] = rgb.data[0];
          image.bitmap.data[idx + 1] = rgb.data[1];
          image.bitmap.data[idx + 2] = rgb.data[2];
          image.bitmap.data[idx + 3] = 255;
        },
      );
    }
  }

  return {
    image,
    dataUrl: await image.getBase64Async(Jimp.MIME_PNG),
  };
};
