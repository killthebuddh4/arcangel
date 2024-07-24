import { zodToJsonSchema } from "zod-to-json-schema";
import type { ChatCompletionTool } from "openai/src/resources/index.js";
import { writeColorSchema } from "./writeColorSchema.js";

export const writeColorToolSpec: ChatCompletionTool = {
  type: "function",
  function: {
    name: "writeColor",
    description: `Writes a color to a point on the canvas.`,
    parameters: zodToJsonSchema(writeColorSchema),
  },
};
