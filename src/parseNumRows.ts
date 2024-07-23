import { ParseResult } from "./ParseResult.js";

export const parseNumRows = (args: {
  numbers: number[][];
}): ParseResult<number> => {
  return {
    ok: true,
    data: args.numbers.length,
  };
};
