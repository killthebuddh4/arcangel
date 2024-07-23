import { z } from "zod";

export const taskSchema = z.object({
  train: z.array(
    z.object({
      input: z.array(z.array(z.number())),
      output: z.array(z.array(z.number())),
    }),
  ),
  test: z.array(
    z.object({
      input: z.array(z.array(z.number())),
      output: z.array(z.array(z.number())),
    }),
  ),
});
