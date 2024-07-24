import { z } from "zod";

export const setBoundsSchema = z.object({
  bounds: z.object({
    minX: z.number(),
    maxX: z.number(),
    minY: z.number(),
    maxY: z.number(),
  }),
});
