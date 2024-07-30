import { z } from "zod";
import { createGrid } from "./lib/createGrid.js";
import { createOperator } from "./lib/createOperator.js";
import { Color } from "./types/Color.js";
import { Maybe } from "./types/Maybe.js";
import { createTool } from "./lib/createTool.js";
import { parseColor } from "./lib/parseColor.js";
import { createMaybe } from "./lib/createMaybe.js";
import { getOpenAi } from "./lib/getOpenAi.js";
import { getImage } from "./lib/getImage.js";
import { createChatSystemMessage } from "./lib/createChatSystemMessage.js";
import { ChatMessage } from "./types/ChatMessage.js";
import { createChatImageMessage } from "./lib/createChatImageMessage.js";
import { getToolCalls } from "./lib/getToolCalls.js";
import { writeImage } from "./lib/writeImage.js";
import { getString } from "./lib/getString.js";
import { createChatToolResponseMessage } from "./lib/createChatToolResponseMessage.js";
import { createSession } from "./lib/createSession.js";
import { getMaybeString } from "./lib/getMaybeString.js";
import { setCellColor } from "./lib/setCellColor.js";
import { Chalk } from "chalk";

const chalk = new Chalk();

const openai = getOpenAi();

const main = async () => {
  const input = createGrid({
    height: 4,
    width: 4,
    color: "red",
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
      const maybeSetColor = setCellColor({
        grid,
        x: params.x,
        y: params.y,
        color: params.color,
      });

      if (!maybeSetColor.ok) {
        throw new Error(
          `Failed to set cell color:\n${getMaybeString({ maybe: maybeSetColor })}`,
        );
      }

      return grid;
    },
  });

  if (!writeCellsOperator.ok) {
    throw new Error(
      `Failed to create writeCells operator: \n${getMaybeString({
        maybe: writeCellsOperator,
      })}`,
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
      console.log(
        "TOOL CALLED WITH PARAMS",
        chalk.yellow(JSON.stringify(params, null, 2)),
      );

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

  const systemPrompt = `You are operating a shell that exposes commands for working with 2D grids of cells. The cells are zero-indexed! Each session is initialized with a target grid and a blank working grid. Your goal is to run commands until the user's request has been satisfied. Every command's output is a stringified version of the working grid. Every time a command exits, the shell's daemon will show you an image of the working grid.`;

  const exampleGridBlue = createGrid({
    height: 8,
    width: 8,
    color: "blue",
  });

  if (!exampleGridBlue.ok) {
    throw new Error(`Failed to create example grid: ${exampleGridBlue.reason}`);
  }

  const exampleGridBlueImage = await getImage({ grid: exampleGridBlue.data });

  if (!exampleGridBlueImage.ok) {
    throw new Error(`Failed to get image: ${exampleGridBlueImage.reason}`);
  }

  const exampleGridPurple = createGrid({
    height: 5,
    width: 5,
    color: "purple",
  });

  if (!exampleGridPurple.ok) {
    throw new Error(
      `Failed to create example grid: ${exampleGridPurple.reason}`,
    );
  }

  const exampleGridPurpleImage = await getImage({
    grid: exampleGridPurple.data,
  });

  if (!exampleGridPurpleImage.ok) {
    throw new Error(`Failed to get image: ${exampleGridPurpleImage.reason}`);
  }

  const maybeMessages = [
    createChatSystemMessage({
      content: systemPrompt,
    }),
    createChatImageMessage({
      text: "Here's an image of an example target grid.",
      dataUrl: exampleGridBlueImage.data.dataUrl,
    }),
    createChatImageMessage({
      text: "And here's an image of the corresponding completed working grid.",
      dataUrl: exampleGridBlueImage.data.dataUrl,
    }),
    createChatImageMessage({
      text: "Here's an image of another example target grid.",
      dataUrl: exampleGridPurpleImage.data.dataUrl,
    }),
    createChatImageMessage({
      text: "And here's an image of the corresponding completed working grid.",
      dataUrl: exampleGridPurpleImage.data.dataUrl,
    }),
    createChatImageMessage({
      text: "Here's an image of the target grid.",
      dataUrl: inputImage.data.dataUrl,
    }),
    createChatImageMessage({
      text: "And here's an image of the blank working grid.",
      dataUrl: workingGridImage.data.dataUrl,
    }),
  ];

  const messages: ChatMessage[] = [];

  for (const maybeMessage of maybeMessages) {
    if (!maybeMessage.ok) {
      throw new Error(`Failed to create message: ${maybeMessage.reason}`);
    }

    messages.push(maybeMessage.data);
  }

  const session = createSession({
    taskId: "micro-solid-grids",
    maxIterations: 100,
    targetGrid: input.data,
    workingGrid: workingGrid.data,
    tools: [maybeWriteCellsTool.data],
  });

  if (!session.ok) {
    throw new Error(`Failed to create session: ${session.reason}`);
  }

  session.data.messages.push(...messages);

  const getWorkingGridImage = async () => {
    const maybeImage = await getImage({ grid: session.data.workingGrid });

    if (!maybeImage.ok) {
      throw new Error(`Failed to get image: ${maybeImage.reason}`);
    }

    return maybeImage.data;
  };

  const writeWorkingGrid = async () => {
    const image = await getImage({ grid: session.data.workingGrid });

    if (!image.ok) {
      throw new Error(`Failed to get image: ${image.reason}`);
    }

    await writeImage({
      image: image.data.image,
      path: `./data/images/arcangel-${session.data.currentIteration}-after-${session.data.numToolCalls}.png`,
    });
  };

  while (session.data.currentIteration < session.data.maxIterations) {
    session.data.currentIteration++;

    await writeWorkingGrid();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      tools: session.data.tools.map((tool) => tool.spec),
      messages: session.data.messages,
    });

    // TODO get the correct type here.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session.data.messages.push(response.choices[0].message as any);

    const toolCalls = getToolCalls({ completion: response });

    if (!toolCalls.ok) {
      throw new Error(`Failed to get tool calls: ${toolCalls.reason}`);
    }

    for (const toolCall of toolCalls.data) {
      session.data.numToolCalls++;

      if (toolCall.tool !== maybeWriteCellsTool.data.spec.function.name) {
        throw new Error(`Invalid tool call: ${toolCall.tool}`);
      }

      maybeWriteCellsTool.data.handler(toolCall.args);

      const maybeToolResponseMessage = createChatToolResponseMessage({
        toolCallId: toolCall.id,
        name: toolCall.tool,
        content: getString({ grid: session.data.workingGrid }),
      });

      if (!maybeToolResponseMessage.ok) {
        throw new Error(
          `Failed to create tool response message: ${maybeToolResponseMessage.reason}`,
        );
      }

      session.data.messages.push(maybeToolResponseMessage.data);
    }

    await writeWorkingGrid();

    const image = await getWorkingGridImage();

    const maybeImageMessage = createChatImageMessage({
      text: "Here's the most recent image of the working grid.",
      dataUrl: image.dataUrl,
    });

    if (!maybeImageMessage.ok) {
      throw new Error(
        `Failed to create image message: ${maybeImageMessage.reason}`,
      );
    }

    session.data.messages.push(maybeImageMessage.data);
  }
};

main();
