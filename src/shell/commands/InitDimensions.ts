import { z } from "zod";
import { initDimensionsSchema } from "./initDimensionsSchema.js";

export type InitDimensions = {
  operator: "INIT_DIMENSIONS";
  parameters: z.infer<typeof initDimensionsSchema>;
};
