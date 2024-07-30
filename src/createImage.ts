import Jimp from "jimp";
import { Field } from "./types/Field.js";
import { getPoint } from "./getPoint.js";
import { getRgb } from "./getRgb.js";

const CELL_SIZE = 10;
const I_SIZE = 512;

export const renderField = async (args: { field: Field }) => {
  const image = new Jimp(I_SIZE, I_SIZE, "white");

  const xOffset = (I_SIZE - args.field.width * CELL_SIZE) / 2;
  const yOffset = (I_SIZE - args.field.height * CELL_SIZE) / 2;

  for (let y = 0; y < args.field.height; y++) {
    for (let x = 0; x < args.field.width; x++) {
      const point = getPoint({
        field: args.field,
        x,
        y,
      });

      if (!point.ok) {
        throw new Error(point.reason);
      }

      const rgb = getRgb({
        color: point.data.value,
      });

      if (!rgb.ok) {
        throw new Error(rgb.reason);
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

  const dataUrl = await image.getBase64Async(Jimp.MIME_PNG);

  return {
    image,
    dataUrl,
  };
};
