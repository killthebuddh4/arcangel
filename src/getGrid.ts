import * as Arc from "./Arc.js";
import { getGridUrl } from "./getGridUrl.js";

export const getGrid = async (args: {
  url: string;
  numbers: number[][];
}): Promise<Arc.Grid> => {
  const url = getGridUrl({ url: args.url });

  if (args.numbers.length === 0) {
    throw new Error("Grid must have at least one row");
  }

  const numCols = args.numbers[0].length;

  for (const row of args.numbers) {
    if (row.length !== numCols) {
      throw new Error("All rows must have the same length");
    }
  }

  for (const row of args.numbers) {
    for (const num of row) {
      if (!Number.isInteger(num)) {
        throw new Error("All values must be integers");
      }

      if (num < 0) {
        throw new Error("All values must be non-negative");
      }

      if (num > 9) {
        throw new Error("All values must be at most 9");
      }
    }
  }

  return { url, cells: args.numbers as Arc.Value[][] };
};
