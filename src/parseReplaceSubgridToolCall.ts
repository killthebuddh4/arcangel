import { z } from "zod";
import { ParseResult } from "./ParseResult.js";

export const parseReplaceSubgridToolCall = (
  args: unknown,
): ParseResult<number[][]> => {
  const withGrid = z
    .object({
      grid: z.unknown(),
    })
    .safeParse(args);

  if (!withGrid.success) {
    return {
      ok: false,
      reason: `Params did not have "grid" key`,
    };
  }

  const numbers = z.array(z.array(z.number())).safeParse(withGrid.data.grid);

  if (!numbers.success) {
    return {
      ok: false,
      reason: `Grid was not a 2D array of numbers`,
    };
  }

  return {
    ok: true,
    data: numbers.data,
  };
};
