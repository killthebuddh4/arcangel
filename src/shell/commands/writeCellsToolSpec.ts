import { zodToJsonSchema } from "zod-to-json-schema";
import type { ChatCompletionTool } from "openai/src/resources/index.js";
import { writeCellSchema } from "./writeCellsSchema.js";

export const writeCellToolSpec: ChatCompletionTool = {
  type: "function",
  function: {
    name: "writeCells",
    description: `Writes colored cells to the grid`,
    parameters: zodToJsonSchema(writeCellSchema),
  },
};
