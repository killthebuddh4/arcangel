import { z } from "zod";
import { setViewSchema } from "./setViewSchema.js";

export type SetView = {
  operation: "SET_VIEW";
  parameters: z.infer<typeof setViewSchema>;
};
