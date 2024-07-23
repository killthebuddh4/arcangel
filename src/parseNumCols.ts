import { ParseResult } from "./ParseResult.js";

export const parseNumCols = (args: {
  numbers: number[][];
}): ParseResult<number> => {
  const colsInFirstRow = args.numbers[0].length;

  for (let y = 1; y < args.numbers.length; y++) {
    if (args.numbers[y].length !== colsInFirstRow) {
      return {
        ok: false,
        reason: `Row ${y} has ${args.numbers[y].length} columns, but first row has ${colsInFirstRow} columns`,
      };
    }
  }

  return {
    ok: true,
    data: colsInFirstRow,
  };
};
