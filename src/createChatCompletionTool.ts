import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { ChatCompletionTool } from "openai/src/resources/index.js";

export const createChatCompletionTool = (args: {
  name: string;
  description: string;
  paramsSchema: z.ZodTypeAny;
}): ChatCompletionTool => {
  return {
    type: "function",
    function: {
      name: args.name,
      description: args.description,
      parameters: zodToJsonSchema(args.paramsSchema),
    },
  };
};
