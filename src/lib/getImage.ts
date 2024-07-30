import Jimp from "jimp";
import { Maybe } from "../types/Maybe.js";
import { Grid } from "../types/Grid.js";
import { getCell } from "./getCell.js";
import { getRgb } from "./getRgb.js";
import { createMaybe } from "./createMaybe.js";

const CELL_SIZE = 10;
const I_SIZE = 512;

export const getImage = async (args: {
  grid: Grid;
}): Promise<Maybe<{ image: Jimp; dataUrl: string }>> => {
  const image = new Jimp(I_SIZE, I_SIZE, "white");

  const xOffset = (I_SIZE - args.grid.width * CELL_SIZE) / 2;
  const yOffset = (I_SIZE - args.grid.height * CELL_SIZE) / 2;

  for (let y = 0; y < args.grid.height; y++) {
    for (let x = 0; x < args.grid.width; x++) {
      const maybeCell = getCell({
        grid: args.grid,
        x,
        y,
      });

      if (!maybeCell.ok) {
        return createMaybe({
          ok: false,
          code: "GET_CELL_FAILED",
          reason: maybeCell,
        });
      }

      const rgb = getRgb({
        color: maybeCell.data.color,
      });

      if (!rgb.ok) {
        return createMaybe({
          ok: false,
          code: "GET_RGB_FAILED",
          reason: rgb,
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

  return createMaybe({
    ok: true,
    data: {
      image,
      dataUrl: await image.getBase64Async(Jimp.MIME_PNG),
    },
  });
};
