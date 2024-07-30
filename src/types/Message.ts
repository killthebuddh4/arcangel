export type Message =
  | {
      role: "assistant";
      content: string;
    }
  | {
      role: "user";
      content: string;
    }
  | {
      role: "system";
      content: string;
    }
  | {
      role: "user";
      content: [
        {
          type: "text";
          text: string;
        },
        {
          type: "image_url";
          image_url: { url: string };
        },
      ];
    }
  | {
      tool_call_id: string;
      role: "tool";
      name: string;
      content: string;
    };
