import { z } from "zod";
import { setViewSchema } from "./setViewSchema.js";

export type SetView = {
  operator: "SET_VIEW";
  parameters: z.infer<typeof setViewSchema>;
};
