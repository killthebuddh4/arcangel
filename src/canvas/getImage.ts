import Jimp from "jimp";
import { getPoint } from "./getPoint.js";
import { getBoundingBox } from "./getBoundingBox.js";
import { Canvas } from "./Canvas.js";

const CELL_SIZE = 16;

export const getImage = async (args: { canvas: Canvas }) => {
  const image = new Jimp(512, 512, "white");

  const boundingBox = getBoundingBox({ canvas: args.canvas });

  for (let y = boundingBox.minY; y < boundingBox.maxY; y++) {
    for (let x = boundingBox.minX; x < boundingBox.maxX; x++) {
      const point = getPoint({ x, y, canvas: args.canvas });

      const color = (() => {
        if (point === undefined) {
          return [255, 255, 255];
        } else {
          return point.value;
        }
      })();

      const x0 = x - boundingBox.minX;
      const y0 = y - boundingBox.minY;

      image.scan(
        x0 * CELL_SIZE,
        y0 * CELL_SIZE,
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
