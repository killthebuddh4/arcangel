import { z } from "zod";
import { createGrid } from "./lib/createGrid.js";
import { createTool } from "./lib/createTool.js";
import { getOpenAi } from "./lib/getOpenAi.js";
// import { getImage } from "./lib/getImage.js";
import { getDetailedImage as getImage } from "./lib/getDetailedImage.js";
import { createChatSystemMessage } from "./lib/createChatSystemMessage.js";
import { createChatImageMessage } from "./lib/createChatImageMessage.js";
import { getToolCalls } from "./lib/getToolCalls.js";
import { writeImage } from "./lib/writeImage.js";
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
      color: "red",
    });
  }

  const workingGrid = createGrid({
    height: input.height,
    width: input.width,
  });

  const getDimensionsTool = createTool({
    name: "getDimensions",
    description: "Returns the dimensions of the grid.",
    inputSchema: z.object({}),
    outputSchema: z.object({
      height: z.number(),
      width: z.number(),
      minX: z.number(),
      maxX: z.number(),
      minY: z.number(),
      maxY: z.number(),
    }),
    handler: () => {
      return {
        height: workingGrid.height,
        width: workingGrid.width,
        minX: 0,
        maxX: workingGrid.width - 1,
        minY: 0,
        maxY: workingGrid.height - 1,
      };
    },
  });

  const setColorBlackTool = createTool({
    name: "setCellsToBlack",
    description: "Sets the color of the targeted cells to black.",
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
          color: "black",
        });
      }

      return { success: true };
    },
  });

  const setColorRedTool = createTool({
    name: "setCellsToRed",
    description: "Sets the color of the targeted cells to red.",
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
          color: "red",
        });
      }

      return { success: true };
    },
  });

  const setRedXTool = createTool({
    name: "setRedX",
    description:
      "Colors an X pattern, centered at (x, y), to red. The size parameter controls how many cells each arm of the X has, not including the center.",
    inputSchema: z.object({
      x: z.number(),
      y: z.number(),
      size: z.number(),
    }),
    outputSchema: z.object({
      // TODO We could return something like the number of cells written vs the
      // number of cells that were already red.
      success: z.boolean(),
    }),
    handler: (params): { success: boolean } => {
      for (let i = 0; i <= params.size; i++) {
        setCellColor({
          grid: workingGrid,
          x: params.x + i,
          y: params.y + i,
          color: "red",
        });

        setCellColor({
          grid: workingGrid,
          x: params.x - i,
          y: params.y + i,
          color: "red",
        });

        setCellColor({
          grid: workingGrid,
          x: params.x + i,
          y: params.y - i,
          color: "red",
        });

        setCellColor({
          grid: workingGrid,
          x: params.x - i,
          y: params.y - i,
          color: "red",
        });
      }

      return { success: true };
    },
  });

  // TODO: You just remembered that the openai api supports user "names", the user could be "daemon".
  const systemPrompt = `You are operating a shell that exposes commands for working with 2D grids of cells. Each session is initialized with a target grid and a blank working grid. Your goal is to run commands to transform the working grid into the target grid. Every time a command exits, the shell's daemon will provide feedback.`;

  const session = createSession({
    taskId: "micro-x-grids",
    maxIterations: 100,
    targetGrid: input,
    workingGrid: workingGrid,
    tools: [setColorRedTool, getDimensionsTool],
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
      text: "Ok, I've initialized the working grid. It's blank, here's an image of it.",
      // text: "Ok, now that you've seen some examples, I've initialized the working grid. It's blank, here's an image of it.",
      dataUrl: workingGridImage.dataUrl,
    }),
    createChatImageMessage({
      text: "And here's an image of the target grid.",
      dataUrl: inputImage.dataUrl,
    }),
    createChatTextMessage({
      content:
        "Before you run any commands, please describe to me the target grid.",
    }),
  ];

  session.messages.push(...messages);

  const experiment = createExperiment({
    name: "Recreate X grids",
    description:
      "Input is a solid grid with an X on it, output should be the same grid.",
    parameters: {
      model: MODEL,
      // THIS SHOULD NOT BE HARD-CODED, the value is wrong for most of the
      // experiments now.
      examples: 2,
      // Ah, this is wrong too. Most of these parameters are wrong in my
      // recorded exp.md files.
      includeGridlines: false,
      returnEncoded: true,
      dimensions: {
        height: GRID_SIZE,
        width: GRID_SIZE,
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
        console.log(`Called: ${toolCall.function.name}`);
        session.numToolCalls++;

        let toolCallResult;
        switch (toolCall.function.name) {
          // TODO Keep track of how many extra cells are set in the process. I
          // feel like too many extras is really not good because in many cases
          // we won't have idempotent (or whatever) tools.
          case "setCellsToRed":
            toolCallResult = setColorRedTool.handler(
              toolCall.function.arguments,
            );
            break;
          case "setCellsToBlack":
            toolCallResult = setColorBlackTool.handler(
              toolCall.function.arguments,
            );
            break;
          case "getDimensions":
            toolCallResult = getDimensionsTool.handler(
              toolCall.function.arguments,
            );
            break;
          case "setRedX":
            toolCallResult = setRedXTool.handler(toolCall.function.arguments);
            break;
          default:
            throw createException({
              code: "TOOL_CALL_INVALID_NAME",
              reason: `Tool call has invalid name: ${toolCall.function.name}`,
            });
        }

        session.messages.push(
          createChatToolResponseMessage({
            toolCallId: toolCall.id,
            name: toolCall.function.name,
            content: JSON.stringify(toolCallResult, null, 2),
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

      const randomIncompleteCell =
        diff.diff[Math.floor(Math.random() * diff.diff.length)];

      if (stalled) {
        session.messages.push(
          createChatTextMessage({
            content: `Progress seems to have stalled at ${diff.diff.length} cells different from the target grid. That indicates that you keep executing the same command. One example of a cell that is different is the cell at (${randomIncompleteCell.x}, ${randomIncompleteCell.y}).`,
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
