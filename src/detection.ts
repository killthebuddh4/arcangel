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
import { Chalk } from "chalk";
import { getDiff } from "./lib/getDiff.js";
import { createExperiment } from "./lib/createExperiment.js";
import { getTokenEstimate } from "./lib/getTokenEstimate.js";
import { writeExperimentJson } from "./lib/writeExperimentJson.js";
import { createChatAssistantMessage } from "./lib/createChatAssistantMessage.js";
import { isException } from "./lib/isException.js";
import { createChatTextMessage } from "./lib/createChatTextMessage.js";
import { getCell } from "./lib/getCell.js";
import { getFeedbackGridPath } from "./lib/getFeedbackGridPath.js";
import { createException } from "./lib/createException.js";

const chalk = new Chalk();

const openai = getOpenAi();

const MODEL = "gpt-4o-mini";

const GRID_SIZE = 8;

const main = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const input = createGrid({
    height: GRID_SIZE,
    width: GRID_SIZE,
    color: "black",
  });

  const xCells: Array<{ x: number; y: number }> = [
    { x: 2, y: 2 },
    { x: 3, y: 3 },
    { x: 4, y: 4 },
    { x: 4, y: 2 },
    { x: 2, y: 4 },
  ];

  for (const cell of xCells) {
    setCellColor({
      grid: input,
      x: cell.x,
      y: cell.y,
      color: "blue",
    });
  }

  const workingGrid = createGrid({
    height: input.height,
    width: input.width,
  });

  const setColorBlueTool = createTool({
    name: "setCellsToBlue",
    description: "Sets the color of the targeted cells to blue.",
    inputSchema: z.object({
      cells: z.array(
        z.object({
          x: z.number(),
          y: z.number(),
        }),
      ),
    }),
    outputSchema: z.object({
      // TODO We could return something like the number of cells written vs the
      // number of cells that were already red.
      success: z.boolean(),
    }),
    handler: (params): { success: boolean } => {
      for (const cell of params.cells) {
        setCellColor({
          grid: workingGrid,
          x: cell.x,
          y: cell.y,
          color: "blue",
        });
      }

      return { success: true };
    },
  });

  const systemPrompt = `You are operating a shell that exposes commands for working with 2D grids of cells. The cells are zero-indexed! Each session is initialized with a "working grid". When you run a command, the command is applied to the working grid. Your goal is to run commands until the user's request has been satisfied. Every command's output is a stringified version of the working grid. Every time a command exits, the shell's daemon will provide feedback in the form of images.`;

  const session = createSession({
    taskId: "target-practice",
    maxIterations: 6,
    targetGrid: input,
    workingGrid: workingGrid,
    tools: [setColorBlueTool],
  });

  const inputImage = await getImage({ grid: input });

  const messages = [
    createChatSystemMessage({
      content: systemPrompt,
    }),
    createChatTextMessage({
      content: `I've initialized the working grid. It is blank. I'm going to show you an image of the "target grid". You will notice that some of the cells are colored blue. Please run a single command that recreates the target grid on the working grid.`,
    }),
    createChatImageMessage({
      text: "Here's the target grid.",
      dataUrl: inputImage.dataUrl,
    }),
  ];

  session.messages.push(...messages);

  const experiment = createExperiment({
    name: "Target practice",
    description:
      "Input is a grid with some cells colored red. The goal is to recreate the input grid from a blank grid.",
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
    for (let y = 0; y < session.workingGrid.height; y++) {
      for (let x = 0; x < session.workingGrid.width; x++) {
        setCellColor({
          grid: session.workingGrid,
          x,
          y,
          color: "black",
        });
      }
    }

    try {
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

      if (toolCalls.length !== 1) {
        session.messages.push(
          createChatTextMessage({
            content: `You tried to run ${toolCalls.length} commands. Please run exactly one command.`,
          }),
        );

        continue;
      }

      for (const toolCall of toolCalls) {
        session.numToolCalls++;

        if (toolCall.function.name !== setColorBlueTool.spec.function.name) {
          throw new Error(`Invalid tool call: ${toolCall.function.name}`);
        }

        setColorBlueTool.handler(toolCall.function.arguments);

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

      const diff = getDiff({
        lhs: session.targetGrid,
        rhs: session.workingGrid,
      });

      const size = session.targetGrid.height * session.targetGrid.width;

      if (diff.diff.length > size) {
        throw new Error("Diff length is greater than grid size.");
      }

      const feedbackGrid = createGrid({
        height: session.targetGrid.height,
        width: session.targetGrid.width,
      });

      for (let y = 0; y < session.workingGrid.height; y++) {
        for (let x = 0; x < session.workingGrid.width; x++) {
          const inputCell = getCell({ grid: session.targetGrid, x, y });
          const workingCell = getCell({ grid: session.workingGrid, x, y });

          if (inputCell.color === workingCell.color) {
            if (inputCell.color === "blue") {
              setCellColor({
                grid: feedbackGrid,
                x,
                y,
                color: "green",
              });
            }

            continue;
          }

          if (inputCell.color === "blue") {
            setCellColor({
              grid: feedbackGrid,
              x,
              y,
              color: "blue",
            });

            continue;
          }

          if (inputCell.color === "black") {
            setCellColor({
              grid: feedbackGrid,
              x,
              y,
              color: "red",
            });

            continue;
          }

          throw new Error("This is supposed to be unreachable.");
        }
      }

      const feedbackImage = await getImage({ grid: feedbackGrid });

      await writeImage({
        image: feedbackImage.image,
        path: getFeedbackGridPath({ session }),
      });

      session.messages.push(
        createChatImageMessage({
          text: "Here's an image of the result of the command. Blue cells are cells that you should have colored blue but didn't. Red cells are cells that you should not have colored blue but did. Green cells are cells that you colored blue correctly.",
          dataUrl: feedbackImage.dataUrl,
        }),
      );

      const progress = diff.diff.length > 0 ? 0 : 100;

      const numTokens = session.messages.reduce((acc, message) => {
        const estimate = getTokenEstimate({ message });
        return acc + estimate;
      }, 0);

      experiment.history.push({
        numTokens,
        numToolCalls: session.numToolCalls,
        progress,
      });

      session.currentIteration++;

      if (session.currentIteration === session.maxIterations) {
        throw createException({
          code: "MAX_ITERATIONS_REACHED",
          reason: "The maximum number of iterations has been reached.",
        });
      }

      console.log(
        (session.currentIteration % 2 === 0 ? chalk.green : chalk.yellow)(
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
