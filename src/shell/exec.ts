import { getSystemMessage } from "../openai/getSystemMessage.js";
import { SYSTEM } from "./prompts/SYSTEM.js";
import { createCanvas } from "../canvas/createCanvas.js";
import OpenAI from "openai";
import { SetBounds } from "./commands/SetBounds.js";
import { SetView } from "./commands/SetView.js";
import { WriteColor } from "./commands/WriteColor.js";
import { getImage } from "../canvas/getImage.js";
import { cloneCanvas } from "../canvas/cloneCanvas.js";
import { drawPoints } from "../canvas/drawPoints.js";
import { filterCanvas } from "../canvas/filterCanvas.js";
import { setBoundsToolSpec } from "./commands/setBoundsToolSpec.js";
import { setViewToolSpec } from "./commands/setViewToolSpec.js";
import { writeColorToolSpec } from "./commands/writeColorToolSpec.js";
import { getUserImageMessage } from "../openai/getUserImageMessage.js";
import { getUserTextMessage } from "../openai/getUserTextMessage.js";
import { parseToolCalls } from "./parseToolCalls.js";
import { setBoundsSchema } from "./commands/setBoundsSchema.js";
import { setViewSchema } from "./commands/setViewSchema.js";
import { writeColorSchema } from "./commands/writeColorSchema.js";
import { Message } from "../openai/Message.js";
import { Memory } from "./Memory.js";
import { Point } from "../canvas/Point.js";
import { v4 as uuid } from "uuid";
import { writeImage } from "../writeImage.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const exec = async () => {
  const points: Point[] = [];

  for (let y = 0; y < 100; y++) {
    for (let x = 0; x < 100; x++) {
      points.push({ x, y, value: [255, 255, 255] });
    }
  }

  const memory: Memory = {
    view: {
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0,
    },

    bounds: {
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0,
    },

    commands: [],

    canvas: createCanvas({ points }),
  };

  const getView = () => {
    return filterCanvas({
      canvas: cloneCanvas({ canvas: memory.canvas }),
      filter: (p) => {
        return (
          p.x >= memory.view.minX &&
          p.x <= memory.view.maxX &&
          p.y >= memory.view.minY &&
          p.y <= memory.view.maxY
        );
      },
    });
  };

  const getCanvas = () => {
    return filterCanvas({
      canvas: cloneCanvas({ canvas: memory.canvas }),
      filter: () => true,
      //   return (
      //     p.x >= memory.bounds.minX &&
      //     p.x <= memory.bounds.maxX &&
      //     p.y >= memory.bounds.minY &&
      //     p.y <= memory.bounds.maxY
      //   );
      // },
    });
  };

  const setBounds = (args: SetBounds["parameters"]) => {
    memory.bounds = args.bounds;

    const blackPoints: Point[] = [];

    for (let y = args.bounds.minY; y <= args.bounds.maxY; y++) {
      for (let x = args.bounds.minX; x <= args.bounds.maxX; x++) {
        blackPoints.push({ x, y, value: [0, 0, 0] });
      }
    }

    drawPoints({
      canvas: memory.canvas,
      points: blackPoints,
    });

    memory.commands.push({
      operation: "SET_BOUNDS",
      parameters: args,
    });
  };

  const setView = (args: SetView["parameters"]) => {
    memory.view = args.view;

    memory.commands.push({
      operation: "SET_VIEW",
      parameters: args,
    });
  };

  const writeColor = (args: WriteColor["parameters"]) => {
    memory.commands.push({
      operation: "WRITE_COLOR",
      parameters: args,
    });

    const color: [number, number, number] = (() => {
      switch (args.color) {
        case "red":
          return [255, 0, 0];
        case "orange":
          return [255, 165, 0];
        case "yellow":
          return [255, 255, 0];
        case "green":
          return [0, 255, 0];
        case "blue":
          return [0, 0, 255];
        case "purple":
          return [128, 0, 128];
        case "pink":
          return [255, 192, 203];
        case "brown":
          return [165, 42, 42];
        case "gray":
          return [128, 128, 128];
        case "black":
          return [0, 0, 0];
        default:
          throw new Error(`Invalid color: ${args.color}`);
      }
    })();

    drawPoints({
      canvas: memory.canvas,
      points: [
        {
          x: args.x,
          y: args.y,
          value: color,
        },
      ],
    });
  };

  const LOOP_STATE = {
    id: uuid(),
    maxIterations: 100,
    currentIteration: 0,
    messages: [
      getSystemMessage({
        text: SYSTEM,
      }),
      getUserTextMessage({
        text: "Please draw me something nice",
      }),
    ] as Message[],
  };

  while (LOOP_STATE.currentIteration < LOOP_STATE.maxIterations) {
    LOOP_STATE.currentIteration++;

    await writeImage({
      path: `data/images/shell/${LOOP_STATE.id}-${LOOP_STATE.currentIteration}-canvas.png`,
      canvas: getCanvas(),
    });

    await writeImage({
      path: `data/images/shell/${LOOP_STATE.id}-${LOOP_STATE.currentIteration}-view.png`,
      canvas: getView(),
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      tools: [setBoundsToolSpec, setViewToolSpec, writeColorToolSpec],
      messages: LOOP_STATE.messages,
    });

    console.log(JSON.stringify(response, null, 2));

    const toolCalls = parseToolCalls({ completion: response });

    if (!toolCalls.ok) {
      console.log(
        `Something went wrong with the tool calls: ${toolCalls.reason}`,
      );
      break;
    }

    for (const toolCall of toolCalls.data) {
      switch (toolCall.tool) {
        case "setBounds": {
          console.log("CALLING SET_BOUNDS");
          const args = setBoundsSchema.safeParse(toolCall.args);

          if (!args.success) {
            console.log("invalid setBounds args, exiting");
            break;
          }

          setBounds(args.data);
          break;
        }
        case "setView": {
          console.log("CALLING SET_VIEW");
          const args = setViewSchema.safeParse(toolCall.args);

          if (!args.success) {
            console.log("invalid setView args, exiting");
            break;
          }

          setView(args.data);
          break;
        }
        case "writeColor": {
          console.log("CALLING WRITE_COLOR");
          const args = writeColorSchema.safeParse(toolCall.args);

          if (!args.success) {
            console.log("invalid writeColor args, exiting");
            break;
          }

          writeColor(args.data);
          break;
        }
      }
    }

    const view = getView();
    const viewImage = await getImage({ canvas: view });
    const viewMessage = getUserImageMessage({
      text: "Here is an image of the resulting view",
      dataUrl: viewImage.dataUrl,
    });

    const canvas = getCanvas();
    const canvasImage = await getImage({ canvas });
    const canvasMessage = getUserImageMessage({
      text: "Here is an image of the resulting canvas",
      dataUrl: canvasImage.dataUrl,
    });

    LOOP_STATE.messages.push(canvasMessage, viewMessage);
  }
};
