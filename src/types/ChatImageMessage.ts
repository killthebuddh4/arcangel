export type ChatImageMessage = {
  role: "user";
  content: [
    {
      type: "text";
      text: string;
    },
    {
      type: "image_url";
      image_url: { url: string; detail: "low" | "high" };
    },
  ];
};
