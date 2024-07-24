import { zodToJsonSchema } from "zod-to-json-schema";
import type { ChatCompletionTool } from "openai/src/resources/index.js";
import { setViewSchema } from "./setViewSchema.js";

export const setViewToolSpec: ChatCompletionTool = {
  type: "function",
  function: {
    name: "setView",
    description: `A "view" is a subsection of the canvas. When the view is set, the x and y parameters for future write operations are relative to the view.`,
    parameters: zodToJsonSchema(setViewSchema),
  },
};
