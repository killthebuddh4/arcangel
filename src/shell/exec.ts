import { getSystemMessage } from "../openai/getSystemMessage.js";
import { SYSTEM } from "./SYSTEM.js";
import OpenAI from "openai";
import { writeCellToolSpec } from "./commands/writeCellsToolSpec.js";
import { writeCellSchema } from "./commands/writeCellsSchema.js";
import { getImage } from "../canvas/getImage.js";
import { getUserImageMessage } from "../openai/getUserImageMessage.js";
import { Grid } from "../grid/Grid.js";
import { parseToolCalls } from "./parseToolCalls.js";
import { Message } from "../openai/Message.js";
import { v4 as uuid } from "uuid";
import { writeImage } from "../writeImage.js";
import { Memory } from "./Memory.js";
import { writeCells } from "./writeCells.js";
import { createGrid } from "../grid/createGrid.js";
import { getToolResponseMessage } from "../openai/getToolResponseMessage.js";
import { getHeight } from "../grid/getHeight.js";
import { getWidth } from "../grid/getWidth.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const exec = async (args: { grid: Grid }) => {
  const testImage = await getImage({ grid: args.grid });

  const LOOP_STATE = {
    id: uuid(),
    maxIterations: 100,
    currentIteration: 0,
    messages: [
      getSystemMessage({
        text: SYSTEM,
      }),
      getUserImageMessage({
        text: "Please use the writeCell command to draw a copy of this image.",
        dataUrl: testImage.dataUrl,
      }),
    ] as Message[],
  };

  const memory: Memory = {
    commands: [],
    grid: createGrid({
      height: getHeight({ grid: args.grid }),
      width: getWidth({ grid: args.grid }),
    }),
  };

  await writeImage({
    path: `data/images/shell/${LOOP_STATE.id}-${LOOP_STATE.currentIteration}-test.png`,
    grid: args.grid,
  });

  while (LOOP_STATE.currentIteration < LOOP_STATE.maxIterations) {
    LOOP_STATE.currentIteration++;

    await writeImage({
      path: `data/images/shell/${LOOP_STATE.id}-${LOOP_STATE.currentIteration}-gen.png`,
      grid: memory.grid,
    });

    console.log("MESSAGES", JSON.stringify(LOOP_STATE.messages, null, 2));

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      tools: [writeCellToolSpec],
      messages: LOOP_STATE.messages,
    });

    const toolCalls = parseToolCalls({ completion: response });

    if (!toolCalls.ok) {
      throw new Error(`Failed to parse tool calls: ${toolCalls.reason}`);
    }

    LOOP_STATE.messages.push(response.choices[0].message as Message);

    for (const toolCall of toolCalls.data) {
      console.log(
        "TOOL CALL MESSAGE",
        JSON.stringify(response.choices[0].message),
      );

      if (toolCall.tool !== "writeCells") {
        throw new Error(`Unexpected tool: ${toolCall.tool}`);
      }

      const args = writeCellSchema.safeParse(toolCall.args);

      if (!args.success) {
        throw new Error(
          `Failed to parse tool arguments: ${args.error.message}`,
        );
      }

      LOOP_STATE.messages.push(
        getToolResponseMessage({
          toolCallId: toolCall.id,
          tool: "writeCell",
          result: "cells written",
        }) as Message,
      );

      writeCells({
        memory,
        cells: args.data.cells,
      });
    }

    const image = await getImage({ grid: memory.grid });

    const gridMessage = getUserImageMessage({
      text: "Here is an image of the resulting canvas.",
      dataUrl: image.dataUrl,
    });

    LOOP_STATE.messages.push(gridMessage);
  }
};
