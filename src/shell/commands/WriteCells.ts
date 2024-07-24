import { z } from "zod";
import { writeCellSchema } from "./writeCellsSchema.js";

export type WriteCells = {
  operation: "WRITE_CELLS";
  parameters: z.infer<typeof writeCellSchema>;
};
