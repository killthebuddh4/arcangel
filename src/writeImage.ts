import { getImage } from "./canvas/getImage.js";
import { Canvas } from "./canvas/Canvas.js";

export const writeImage = async (args: { canvas: Canvas; path: string }) => {
  const image = await getImage({ canvas: args.canvas });
  await image.image.writeAsync(args.path);
};
