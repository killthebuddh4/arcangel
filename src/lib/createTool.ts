import { z } from "zod";
import { Maybe } from "../types/Maybe.js";
import { createMaybe } from "./createMaybe.js";
import { Tool } from "../types/Tool.js";
import { zodToJsonSchema } from "zod-to-json-schema";

export const createTool = <I, O>(args: {
  name: string;
  description: string;
  inputSchema: z.ZodType<I>;
  outputSchema: z.ZodType<O>;
  handler: (input: I) => Maybe<O>;
}): Maybe<Tool<O>> => {
  return createMaybe({
    ok: true,
    data: {
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
        } catch (e) {
          return createMaybe({
            ok: false,
            code: "GENERATED_ARGS_ARE_INVALID_JSON",
            reason: "The generated arguments are not valid JSON.",
          });
        }

        const maybeInput = args.inputSchema.safeParse(json);

        if (!maybeInput.success) {
          return createMaybe({
            ok: false,
            code: "GENERATED_ARGS_INPUT_SCHEMA_MISMATCH",
            reason: "The generated args don't match the input JSON schema.",
          });
        }

        return args.handler(maybeInput.data);
      },
    },
  });
};
