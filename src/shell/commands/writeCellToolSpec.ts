import { zodToJsonSchema } from "zod-to-json-schema";
import type { ChatCompletionTool } from "openai/src/resources/index.js";
import { writeCellSchema } from "./writeCellSchema.js";

export const writeCellToolSpec: ChatCompletionTool = {
  type: "function",
  function: {
    name: "writeCell",
    description: `Writes a color to a cell in the gird.`,
    parameters: zodToJsonSchema(writeCellSchema),
  },
};
