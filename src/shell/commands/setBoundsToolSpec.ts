import { zodToJsonSchema } from "zod-to-json-schema";
import type { ChatCompletionTool } from "openai/src/resources/index.js";
import { setBoundsSchema } from "./setBoundsSchema.js";

export const setBoundsToolSpec: ChatCompletionTool = {
  type: "function",
  function: {
    name: "setBounds",
    description:
      "Sets the x and y bounds of the canvas. Once the bounds are set, writes beyond the bounds are an error.",
    parameters: zodToJsonSchema(setBoundsSchema),
  },
};
