import Jimp from "jimp";
import { Grid } from "../types/Grid.js";
import { getCell } from "./getCell.js";
import { getRgb } from "./getRgb.js";
import { createException } from "./createException.js";

const CELL_SIZE = 10;
const I_SIZE = 512;

export const getImage = async (args: {
  grid: Grid;
}): Promise<{ image: Jimp; dataUrl: string }> => {
  const image = new Jimp(I_SIZE, I_SIZE, "white");

  const xOffset = (I_SIZE - args.grid.width * CELL_SIZE) / 2;
  const yOffset = (I_SIZE - args.grid.height * CELL_SIZE) / 2;

  for (
    let x = xOffset;
    x < xOffset + args.grid.width * CELL_SIZE;
    x += CELL_SIZE
  ) {
    const font = await Jimp.loadFont(Jimp.FONT_SANS_8_BLACK);

    image.print(
      font,
      x,
      yOffset - 16,
      {
        text: String(Math.floor((x - xOffset) / CELL_SIZE)),
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
      },
      CELL_SIZE,
      CELL_SIZE,
    );
  }

  for (
    let y = yOffset;
    y < yOffset + args.grid.height * CELL_SIZE;
    y += CELL_SIZE
  ) {
    const font = await Jimp.loadFont(Jimp.FONT_SANS_8_BLACK);

    image.print(
      font,
      xOffset - 16,
      y,
      {
        text: String(Math.floor((y - yOffset) / CELL_SIZE)),
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
      },
      CELL_SIZE,
      CELL_SIZE,
    );
  }

  for (let y = 0; y < args.grid.height; y++) {
    for (let x = 0; x < args.grid.width; x++) {
      const maybeCell = getCell({
        grid: args.grid,
        x,
        y,
      });

      if (!maybeCell.ok) {
        throw createException({
          code: "GET_CELL_FAILED",
          reason: "TODO",
        });
      }

      const rgb = getRgb({
        color: maybeCell.data.color,
      });

      if (!rgb.ok) {
        throw createException({
          code: "GET_RGB_FAILED",
          reason: "TODO",
        });
      }

      image.scan(
        xOffset + x * CELL_SIZE,
        yOffset + y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE,
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
