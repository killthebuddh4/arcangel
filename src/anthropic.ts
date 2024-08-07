import { z } from "zod";
import { createGrid } from "./lib/createGrid.js";
import { createTool } from "./lib/createTool.js";
import { getAnthropic } from "./lib/getAnthropic.js";
// import { getImage } from "./lib/getImage.js";
import { getDetailedImage as getImage } from "./lib/getDetailedImage.js";
import { writeImage } from "./lib/writeImage.js";
import { createSession } from "./lib/createSession.js";
import { setCellColor } from "./lib/setCellColor.js";
import { getWorkingGridPath } from "./lib/getWorkingGridPath.js";
import { getInputGridPath } from "./lib/getInputGridPath.js";
import { Chalk } from "chalk";
import { getDiff } from "./lib/getDiff.js";
import { createExperiment } from "./lib/createExperiment.js";
// import { getTokenEstimate } from "./lib/getTokenEstimate.js";
import { writeExperimentJson } from "./lib/writeExperimentJson.js";
import { isException } from "./lib/isException.js";
import { createException } from "./lib/createException.js";

const chalk = new Chalk();

const DATAURL_PREFIX = "data:image/png;base64,";

const anthropic = getAnthropic();

const MODEL = "claude-3-5-sonnet-20240620";

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
    color: "black",
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

  // TODO: You just remembered that the openai api supports user "names", the user could be "daemon".
  const systemPrompt = `You are operating a shell that exposes commands for working with 2D grids of cells. Each session is initialized with a target grid and a blank working grid. Your goal is to run commands to transform the working grid into the target grid. Every time a command exits, the shell's daemon will provide feedback.`;

  const session = createSession({
    taskId: "solid-grid-anthropic",
    maxIterations: 20,
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

  const base64Data = workingGridImage.dataUrl.slice(DATAURL_PREFIX.length);

  console.log("DATAURL", workingGridImage.dataUrl);
  console.log("BASE64", base64Data);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages: any[] = [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Ok, I've initialized the working grid. It's blank, here's an image of it.",
        },
        {
          type: "image",
          source: {
            type: "base64",
            media_type: "image/png",
            data: workingGridImage.dataUrl.slice(DATAURL_PREFIX.length),
          },
        },
      ],
    },
    {
      role: "assistant",
      content: [
        {
          type: "text",
          text: `Ok, I see a blank ${GRID_SIZE}x${GRID_SIZE} grid.`,
        },
      ],
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "And here's an image of the target grid.",
        },
        {
          type: "image",
          source: {
            type: "base64",
            media_type: "image/png",
            data: inputImage.dataUrl.slice(DATAURL_PREFIX.length),
          },
        },
      ],
    },
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

      let response;
      try {
        response = await anthropic.messages.create({
          model: MODEL,
          max_tokens: 1000,
          system: systemPrompt,
          tool_choice: { type: "auto" },
          tools: session.tools.map((tool) => {
            return {
              name: tool.spec.function.name,
              description: tool.spec.function.description,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              input_schema: tool.spec.function.parameters as any,
            };
          }),
          // tools: session.tools.map((tool) => tool.spec),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          messages: session.messages as any,
        });
      } catch (err) {
        console.error("ANTHROPIC API ERROR", err);

        throw createException({
          code: "ANTHROPIC_API_ERROR",
          reason: `Error calling the Anthropic API.`,
        });
      }

      console.log(JSON.stringify(response, null, 2));

      session.messages.push({
        role: "assistant",
        content: response.content,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      if (response.stop_reason !== "tool_use") {
        throw createException({
          code: "NOT_TOOL_USE",
          reason: `Response is not a tool call.`,
        });
      }

      for (const toolCall of response.content.filter(
        (c) => c.type === "tool_use",
      )) {
        session.numToolCalls++;

        let toolCallResult;
        switch (toolCall.name) {
          // TODO Keep track of how many extra cells are set in the process. I
          // feel like too many extras is really not good because in many cases
          // we won't have idempotent (or whatever) tools.
          case "setCellsToRed":
            toolCallResult = setColorRedTool.handler(
              JSON.stringify(toolCall.input),
            );
            break;
          case "getDimensions":
            toolCallResult = getDimensionsTool.handler(
              JSON.stringify(toolCall.input),
            );
            break;
          default:
            throw createException({
              code: "TOOL_CALL_INVALID_NAME",
              reason: `Tool call has invalid name: ${toolCall.name}`,
            });
        }

        const image = await getImage({ grid: session.workingGrid });

        await writeImage({
          image: image.image,
          path: getWorkingGridPath({ session }),
        });

        session.messages.push({
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: toolCall.id,
              content: JSON.stringify(toolCallResult, null, 2),
            },
            {
              type: "text",
              text: "Here's an image of the resulting grid.",
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/png",
                data: image.dataUrl.slice(DATAURL_PREFIX.length),
              },
            },
          ],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
      }

      const diff = getDiff({
        lhs: session.targetGrid,
        rhs: session.workingGrid,
      });

      const size = session.targetGrid.height * session.targetGrid.width;

      if (diff.diff.length > size) {
        throw new Error("Diff length is greater than grid size.");
      }

      const progress = Math.floor(((size - diff.diff.length) / size) * 100);

      const numTokens =
        response.usage.input_tokens + response.usage.output_tokens;

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
        throw createException({
          code: "PROGRESS_STALLED",
          reason: `The has stalled at length ${session.currentIteration}.`,
        });
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

  session.elapsedTime = Date.now() - session.startTime;

  writeExperimentJson({ experiment });
};

for (let i = 0; i < 50; i++) {
  await main();
}
