import { render } from "./render.js";

type I = Awaited<ReturnType<typeof render>>;

export const save = async (args: { path: string; image: I }) => {
  console.log(`Saving image to data/images/${args.path}`);
  await args.image.image.writeAsync(`data/images/${args.path}`);
};
