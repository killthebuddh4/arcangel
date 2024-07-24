import Jimp from "jimp";
import { Grid } from "../grid/Grid.js";
import { getHeight } from "./getHeight.js";
import { getWidth } from "./getWidth.js";

const CELL_SIZE = 10;

export const getImage = async (args: { grid: Grid }) => {
  const image = new Jimp(512, 512, "white");
  const width = getWidth({ grid: args.grid });
  const height = getHeight({ grid: args.grid });

  // for centering grid
  const xOffset = (512 - width * CELL_SIZE) / 2;
  const yOffset = (512 - height * CELL_SIZE) / 2;

  for (const cell of args.grid.cells) {
    image.scan(
      xOffset + cell.x * CELL_SIZE,
      yOffset + cell.y * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE,
      (_x, _y, idx) => {
        image.bitmap.data[idx + 0] = cell.value[0];
        image.bitmap.data[idx + 1] = cell.value[1];
        image.bitmap.data[idx + 2] = cell.value[2];
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
