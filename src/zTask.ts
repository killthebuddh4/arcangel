import { z } from "zod";

// id/(train|test)/(input|output)/[n]
export const zTask = z.object({
  train: z.array(
    z.object({
      input: z.array(z.array(z.number().min(0).max(9))),
      output: z.array(z.array(z.number().min(0).max(9))),
    }),
  ),
  test: z.array(
    z.object({
      input: z.array(z.array(z.number().min(0).max(9))),
      output: z.array(z.array(z.number().min(0).max(9))),
    }),
  ),
});
