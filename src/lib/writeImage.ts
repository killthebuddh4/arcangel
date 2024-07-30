import Jimp from "jimp";
import { Maybe } from "../types/Maybe.js";
import { createMaybe } from "./createMaybe.js";

export const writeImage = async (args: {
  image: Jimp;
  path: string;
}): Promise<Maybe<{ writtenTo: string }>> => {
  try {
    await args.image.writeAsync(args.path);
  } catch {
    return createMaybe({
      ok: false,
      code: "WRITE_IMAGE_FAILED",
      reason: "Failed to write image",
    });
  }

  return createMaybe({
    ok: true,
    data: {
      writtenTo: args.path,
    },
  });
};
