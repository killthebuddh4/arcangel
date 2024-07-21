import * as Arc from "../Arc.js";
import Jimp from "jimp";
import { getPoint } from "./getPoint.js";

const CELL_SIZE = 16;

export const getImage = async (args: {
  field: Arc.Field;
  writePath: string;
}) => {
  const image = new Jimp(512, 512, "white");

  for (let y = 0; y < args.field.dimensions.y; y++) {
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

  for (let x = 0; x < args.field.dimensions.x; x++) {
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

  for (let y = 0; y < args.field.dimensions.y; y++) {
    for (let x = 0; x < args.field.dimensions.x; x++) {
      const point = getPoint({ field: args.field, x, y });

      if (!point) {
        throw new Error(`Point not found at x: ${x}, y: ${y}`);
      }

      const color = (() => {
        switch (point.z) {
          case null:
            return [255, 255, 255];
          case 0:
            return [0, 0, 0];
          case 1:
            return [30, 147, 255];
          case 2:
            return [249, 60, 49];
          case 3:
            return [79, 204, 48];
          case 4:
            return [255, 220, 0];
          case 5:
            return [153, 153, 153];
          case 6:
            return [229, 58, 163];
          case 7:
            return [255, 133, 27];
          case 8:
            return [0, 212, 255];
          case 9:
            return [146, 18, 49];
          default:
            throw new Error(`Invalid color index found: ${point.z}`);
        }
      })();

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

  await image.writeAsync(args.writePath);

  return {
    writtenTo: args.writePath,
    image,
    dataUrl,
  };
};
