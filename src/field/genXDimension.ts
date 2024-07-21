import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

export const genXDimension = async (args: { fieldDataUrl: string }) => {
  return openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Please answer the user's queries. Please ignore the white section of the image. Please focus on the indexed grid section.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "How many cells are there in the x dimension?",
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
