import { z } from "zod";
import { writeCellSchema } from "./writeCellSchema.js";

export type WriteCell = {
  operation: "WRITE_CELL";
  parameters: z.infer<typeof writeCellSchema>;
};
