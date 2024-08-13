import { Source } from "./Source.js";
import { createException } from "../lib/createException.js";

export const getCharacter = (args: { source: Source; index: number }) => {
  if (args.index >= args.source.text.length) {
    throw createException({
      code: "READ_CHARACTER_INDEX_OUT_OF_BOUNDS",
      reason: `Cannot read character at index: ${args.index} because source length is ${args.source.text.length}`,
    });
  }

  return args.source.text[args.index];
};
