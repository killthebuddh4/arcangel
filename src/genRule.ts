import * as Arc from "./Arc.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import OpenAI from "openai";
import { getTaskIds } from "./getTaskIds.js";
import { getTask } from "./getTask.js";
import { getNumbers } from "./getNumbers.js";
import { getGrid } from "./getGrid.js";
import { getGridImage } from "./getGridImage.js";
import { writeTaskImage } from "./writeTaskImage.js";
import { zGrid } from "./zGrid.js";

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

const zValidateOutputParams = z.object({
  outputs: z.array(zGrid),
});

const validateOutputParamsSchema = zodToJsonSchema(zValidateOutputParams);

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
    const inputNumbers = await getNumbers({ url: inputUrl });
    const input = await getGrid({ url: inputUrl, numbers: inputNumbers });
    const outputUrl = `${taskId}-train-${i}-output`;
    const outputNumbers = await getNumbers({ url: outputUrl });
    const output = await getGrid({ url: outputUrl, numbers: outputNumbers });
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

  const ruleResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
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

  const testInputs = [];
  for (const i in task.test) {
    const inputUrl = `${taskId}-test-${i}-input`;
    const inputNumbers = await getNumbers({ url: inputUrl });
    const input = await getGrid({ url: inputUrl, numbers: inputNumbers });
    const img = await getGridImage({ grid: input });
    testInputs.push(img);
  }

  const tests: ImgMessage[] = testInputs.map((grid, i) => {
    return {
      role: "user",
      content: [
        {
          type: "text",
          text: `Test Input ${i + 1}`,
        },
        {
          type: "image_url",
          image_url: { url: grid.dataUrl },
        },
      ],
    };
  });

  const testResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    tools: [
      {
        type: "function",
        function: {
          name: "validateOutput",
          description: "Validate the output of a rule",
          parameters: validateOutputParamsSchema,
        },
      },
    ],
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
      {
        role: "assistant",
        content: ruleResponse.choices[0].message.content,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Great, now I'm going to show you one or more test inputs. I
            want you to call the generate an output for each one using the rule.
            Please call the "validateOutput" function with a list of the outputs
            in order.`.replace(/\s+/g, " "),
          },
        ],
      },
      ...tests,
    ],
  });

  console.log(JSON.stringify(testResponse, null, 2));

  const params = zValidateOutputParams.parse(
    (() => {
      const toolCalls = testResponse.choices[0].message.tool_calls;

      if (toolCalls === undefined) {
        throw new Error("Tool calls not found");
      }

      if (toolCalls.length !== 1) {
        throw new Error("Expected exactly one tool call");
      }

      const argString = toolCalls[0].function.arguments;

      let json;
      try {
        json = JSON.parse(argString);
      } catch (e) {
        throw new Error(`Invalid JSON generated by model: ${argString}`);
      }

      const args = zValidateOutputParams.safeParse(json);

      if (!args.success) {
        throw new Error(`Invalid arguments: ${args.error.errors}`);
      }

      return args.data;
    })(),
  );

  const testOutputs = [];
  for (let i = 0; i < params.outputs.length; i++) {
    const input: Arc.Grid = {
      url: {
        id: taskId,
        trainOrTest: "test",
        inputOrOutput: "output",
        n: i,
      },
      // TODO!
      cells: params.outputs[i] as Arc.Value[][],
    };
    const img = await getGridImage({ grid: input });
    testOutputs.push(img);
  }

  await writeTaskImage({
    path: `${taskId}.png`,
    guess: String(ruleResponse.choices[0].message.content),
    inputs: pairs.map((pair) => pair[0]),
    outputs: pairs.map((pair) => pair[1]),
    testInputs,
    testOutputs,
  });
};
