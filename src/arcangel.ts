import Jimp from "jimp";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

const main = async () => {
  const img = await Jimp.read("data/grid.png");
  const dataUrl = await img.getBase64Async(Jimp.MIME_PNG);
  console.log(dataUrl);
  const response = await openai.chat.completions.create({
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
            image_url: { url: dataUrl },
          },
        ],
      },
    ],
  });

  console.log(JSON.stringify(response, null, 2));
};

main();
