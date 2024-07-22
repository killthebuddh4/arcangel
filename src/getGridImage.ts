import * as Arc from "./Arc.js";
import Jimp from "jimp";
import { getNumCols } from "./getNumCols.js";
import { getNumRows } from "./getNumRows.js";
import { getCell } from "./getCell.js";
import { getRgb } from "./getRgb.js";
import { getGridImagePath } from "./getGridImagePath.js";

const CELL_SIZE = 16;

export const getGridImage = async (args: {
  grid: Arc.Grid;
  opts?: {
    write?: boolean;
  };
}) => {
  const image = new Jimp(512, 512, "white");

  for (let y = 0; y < getNumRows({ grid: args.grid }); y++) {
    const font = await Jimp.loadFont(Jimp.FONT_SANS_8_BLACK);
    image.print(
      font,
      0,
      (y + 1) * CELL_SIZE,
      {
        text: String(y),
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
      },
      CELL_SIZE,
      CELL_SIZE,
    );
  }

  for (let x = 0; x < getNumCols({ grid: args.grid }); x++) {
    const font = await Jimp.loadFont(Jimp.FONT_SANS_8_BLACK);
    image.print(
      font,
      (x + 1) * CELL_SIZE,
      0,
      {
        text: String(x),
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
      },
      CELL_SIZE,
      CELL_SIZE,
    );
  }

  for (let y = 0; y < getNumRows({ grid: args.grid }); y++) {
    for (let x = 0; x < getNumCols({ grid: args.grid }); x++) {
      const value = getCell({ grid: args.grid, x, y });

      if (value === undefined) {
        throw new Error(`Call at (${x}, ${y}) is out of bounds`);
      }

      const color = getRgb({ value });

      image.scan(
        (x + 1) * CELL_SIZE,
        (y + 1) * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE,
        (_x, _y, idx) => {
          image.bitmap.data[idx + 0] = color[0];
          image.bitmap.data[idx + 1] = color[1];
          image.bitmap.data[idx + 2] = color[2];
          image.bitmap.data[idx + 3] = 255;
        },
      );
    }
  }

  const dataUrl = await image.getBase64Async(Jimp.MIME_PNG);

  const write = (() => {
    if (args.opts?.write === undefined) {
      return true;
    }

    return args.opts.write;
  })();

  if (write) {
    await image.writeAsync(getGridImagePath({ grid: args.grid }));
  }

  return {
    image,
    dataUrl,
  };
};
