import * as Arc from "./Arc.js";
import Jimp from "jimp";

export const createGridImage = async (args: {
  grid: Arc.Grid;
  writePath: string;
}) => {
  const image = new Jimp(512, 512, "white");

  const width = 15;
  const height = 15;

  for (let i = 0; i < args.grid.length; i++) {
    for (let j = 0; j < args.grid[0].length; j++) {
      const colorIndex = args.grid[i][j];

      const colorRgb = (() => {
        switch (colorIndex) {
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
            throw new Error(`Invalid color index found: ${colorIndex}`);
        }
      })();

      image.scan(j * width, i * height, width, height, (x, y, idx) => {
        image.bitmap.data[idx + 0] = colorRgb[0];
        image.bitmap.data[idx + 1] = colorRgb[1];
        image.bitmap.data[idx + 2] = colorRgb[2];
        image.bitmap.data[idx + 3] = 255;
      });
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
