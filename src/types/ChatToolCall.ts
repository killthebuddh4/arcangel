export type ChatToolCall = {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
};
