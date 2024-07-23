export const getUserTextMessage = (args: { text: string }) => {
  return {
    role: "user",
    content: args.text,
  } as {
    role: "user";
    content: string;
  };
};
