import { z } from "zod";

export const setViewSchema = z.object({
  view: z.object({
    minX: z.number(),
    maxX: z.number(),
    minY: z.number(),
    maxY: z.number(),
  }),
});
