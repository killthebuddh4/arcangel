export const getToolResponseMessage = (args: {
  toolCallId: string;
  tool: string;
  result: unknown;
}) => {
  return {
    tool_call_id: args.toolCallId,
    role: "tool",
    name: args.tool,
    content: JSON.stringify(args.result),
  };
};
