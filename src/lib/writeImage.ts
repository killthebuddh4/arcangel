import { renderField } from "./createImage.js";

type I = Awaited<ReturnType<typeof renderField>>;

export const save = async (args: { path: string; image: I }) => {
  await args.image.image.writeAsync(args.path);
};
