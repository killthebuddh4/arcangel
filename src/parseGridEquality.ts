import { parseNumCols } from "./parseNumCols.js";
import { parseNumRows } from "./parseNumRows.js";
import { readCell } from "./readCell.js";
import { ParseResult } from "./ParseResult.js";
import { parseNumbers } from "./parseNumbers.js";

export const parseNumbersEquality = (args: {
  a: number[][];
  b: number[][];
}): ParseResult<boolean> => {
  const a = parseNumbers(args.a);

  if (!a.ok) {
    throw new Error("args.a should have been validated already");
  }

  const b = parseNumbers(args.b);

  if (!b.ok) {
    throw new Error("args.b should have been validated already");
  }

  const numColsInA = parseNumCols({ numbers: a.data });

  if (!numColsInA.ok) {
    throw new Error("args.a should have been validated already");
  }

  const numColsInB = parseNumCols({ numbers: b.data });

  if (!numColsInB.ok) {
    throw new Error("args.b should have been validated already");
  }

  if (numColsInA.data !== numColsInB.data) {
    return {
      ok: false,
      reason: `Number of columns in A is ${numColsInA}, but number of columns in B is ${numColsInB}`,
    };
  }

  const numRowsInA = parseNumRows({ numbers: a.data });

  if (!numRowsInA.ok) {
    throw new Error("args.a should have been validated already");
  }

  const numRowsInB = parseNumRows({ numbers: b.data });

  if (!numRowsInB.ok) {
    throw new Error("args.b should have been validated already");
  }

  if (numRowsInA.data !== numRowsInB.data) {
    return {
      ok: false,
      reason: `Number of rows in A is ${numRowsInA}, but number of rows in B is ${numRowsInB}`,
    };
  }

  for (let y = 0; y < numRowsInA.data; y++) {
    for (let x = 0; x < numColsInA.data; x++) {
      const aCell = readCell({ numbers: a.data, x, y });

      if (aCell.ok === false) {
        throw new Error("args.a should have been validated already");
      }

      const bCell = readCell({ numbers: b.data, x, y });

      if (bCell.ok === false) {
        throw new Error("args.b should have been validated already");
      }

      if (aCell.data !== bCell.data) {
        return {
          ok: false,
          reason: `Value at (${x}, ${y}) is different, one has ${aCell.data} but the other has ${bCell.data}`,
        };
      }
    }
  }

  return {
    ok: true,
    data: true,
  };
};
