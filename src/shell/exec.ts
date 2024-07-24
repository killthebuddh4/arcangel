import { getSystemMessage } from "../openai/getSystemMessage.js";
import { SYSTEM } from "./prompts/SYSTEM.js";
import { createCanvas } from "../canvas/createCanvas.js";
import OpenAI from "openai";
import { initDimensionsSchema } from "./commands/initDimensionsSchema.js";
import { initDimensionsToolSpec } from "./commands/initDimensionsToolSpec.js";
import { writeCellToolSpec } from "./commands/writeCellToolSpec.js";
import { writeCellSchema } from "./commands/writeCellSchema.js";
import { getImage } from "../canvas/getImage.js";
import { getUserImageMessage } from "../openai/getUserImageMessage.js";
import { getUserTextMessage } from "../openai/getUserTextMessage.js";
import { parseToolCalls } from "./parseToolCalls.js";
import { Message } from "../openai/Message.js";
import { v4 as uuid } from "uuid";
import { writeImage } from "../writeImage.js";
import { Memory } from "./Memory.js";
import { writeCell } from "./writeCell.js";
import { initDimensions } from "./initDimensions.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const exec = async () => {
  const LOOP_STATE = {
    id: uuid(),
    maxIterations: 100,
    currentIteration: 0,
    messages: [
      getSystemMessage({
        text: SYSTEM,
      }),
      getUserTextMessage({
        text: "Please draw me a 5x5 green square inside a 20x20 grid.",
      }),
    ] as Message[],
  };

  const memory: Memory = {
    dimensions: {
      height: 0,
      width: 0,
    },
    commands: [],
    canvas: createCanvas({}),
  };

  while (LOOP_STATE.currentIteration < LOOP_STATE.maxIterations) {
    LOOP_STATE.currentIteration++;

    await writeImage({
      path: `data/images/shell/${LOOP_STATE.id}-${LOOP_STATE.currentIteration}-canvas.png`,
      canvas: memory.canvas,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      tools: (() => {
        if (memory.dimensions.height === 0 || memory.dimensions.width === 0) {
          return [initDimensionsToolSpec];
        } else {
          return [writeCellToolSpec];
        }
      })(),
      messages: LOOP_STATE.messages,
    });

    const toolCalls = parseToolCalls({ completion: response });

    if (!toolCalls.ok) {
      const message = response.choices[0].message;
      // TODO FUCK THE OPENAI TYPES!!
      console.log("GOT A MESSAGE", message);
      LOOP_STATE.messages.push(message as Message);
      continue;
    }

    const toolCall = toolCalls.data[0];

    switch (toolCall.tool) {
      case "writeCell": {
        const args = writeCellSchema.safeParse(toolCall.args);

        if (!args.success) {
          console.log("invalid writeCell args, exiting");
          break;
        }

        writeCell({
          memory,
          cell: args.data,
        });
        break;
      }
      case "initDimensions": {
        const args = initDimensionsSchema.safeParse(toolCall.args);

        if (!args.success) {
          console.log("invalid initDimensions args, exiting");
          break;
        }

        initDimensions({
          memory,
          height: args.data.dimensions.height,
          width: args.data.dimensions.width,
        });

        break;
      }
      default: {
        throw new Error(`Invalid tool: ${toolCall.tool}`);
      }
    }

    const image = await getImage({ canvas: memory.canvas });

    const canvasMessage = getUserImageMessage({
      text: "Here is an image of the resulting canvas.",
      dataUrl: image.dataUrl,
    });

    LOOP_STATE.messages.push(canvasMessage);
  }
};
