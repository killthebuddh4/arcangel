import { z } from "zod";

export const initDimensionsSchema = z.object({
  dimensions: z.object({
    height: z.number().int().min(1).max(30),
    width: z.number().int().min(1).max(30),
  }),
});
