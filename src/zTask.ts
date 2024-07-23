import { z } from "zod";

const zGrid = z.array(z.array(z.number().min(0).max(9)));

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
