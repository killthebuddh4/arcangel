import { zodToJsonSchema } from "zod-to-json-schema";
import type { ChatCompletionTool } from "openai/src/resources/index.js";
import { initDimensionsSchema } from "./initDimensionsSchema.js";

export const initDimensionsToolSpec: ChatCompletionTool = {
  type: "function",
  function: {
    name: "initDimensions",
    description:
      "Sets the height and width of the grid. A grid cannot be worked with until its dimensions are set.",
    parameters: zodToJsonSchema(initDimensionsSchema),
  },
};
