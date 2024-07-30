export const getSystemMessage = (args: { text: string }) => {
  return {
    role: "system",
    content: args.text,
  } as {
    role: "system";
    content: string;
  };
};
