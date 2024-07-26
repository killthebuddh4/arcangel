import { z } from "zod";
import { writeCellSchema } from "./writeCellsSchema.js";

export type WriteCells = {
  operator: "WRITE_CELLS";
  parameters: z.infer<typeof writeCellSchema>;
};
