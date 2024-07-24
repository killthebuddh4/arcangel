import { z } from "zod";
import { writeColorSchema } from "./writeColorSchema.js";

export type WriteColor = {
  operation: "WRITE_COLOR";
  parameters: z.infer<typeof writeColorSchema>;
};
