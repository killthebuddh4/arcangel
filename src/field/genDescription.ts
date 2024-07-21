import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

export const genDescription = async (args: { fieldDataUrl: string }) => {
  return openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Please ignore the white section of the image. Please focus on the indexed grid section.",
          },
          {
            type: "image_url",
            image_url: { url: args.fieldDataUrl },
          },
        ],
      },
    ],
  });
};
