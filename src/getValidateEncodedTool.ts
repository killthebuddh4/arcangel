import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { ChatCompletionTool } from "openai/src/resources/index.js";

export const getValidateEncodedTool = (): ChatCompletionTool => {
  return {
    type: "function",
    function: {
      name: "validateEncoded",
      description:
        "Validate encoded grid. Returns an object representing the validation result.",
      parameters: zodToJsonSchema(
        z.object({ grid: z.array(z.array(z.number())) }),
      ),
    },
  };
};
