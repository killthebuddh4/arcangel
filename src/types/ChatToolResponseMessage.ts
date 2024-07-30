export type ChatToolResponseMessage = {
  tool_call_id: string;
  role: "tool";
  name: string;
  content: string;
};
