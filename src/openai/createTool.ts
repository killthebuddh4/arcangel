import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { createFeedback } from "../feedback/createFeedback.js";
import type { ChatCompletionTool } from "openai/src/resources/index.js";
import { Handler } from "./Handler.js";
import { Feedback } from "../feedback/Feedback.js";
import { getHead } from "../model/getHeads.js";
import { Field } from "../field/Field.js";

type ToolFeedbackCode = "INVALID_JSON" | "INVALID_ARGS";

export const createTool = <I, O>(args: {
  name: string;
  description: string;
  inputSchema: z.ZodType<I>;
  outputSchema: z.ZodType<O>;
  tool: (field: Field, i: I) => Feedback<O>;
}): {
  spec: ChatCompletionTool;
  // TODO This of course doesn't actually do anything but it's here as a
  // reminder to do it better.
  handler: (generated: string) => Feedback<O>;
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
    handler: (generated: string) => {
      let json: unknown;
      try {
        json = JSON.parse(generated);
      } catch {
        return createFeedback({
          ok: false,
          code: "INVALID_JSON",
          reason: `Generated string was not valid JSON`,
        });
      }

      const input = args.inputSchema.safeParse(json);

      if (!input.success) {
        return createFeedback({
          ok: false,
          code: "INVALID_ARGS",
          reason: `Generated JSON did not match input schema`,
        });
      }

      const head = getHead();

      return args.tool(head.field, input.data);
    },
  };
};
