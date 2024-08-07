import { z } from "zod";
import { Tool } from "../types/Tool.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import { createException } from "./createException.js";

// TODO: Look into structured outputs and JSON mode.

export const createTool = <I, O>(args: {
  name: string;
  description: string;
  inputSchema: z.ZodType<I>;
  outputSchema: z.ZodType<O>;
  handler: (input: I) => O;
}): Tool<O> => {
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
      let json;
      try {
        json = JSON.parse(generated);
      } catch {
        throw createException({
          code: "GENERATED_ARGS_ARE_INVALID_JSON",
          reason: `Tool: ${args.name}: The generated arguments are not valid JSON.`,
        });
      }

      const maybeInput = args.inputSchema.safeParse(json);

      if (!maybeInput.success) {
        throw createException({
          code: "GENERATED_ARGS_DO_NOT_MATCH_INPUT_SCHEMA",
          reason: `Tool: ${args.name}: The generated args don't match the input JSON schema. Args were: ${generated}`,
        });
      }

      return args.handler(maybeInput.data);
    },
  };
};
