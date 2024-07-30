export const getAssistantMessage = (args: { text: string }) => {
  return {
    role: "assistant",
    content: args.text,
  } as const;
};
