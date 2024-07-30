import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { ChatCompletionTool } from "openai/src/resources/index.js";

export const getChatCompletionTool = <I, O>(args: {
  name: string;
  description: string;
  inputSchema: z.ZodType<I>;
  outputSchema: z.ZodType<O>;
}): ChatCompletionTool => {
  return {
    type: "function",
    function: {
      name: args.name,
      description: args.description,
      parameters: zodToJsonSchema(args.inputSchema),
    },
  };
};
