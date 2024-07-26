import { render } from "./render.js";

type I = Awaited<ReturnType<typeof render>>;

export const save = async (args: { path: string; image: I }) => {
  await args.image.image.writeAsync(args.path);
};
