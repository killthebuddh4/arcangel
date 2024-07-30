import Jimp from "jimp";
import { Field } from "./Field.js";
import { read } from "./getPoint.js";
import { getYs } from "./getYs.js";
import { getXs } from "./getXs.js";

const CELL_SIZE = 10;
const I_SIZE = 512;

export const renderField = async (args: { field: Field }) => {
  const image = new Jimp(I_SIZE, I_SIZE, "white");

  const xOffset = (I_SIZE - args.field.width * CELL_SIZE) / 2;
  const yOffset = (I_SIZE - args.field.height * CELL_SIZE) / 2;

  for (const y of getYs({ field: args.field })) {
    for (const x of getXs({ field: args.field })) {
      const rgb = read({
        field: args.field,
        x,
        y,
      });

      image.scan(
        xOffset + x * CELL_SIZE,
        yOffset + y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE,
        (_x, _y, idx) => {
          image.bitmap.data[idx + 0] = rgb[0];
          image.bitmap.data[idx + 1] = rgb[1];
          image.bitmap.data[idx + 2] = rgb[2];
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
