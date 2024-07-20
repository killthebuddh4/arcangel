import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

export const getGridDescription = async (args: { gridDataUrl: string }) => {
  return openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Please ignore the white sections of the image. Please focus on the black rectangular section. Please describe the black rectangular section.",
          },
          {
            type: "image_url",
            image_url: { url: args.gridDataUrl },
          },
        ],
      },
    ],
  });
};
