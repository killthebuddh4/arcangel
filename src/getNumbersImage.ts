import Jimp from "jimp";
import { parseNumCols } from "./parseNumCols.js";
import { parseNumRows } from "./parseNumRows.js";
import { readCell } from "./readCell.js";
import { getRgb } from "./getRgb.js";

const CELL_SIZE = 16;

export const getNumbersImage = async (args: { numbers: number[][] }) => {
  const image = new Jimp(512, 512, "white");

  const numRows = parseNumRows({ numbers: args.numbers });

  if (!numRows.ok) {
    throw new Error("args.numbers should have been validated");
  }

  const numCols = parseNumCols({ numbers: args.numbers });

  if (!numCols.ok) {
    throw new Error("args.numbers should have been validated");
  }

  for (let y = 0; y < numRows.data; y++) {
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

  for (let x = 0; x < numCols.data; x++) {
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

  for (let y = 0; y < numRows.data; y++) {
    for (let x = 0; x < numCols.data; x++) {
      const value = readCell({ numbers: args.numbers, x, y });

      if (!value.ok) {
        throw new Error("args.grid should have been validated");
      }

      const color = getRgb({ value: value.data });

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

  return {
    image,
    dataUrl,
  };
};
