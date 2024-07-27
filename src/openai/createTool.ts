import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { Feedback } from "../feedback/Feedback.js";
import { createFeedback } from "../feedback/createFeedback.js";
import type { ChatCompletionTool } from "openai/src/resources/index.js";

export const createTool = <
  I extends z.ZodTypeAny,
  O extends z.ZodTypeAny,
>(args: {
  name: string;
  description: string;
  inputSchema: I;
  outputSchema: O;
  handler: (args: z.infer<I>) => z.infer<O>;
}): {
  spec: ChatCompletionTool;
  tool: (generated: string) => Feedback<z.infer<O>>;
} => {
  return {
    spec: {
      type: "function",
      function: {
        name: args.name,
        description: args.description,
        parameters: zodToJsonSchema(args.inputSchema),
      },
    },
    tool: (generated: string) => {
      let json: unknown;
      try {
        json = JSON.parse(generated);
      } catch {
        return createFeedback({
          ok: false,
          reason: `Generated string was not valid JSON`,
        });
      }

      const input = args.inputSchema.safeParse(json);

      if (!input.success) {
        return createFeedback({
          ok: false,
          reason: `Generated JSON did not match input schema`,
        });
      }

      return args.handler(input.data);
    },
  };
};
