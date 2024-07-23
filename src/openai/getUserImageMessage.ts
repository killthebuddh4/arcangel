export const getUserImageMessage = (args: {
  text: string;
  dataUrl: string;
}) => {
  return {
    role: "user",
    content: [
      {
        type: "text",
        text: args.text,
      },
      {
        type: "image_url",
        image_url: { url: args.dataUrl },
      },
    ],
  } as {
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
  };
};
