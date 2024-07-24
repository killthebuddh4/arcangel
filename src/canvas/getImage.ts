import Jimp from "jimp";
import { Canvas } from "./Canvas.js";

const CELL_SIZE = 5;

export const getImage = async (args: { canvas: Canvas }) => {
  const image = new Jimp(512, 512, "white");

  for (const point of args.canvas.points) {
    const color = (() => {
      if (point === undefined) {
        return [255, 255, 255];
      } else {
        return point.value;
      }
    })();

    image.scan(
      point.x * CELL_SIZE,
      point.y * CELL_SIZE,
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

  const dataUrl = await image.getBase64Async(Jimp.MIME_PNG);

  return {
    image,
    dataUrl,
  };
};
