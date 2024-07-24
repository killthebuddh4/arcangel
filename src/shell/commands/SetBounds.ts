import { z } from "zod";
import { setBoundsSchema } from "./setBoundsSchema.js";

export type SetBounds = {
  operation: "SET_BOUNDS";
  parameters: z.infer<typeof setBoundsSchema>;
};
