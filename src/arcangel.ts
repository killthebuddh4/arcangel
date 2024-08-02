import { z } from "zod";
import { createGrid } from "./lib/createGrid.js";
import { createTool } from "./lib/createTool.js";
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
import { Chalk } from "chalk";
import { getDiff } from "./lib/getDiff.js";
import { createExperiment } from "./lib/createExperiment.js";
import { getTokenEstimate } from "./lib/getTokenEstimate.js";
import { writeExperimentJson } from "./lib/writeExperimentJson.js";
import { createChatAssistantMessage } from "./lib/createChatAssistantMessage.js";
import { isException } from "./lib/isException.js";
import { createException } from "./lib/createException.js";
import { createChatTextMessage } from "./lib/createChatTextMessage.js";

const chalk = new Chalk();

const openai = getOpenAi();

const MODEL = "gpt-4o-mini";

const GRID_SIZE = 8;

const main = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const input = createGrid({
    height: GRID_SIZE,
    width: GRID_SIZE,
    color: "red",
  });

  const workingGrid = createGrid({
    height: input.height,
    width: input.width,
  });

  const setColorRedTool = createTool({
    name: "setColorRed",
    description: "Sets the color of the target cell to red.",
    inputSchema: z.object({
      x: z.number(),
      y: z.number(),
    }),
    outputSchema: z.object({
      success: z.boolean(),
    }),
    handler: (params): { success: boolean } => {
      setCellColor({
        grid: workingGrid,
        x: params.x,
        y: params.y,
        color: "red",
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
    maxIterations: 100,
    targetGrid: input,
    workingGrid: workingGrid,
    tools: [setColorRedTool],
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

        if (toolCall.function.name !== setColorRedTool.spec.function.name) {
          throw new Error(`Invalid tool call: ${toolCall.function.name}`);
        }

        setColorRedTool.handler(toolCall.function.arguments);

        session.messages.push(
          createChatToolResponseMessage({
            toolCallId: toolCall.id,
            name: toolCall.function.name,
            content: getString({ grid: session.workingGrid }),
          }),
        );
      }

      const image = await getImage({ grid: session.workingGrid });

      await writeImage({
        image: image.image,
        path: getWorkingGridPath({ session }),
      });

      session.messages.push(
        createChatImageMessage({
          text: "Here's the most recent image of the working grid.",
          dataUrl: image.dataUrl,
        }),
      );

      const diff = getDiff({
        lhs: session.targetGrid,
        rhs: session.workingGrid,
      });

      const size = session.targetGrid.height * session.targetGrid.width;

      if (diff.diff.length > size) {
        throw new Error("Diff length is greater than grid size.");
      }

      session.messages.push(
        createChatTextMessage({
          // TODO Not going to give any details here because I want to see how much this improves quality.
          content: `After the last command, the working grid has ${diff.diff.length} cells that differ from the target grid.`,
        }),
      );

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

      let stalled = true;
      if (experiment.history.length < 5) {
        stalled = false;
      } else {
        const tail = experiment.history.slice(-5);
        for (let i = 0; i < tail.length - 1; i++) {
          const prev = tail[i];
          const next = tail[i + 1];
          if (prev.progress !== next.progress) {
            stalled = false;
            break;
          }
        }
      }

      if (stalled) {
        session.messages.push(
          createChatTextMessage({
            content: `Progress seems to have stalled at ${diff.diff.length} cells different from the target grid. That indicates that you keep executing the same command. Please try something different.`,
          }),
        );
      }

      let veryStalled = true;
      if (experiment.history.length < 10) {
        veryStalled = false;
      } else {
        const tail = experiment.history.slice(-10);
        for (let i = 0; i < tail.length - 1; i++) {
          const prev = tail[i];
          const next = tail[i + 1];
          if (prev.progress !== next.progress) {
            veryStalled = false;
            break;
          }
        }
      }

      if (veryStalled) {
        throw createException({
          code: "PROGRESS_STALLED",
          reason: `The has stalled at length ${session.currentIteration}.`,
        });
      }

      session.currentIteration++;

      let c = session.currentIteration % 2 == 0 ? chalk.green : chalk.yellow;

      console.log(
        c(
          `Session: ${session.id} Iteration: ${session.currentIteration}, Progress: ${progress}%`,
        ),
      );
    } catch (err) {
      if (isException(err)) {
        session.error = `CODE: ${err.code}, REASON: ${err.reason}`;
      } else {
        session.error = `UNHANDLED ERROR: ${JSON.stringify(err, Object.getOwnPropertyNames(err))}`;
      }

      break;
    }
  }

  writeExperimentJson({ experiment });
};

for (let i = 0; i < 10; i++) {
  await main();
}
