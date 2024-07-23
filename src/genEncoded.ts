import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import OpenAI from "openai";
import * as Arc from "./Arc.js";
import { zGrid } from "./zGrid.js";
import { getTaskIds } from "./getTaskIds.js";
import { getNumbers } from "./getNumbers.js";
import { getReferenceImage } from "./getReferenceImage.js";
import { getTask } from "./getTask.js";
import { getGrid } from "./getGrid.js";
import { getGridImage } from "./getGridImage.js";
import { writeTaskImage } from "./writeTaskImage.js";
import { getGridEquality } from "./getGridEquality.js";

const MODEL = "gpt-4o";

type I = Awaited<ReturnType<typeof getGridImage>>;

const zValidateEncodingsParams = z.object({
  encoded: zGrid,
});

const validateEncodingsParamsSchema = zodToJsonSchema(zValidateEncodingsParams);

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

export const genEncoded = async () => {
  const tasks = await getTaskIds();
  const taskId = tasks[Math.floor(Math.random() * tasks.length)];
  const task = await getTask({ id: taskId });

  const state: Record<
    string,
    {
      input: { grid: Arc.Grid; image: I };
      output?: { grid: Arc.Grid; image: I };
    }
  > = {};

  for (const i in task.train) {
    const inputUrl = `${taskId}-train-${i}-input`;
    const inputNumbers = await getNumbers({ url: inputUrl });
    const grid = await getGrid({ url: inputUrl, numbers: inputNumbers });
    const input = await getGridImage({ grid });
    state[inputUrl] = {
      input: {
        grid,
        image: input,
      },
    };
  }

  const referenceImage = await getReferenceImage();

  const exampleTask = await getTask({ id: "1c786137" });
  const exampleGrid = await getGrid({
    url: "1c786137-train-0-input",
    numbers: exampleTask.train[0].input,
  });
  const exampleImage = await getGridImage({ grid: exampleGrid });

  console.log(`genEncoded for task: ${taskId}`);

  const promises = [];

  for (const key of Object.keys(state)) {
    promises.push(
      (async () => {
        console.log(`Processing input: ${key}`);

        const inputImage = state[key].input.image;

        const response = await openai.chat.completions.create({
          model: MODEL,
          tools: [
            {
              type: "function",
              function: {
                name: "validateEncoded",
                description:
                  "Validate that the generated encodings match the input images",
                parameters: validateEncodingsParamsSchema,
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
                  text: "This image represents an integer-to-color mapping. On the left is the integer that should be used to represent its corresponding color.",
                },
                {
                  type: "image_url",
                  image_url: { url: referenceImage.dataUrl },
                },
              ],
            },
            {
              role: "assistant",
              content:
                "So the number on the left corresponds to the color of the row on the right?",
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `That's correct. Here's an example image`,
                },
                {
                  type: "image_url",
                  image_url: { url: exampleImage.dataUrl },
                },
              ],
            },
            {
              role: "assistant",
              content: `Ok so each element in the outer array is a row and each element in a rrow is the mapping of the color to the integer. Here's the encoding for that example image: \n${JSON.stringify(
                exampleGrid.cells,
                null,
                2,
              )}`,
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `That's exactly correct! Now here's an image. Please call the function "validateEncoded" with the encoded image as the argument.`,
                },
                {
                  type: "image_url",
                  image_url: { url: inputImage.dataUrl },
                },
              ],
            },
          ],
        });

        const params = (() => {
          const toolCalls = response.choices[0].message.tool_calls;

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

          const args = zValidateEncodingsParams.safeParse(json);

          if (!args.success) {
            throw new Error(`Invalid arguments: ${args.error.errors}`);
          }

          return args.data;
        })();

        const output: Arc.Grid = {
          url: {
            id: taskId,
            trainOrTest: "train",
            inputOrOutput: "output",
            n: 0,
          },
          // TODO!
          cells: params.encoded as Arc.Value[][],
        };

        const img = await getGridImage({ grid: output });

        state[key].output = {
          grid: output,
          image: img,
        };
      })(),
    );
  }

  await Promise.all(promises);

  for (const key of Object.keys(state)) {
    const inputGrid = state[key].input.grid;
    const outputGrid = state[key].output!.grid;

    const equality = getGridEquality({ a: inputGrid, b: outputGrid });

    if (!equality.equal) {
      console.log(
        `Output failed for input grid: ${inputGrid.url}, reason: ${equality.reason}`,
      );
    }
  }

  await writeTaskImage({
    path: `${taskId}.png`,
    guess: "Testing the encoding generation",
    inputs: Object.values(state).map((s) => s.input.image),
    outputs: Object.values(state).map((s) => s.output!.image),
    testInputs: [],
    testOutputs: [],
  });
};
