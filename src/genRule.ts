import OpenAI from "openai";
import { getTaskIds } from "./getTaskIds.js";
import { getTask } from "./getTask.js";
import { getGrid } from "./getGrid.js";
import { getGridImage } from "./getGridImage.js";
import { writeTaskImage } from "./writeTaskImage.js";

type ImgMessage = {
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

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

export const genRule = async () => {
  const tasks = await getTaskIds();
  const taskId = tasks[Math.floor(Math.random() * tasks.length)];

  console.log(`Generating rule for task ${taskId}`);

  const task = await getTask({ id: taskId });
  const grids = [];
  for (const i in task.train) {
    const inputUrl = `${taskId}-train-${i}-input`;
    const input = await getGrid({ url: inputUrl });
    const outputUrl = `${taskId}-train-${i}-output`;
    const output = await getGrid({ url: outputUrl });
    grids.push([input, output]);
  }

  const pairs = [];
  for (const grid of grids) {
    const inputImg = await getGridImage({ grid: grid[0] });
    const outputImg = await getGridImage({ grid: grid[1] });
    pairs.push([inputImg, outputImg]);
  }

  const inputs: ImgMessage[] = pairs.map((pair, i) => {
    return {
      role: "user",
      content: [
        {
          type: "text",
          text: `Input ${i + 1}`,
        },
        {
          type: "image_url",
          image_url: { url: pair[0].dataUrl },
        },
      ],
    };
  });

  const outputs: ImgMessage[] = pairs.map((pair, i) => {
    return {
      role: "user",
      content: [
        {
          type: "text",
          text: `Output ${i + 1}`,
        },
        {
          type: "image_url",
          image_url: { url: pair[1].dataUrl },
        },
      ],
    };
  });

  const messages: ImgMessage[] = [];

  for (let i = 0; i < pairs.length; i++) {
    messages.push(inputs[i]);
    messages.push(outputs[i]);
  }

  console.log("Sending messages to OpenAI");

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "Please answer the user's queries. Please ignore the white section of the images. Please focus on the indexed grid sections.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "I'm going to show you a bunch of input/output image pairs. Every output was generated from its corresponding input using the same rule as the others. I want you to tell me what the rule is.",
          },
        ],
      },
      ...messages,
    ],
  });

  console.log("Received response from OpenAI");

  console.log(JSON.stringify(response, null, 2));
  const guess = response.choices[0].message.content;

  await writeTaskImage({
    path: `${taskId}.png`,
    guess: String(guess),
    inputs: pairs.map((pair) => pair[0]),
    outputs: pairs.map((pair) => pair[1]),
    tests: [],
  });
};
