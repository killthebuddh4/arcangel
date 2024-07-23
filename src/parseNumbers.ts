import * as Arc from "./Arc.js";
import { z } from "zod";
import { ParseResult } from "./ParseResult.js";

export const parseNumbers = (data: unknown): ParseResult<Arc.Value[][]> => {
  const numbers = z.array(z.array(z.number())).safeParse(data);

  if (!numbers.success) {
    return {
      ok: false,
      reason: `It was not a 2-dimensional array of numbers`,
    };
  }

  for (let y = 0; y < numbers.data.length; y++) {
    for (let x = 0; x < numbers.data[y].length; x++) {
      const value = numbers.data[y][x];

      if (!Number.isInteger(value)) {
        return {
          ok: false,
          reason: `The value at (${x}, ${y}) was not an integer, it was ${value}`,
        };
      }

      if (value < 0 || value > 9) {
        return {
          ok: false,
          reason: `The value at (${x}, ${y}) was not between 0 and 9, it was ${value}`,
        };
      }
    }
  }

  const numCols = numbers.data[0].length;

  for (let y = 0; y < numbers.data.length; y++) {
    if (numbers.data[y].length !== numCols) {
      return {
        ok: false,
        reason: `Row ${y} has ${numbers.data[y].length} columns, but row 0 has ${numCols} columns`,
      };
    }
  }

  return {
    ok: true,
    data: numbers.data as Arc.Value[][],
  };
};
