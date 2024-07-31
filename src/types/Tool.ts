import { ChatCompletionTool } from "openai/src/resources/index.js";

export type Tool<O> = {
  spec: ChatCompletionTool;
  handler: (generated: string) => O;
};
