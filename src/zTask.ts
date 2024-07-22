import { z } from "zod";
import { zGrid } from "./zGrid.js";

export const zTask = z.object({
  train: z.array(
    z.object({
      input: zGrid,
      output: zGrid,
    }),
  ),
  test: z.array(
    z.object({
      input: zGrid,
      output: zGrid,
    }),
  ),
});
