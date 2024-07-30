import { Maybe } from "./Maybe.js";
import { ChatCompletionTool } from "openai/src/resources/index.js";

export type Tool<O> = {
  spec: ChatCompletionTool;
  handler: (generated: string) => Maybe<O>;
};
