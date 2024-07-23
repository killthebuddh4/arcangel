import * as Arc from "./Arc.js";
import { parseNumCols } from "./parseNumCols.js";
import { parseNumRows } from "./parseNumRows.js";
import { ParseResult } from "./ParseResult.js";

export const readCell = (args: {
  numbers: number[][];
  x: number;
  y: number;
}): ParseResult<Arc.Value> => {
  const numRows = parseNumRows({ numbers: args.numbers });

  if (numRows.ok === false) {
    throw new Error(
      "parseNumRows failed but args.numbers should have been validated already",
    );
  }

  const numCols = parseNumCols({ numbers: args.numbers });

  if (numCols.ok === false) {
    throw new Error(
      "parseNumCols failed but args.numbers should have been validated already",
    );
  }

  if (args.y < 0) {
    return {
      ok: false,
      reason: `y: ${args.y} is less than 0`,
    };
  }

  if (args.y >= numRows.data) {
    return {
      ok: false,
      reason: "y: ${args.y} is greater than or equal to numRows",
    };
  }

  if (args.x < 0) {
    return {
      ok: false,
      reason: `x: ${args.x} is less than 0`,
    };
  }

  if (args.x >= numCols.data) {
    return {
      ok: false,
      reason: `x: ${args.x} is greater than or equal to numCols`,
    };
  }

  return {
    ok: true,
    data: args.numbers[args.y][args.x] as Arc.Value,
  };
};
