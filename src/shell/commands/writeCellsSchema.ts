import { z } from "zod";

export const writeCellSchema = z.object({
  cells: z.array(
    z.object({
      x: z.number(),
      y: z.number(),
      color: z.union([
        z.literal("red"),
        z.literal("orange"),
        z.literal("yellow"),
        z.literal("green"),
        z.literal("blue"),
        z.literal("purple"),
        z.literal("pink"),
        z.literal("brown"),
        z.literal("gray"),
        z.literal("black"),
      ]),
    }),
  ),
});
