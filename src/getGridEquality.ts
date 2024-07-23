import * as Arc from "./Arc.js";
import { getNumCols } from "./getNumCols.js";
import { getNumRows } from "./getNumRows.js";
import { getCell } from "./getCell.js";

export const getGridEquality = (args: { a: Arc.Grid; b: Arc.Grid }) => {
  const numColsInA = getNumCols({ grid: args.a });
  const numRowsInA = getNumRows({ grid: args.a });
  const numColsInB = getNumCols({ grid: args.b });
  const numRowsInB = getNumRows({ grid: args.b });

  if (numColsInA !== numColsInB) {
    return {
      equal: false,
      reason: "Number of columns is different",
    };
  }

  if (numRowsInA !== numRowsInB) {
    return {
      equal: false,
      reason: "Number of rows is different",
    };
  }

  for (let y = 0; y < numRowsInA; y++) {
    for (let x = 0; x < numColsInA; x++) {
      const aCell = getCell({ grid: args.a, x, y });
      const bCell = getCell({ grid: args.b, x, y });
      if (aCell !== bCell) {
        return {
          equal: false,
          reason: `Value at (${x}, ${y}) is different`,
        };
      }
    }
  }

  return {
    equal: true,
  };
};
