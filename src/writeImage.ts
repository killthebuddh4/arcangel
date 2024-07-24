import { getImage } from "./grid/getImage.js";
import { Grid } from "./grid/Grid.js";

export const writeImage = async (args: { grid: Grid; path: string }) => {
  const image = await getImage({ grid: args.grid });
  await image.image.writeAsync(args.path);
};
