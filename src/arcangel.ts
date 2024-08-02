import { z } from "zod";
import { createGrid } from "./lib/createGrid.js";
import { createOperator } from "./lib/createOperator.js";
import { Color } from "./types/Color.js";
import { createTool } from "./lib/createTool.js";
import { parseColor } from "./lib/parseColor.js";
import { getOpenAi } from "./lib/getOpenAi.js";
import { getImage } from "./lib/getImage.js";
import { createChatSystemMessage } from "./lib/createChatSystemMessage.js";
import { createChatImageMessage } from "./lib/createChatImageMessage.js";
import { getToolCalls } from "./lib/getToolCalls.js";
import { writeImage } from "./lib/writeImage.js";
import { getString } from "./lib/getString.js";
import { createChatToolResponseMessage } from "./lib/createChatToolResponseMessage.js";
import { createSession } from "./lib/createSession.js";
import { setCellColor } from "./lib/setCellColor.js";
import { createChatToolCallMessage } from "./lib/createChatToolCallMessage.js";
import { getWorkingGridPath } from "./lib/getWorkingGridPath.js";
import { getInputGridPath } from "./lib/getInputGridPath.js";
import { createException } from "./lib/createException.js";
import { Chalk } from "chalk";
import { getDiff } from "./lib/getDiff.js";
import { createExperiment } from "./lib/createExperiment.js";
import { getTokenEstimate } from "./lib/getTokenEstimate.js";
import { writeExperimentJson } from "./lib/writeExperimentJson.js";
import { createChatAssistantMessage } from "./lib/createChatAssistantMessage.js";

const chalk = new Chalk();

const openai = getOpenAi();

const MODEL = "gpt-4o";

const main = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const input = createGrid({
    height: 4,
    width: 4,
    color: "red",
  });

  const workingGrid = createGrid({
    height: input.height,
    width: input.width,
  });

  const writeCellsOperator = createOperator({
    name: "writeCellColor",
    description: "Write the color of a cell to the grid.",
    implementation: (grid, params: { x: number; y: number; color: Color }) => {
      setCellColor({
        grid,
        x: params.x,
        y: params.y,
        color: params.color,
      });

      return grid;
    },
  });

  const writeCellsTool = createTool({
    name: writeCellsOperator.name,
    description: writeCellsOperator.description,
    inputSchema: z.object({
      x: z.number(),
      y: z.number(),
      color: z.string(),
    }),
    outputSchema: z.object({
      success: z.boolean(),
    }),
    handler: (params): { success: boolean } => {
      const maybeColor = parseColor({ color: params.color });

      if (!maybeColor.ok) {
        throw createException({
          code: "COLOR_PARSE_FAILED",
          reason: `Failed to parse color: ${params.color}`,
        });
      }

      writeCellsOperator.implementation(workingGrid, {
        x: params.x,
        y: params.y,
        color: maybeColor.data,
      });

      return { success: true };
    },
  });

  const systemPrompt = `You are operating a shell that exposes commands for working with 2D grids of cells. The cells are zero-indexed! Each session is initialized with a target grid and a blank working grid. Your goal is to run commands until the user's request has been satisfied. Every command's output is a stringified version of the working grid. Every time a command exits, the shell's daemon will show you an image of the working grid.`;

  const exampleGridBlue = createGrid({
    height: 8,
    width: 8,
    color: "blue",
  });

  const exampleGridBlueImage = await getImage({ grid: exampleGridBlue });

  const exampleGridPurple = createGrid({
    height: 5,
    width: 5,
    color: "purple",
  });

  const exampleGridPurpleImage = await getImage({
    grid: exampleGridPurple,
  });

  const session = createSession({
    taskId: "micro-solid-grids",
    maxIterations: 30,
    targetGrid: input,
    workingGrid: workingGrid,
    tools: [writeCellsTool],
  });

  const workingGridImage = await getImage({ grid: session.workingGrid });

  const inputImage = await getImage({ grid: input });

  await writeImage({
    image: inputImage.image,
    path: getInputGridPath({ session }),
  });

  const messages = [
    createChatSystemMessage({
      content: systemPrompt,
    }),
    createChatImageMessage({
      text: "Here's an image of an example target grid.",
      dataUrl: exampleGridBlueImage.dataUrl,
    }),
    createChatImageMessage({
      text: "And here's an image of the corresponding completed working grid.",
      dataUrl: exampleGridBlueImage.dataUrl,
    }),
    createChatImageMessage({
      text: "Here's an image of another example target grid.",
      dataUrl: exampleGridPurpleImage.dataUrl,
    }),
    createChatImageMessage({
      text: "And here's an image of the corresponding completed working grid.",
      dataUrl: exampleGridPurpleImage.dataUrl,
    }),
    createChatImageMessage({
      text: "Here's an image of the target grid.",
      dataUrl: inputImage.dataUrl,
    }),
    createChatImageMessage({
      text: "And here's an image of the blank working grid.",
      dataUrl: workingGridImage.dataUrl,
    }),
  ];

  session.messages.push(...messages);

  const experiment = createExperiment({
    name: "Recreate solid grids",
    description: "Input is a solid grid, output should be the same solid grid.",
    parameters: {
      model: MODEL,
      examples: 2,
      includeGridlines: true,
      returnEncoded: true,
      dimensions: {
        height: 4,
        width: 4,
      },
    },
    session,
  });

  while (session.currentIteration < session.maxIterations) {
    try {
      const diff = getDiff({
        lhs: session.targetGrid,
        rhs: session.workingGrid,
      });

      const size = session.targetGrid.height * session.targetGrid.width;

      if (diff.diff.length > size) {
        throw new Error("Diff length is greater than grid size.");
      }

      const progress = Math.floor(((size - diff.diff.length) / size) * 100);

      const numTokens = session.messages.reduce((acc, message) => {
        const estimate = getTokenEstimate({ message });
        return acc + estimate;
      }, 0);

      experiment.history.push({
        numTokens,
        numToolCalls: session.numToolCalls,
        progress,
      });

      console.log(chalk.green(JSON.stringify(experiment.history, null, 2)));

      session.currentIteration++;

      const workingGridImage = await getImage({ grid: session.workingGrid });

      await writeImage({
        image: workingGridImage.image,
        path: getWorkingGridPath({ session }),
      });

      const response = await openai.chat.completions.create({
        model: MODEL,
        tools: session.tools.map((tool) => tool.spec),
        messages: session.messages,
      });

      const toolCalls = getToolCalls({ completion: response });

      if (toolCalls === undefined) {
        if (response.choices[0].message.content === null) {
          throw new Error(
            `Response is not a tool call or an assistant message.`,
          );
        }

        session.messages.push(
          createChatAssistantMessage({
            content: response.choices[0].message.content,
          }),
        );
        // TODO, we assume the model is just done here, but we don't need to
        // assume that.
        break;
      }

      session.messages.push(
        createChatToolCallMessage({
          content: response.choices[0].message.content,
          toolCalls,
        }),
      );

      for (const toolCall of toolCalls) {
        session.numToolCalls++;

        if (toolCall.function.name !== writeCellsTool.spec.function.name) {
          throw new Error(`Invalid tool call: ${toolCall.function.name}`);
        }

        writeCellsTool.handler(toolCall.function.arguments);

        session.messages.push(
          createChatToolResponseMessage({
            toolCallId: toolCall.id,
            name: toolCall.function.name,
            content: getString({ grid: session.workingGrid }),
          }),
        );
      }

      const resultWorkingGridImage = await getImage({
        grid: session.workingGrid,
      });

      await writeImage({
        image: resultWorkingGridImage.image,
        path: getWorkingGridPath({ session }),
      });

      const image = await getImage({ grid: session.workingGrid });

      session.messages.push(
        createChatImageMessage({
          text: "Here's the most recent image of the working grid.",
          dataUrl: image.dataUrl,
        }),
      );
    } catch {
      break;
    }
  }

  writeExperimentJson({ experiment });
};

for (let i = 0; i < 10; i++) {
  await main();
}
