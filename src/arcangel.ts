import { z } from "zod";
import { readTask } from "./lib/readTask.js";
import { readTaskIds } from "./lib/readTaskIds.js";
import { createGrid } from "./lib/createGrid.js";
import { createCell } from "./lib/createCell.js";
import { Cell } from "./types/Cell.js";
import { getColor } from "./lib/getColor.js";
import { createOperator } from "./lib/createOperator.js";
import { Color } from "./types/Color.js";
import { Maybe } from "./types/Maybe.js";
import { createTool } from "./lib/createTool.js";
import { parseColor } from "./lib/parseColor.js";
import { createMaybe } from "./lib/createMaybe.js";
import { getOpenAi } from "./lib/getOpenAi.js";
import { getImage } from "./lib/getImage.js";
import { ChatSystemMessage } from "./types/ChatSystemMessage.js";
import { ChatImageMessage } from "./types/ChatImageMessage.js";
import { getToolCalls } from "./lib/getToolCalls.js";
import { writeImage } from "./lib/writeImage.js";
import { getString } from "./lib/getString.js";
import { Chalk } from "chalk";

const chalk = new Chalk();

const openai = getOpenAi();

const main = async () => {
  const maybeTaskIds = await readTaskIds();

  if (!maybeTaskIds.ok) {
    throw new Error(`Failed to read task ids: ${maybeTaskIds.reason}`);
  }

  const taskId = Math.floor(Math.random() * maybeTaskIds.data.length);

  const maybeTask = await readTask({ id: maybeTaskIds.data[taskId] });

  if (!maybeTask.ok) {
    throw new Error(`Failed to read task: ${maybeTask.reason}`);
  }

  const numbers = maybeTask.data.train[0].input;

  const cells: Cell[][] = [];

  for (let y = 0; y < numbers.length; y++) {
    const row: Cell[] = [];

    for (let x = 0; x < numbers[y].length; x++) {
      const maybeColor = getColor({ code: numbers[y][x] });

      if (!maybeColor.ok) {
        throw new Error(`Failed to get color: ${maybeColor.reason}`);
      }

      const cell = createCell({
        x,
        y,
        color: maybeColor.data,
      });

      if (!cell.ok) {
        throw new Error(`Failed to create cell: ${cell.reason}`);
      }

      row.push(cell.data);
    }

    cells.push(row);
  }

  const input = createGrid({
    height: numbers.length,
    width: numbers[0].length,
    cells,
  });

  if (!input.ok) {
    throw new Error(`Failed to create input grid: ${input.reason}`);
  }

  const inputImage = await getImage({ grid: input.data });

  if (!inputImage.ok) {
    throw new Error(`Failed to get image: ${inputImage.reason}`);
  }

  await writeImage({
    image: inputImage.data.image,
    path: `./data/images/arcangel-input.png`,
  });

  const workingGrid = createGrid({
    height: input.data.height,
    width: input.data.width,
  });

  if (!workingGrid.ok) {
    throw new Error(`Failed to create working grid: ${workingGrid.reason}`);
  }

  const workingGridImage = await getImage({ grid: workingGrid.data });

  if (!workingGridImage.ok) {
    throw new Error(
      `Failed to get working grid image: ${workingGridImage.reason}`,
    );
  }

  await writeImage({
    image: workingGridImage.data.image,
    path: `./data/images/arcangel-working.png`,
  });

  const writeCellsOperator = createOperator({
    name: "writeCellColor",
    description: "Write the color of a cell to the grid.",
    implementation: (grid, params: { x: number; y: number; color: Color }) => {
      grid.cells[params.y][params.x].color = params.color;

      return grid;
    },
  });

  if (!writeCellsOperator.ok) {
    throw new Error(
      `Failed to create writeCells operator: ${writeCellsOperator.reason}`,
    );
  }

  const maybeWriteCellsTool = createTool({
    name: writeCellsOperator.data.name,
    description: writeCellsOperator.data.description,
    inputSchema: z.object({
      x: z.number(),
      y: z.number(),
      color: z.string(),
    }),
    outputSchema: z.object({
      success: z.boolean(),
    }),
    handler: (params): Maybe<{ success: boolean }> => {
      const maybeColor = parseColor({ color: params.color });

      if (!maybeColor.ok) {
        return createMaybe({
          ok: false,
          code: "COLOR_PARSE_FAILED",
          reason: maybeColor,
        });
      }

      writeCellsOperator.data.implementation(workingGrid.data, {
        x: params.x,
        y: params.y,
        color: maybeColor.data,
      });

      return createMaybe({
        ok: true,
        data: { success: true },
      });
    },
  });

  if (!maybeWriteCellsTool.ok) {
    throw new Error(
      `Failed to create writeCells tool: ${maybeWriteCellsTool.reason}`,
    );
  }

  const systemPrompt = `You are operating a shell that exposes commands for working with 2D grids of cells. Each session is initialized with a target grid and a blank working grid. Your goal is to run commands until the working grid matches the target grid. Every command's output is a stringified version of the working grid. Every time a command exits, the shell's daemon will show you an image of the working grid.`;

  const ITER_STATE = {
    max: 100,
    current: 0,
    working: workingGrid.data,
    numToolCalls: 0,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      } as ChatSystemMessage,
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Here's an image of the target grid.",
          },
          {
            type: "image_url",
            image_url: { url: inputImage.data.dataUrl },
          },
        ],
      } as ChatImageMessage,
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "And here's an image of the blank working grid.",
          },
          {
            type: "image_url",
            image_url: { url: workingGridImage.data.dataUrl },
          },
        ],
      } as ChatImageMessage,
    ],
  };

  while (ITER_STATE.current < ITER_STATE.max) {
    ITER_STATE.current++;

    const image = await getImage({ grid: ITER_STATE.working });

    if (!image.ok) {
      throw new Error(`Failed to get image: ${image.reason}`);
    }

    await writeImage({
      image: image.data.image,
      path: `./data/images/arcangel-${ITER_STATE.current}.png`,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      tools: [maybeWriteCellsTool.data.spec],
      messages: ITER_STATE.messages,
    });

    console.log(chalk.yellow(JSON.stringify(response, null, 2)));

    // TODO get the correct type here.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ITER_STATE.messages.push(response.choices[0].message as any);

    const toolCalls = getToolCalls({ completion: response });

    if (!toolCalls.ok) {
      throw new Error(`Failed to get tool calls: ${toolCalls.reason}`);
    }

    for (const toolCall of toolCalls.data) {
      ITER_STATE.numToolCalls++;

      if (toolCall.tool !== maybeWriteCellsTool.data.spec.function.name) {
        throw new Error(`Invalid tool call: ${toolCall.tool}`);
      }

      maybeWriteCellsTool.data.handler(toolCall.args);

      const image = await getImage({ grid: ITER_STATE.working });

      if (!image.ok) {
        throw new Error(`Failed to get image: ${image.reason}`);
      }

      await writeImage({
        image: image.data.image,
        path: `./data/images/arcangel-after-${ITER_STATE.current}-${ITER_STATE.numToolCalls}.png`,
      });

      ITER_STATE.messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        name: toolCall.tool,
        content: getString({ grid: ITER_STATE.working }),
        // TODO get the correct type here.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    }
  }
};

main();
