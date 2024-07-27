import { z } from "zod";
export const navie = () => null;
import { createTool } from "../openai/createTool.js";
import { draw } from "../primitives/draw.js";
import { create } from "../field/create.js";
import { createFeedback } from "../feedback/createFeedback.js";
import { getRgb } from "../task/getRgb.js";

// give the input image to the model
// tell the model it has a blank field and some tools
// ask the model to draw the image
// apply the generated draw inputs to the field
// ask the model to diff the new image with the old one
// return the diff to the model
// depending on the diff, ask the model to retry or augment the field
// stop after a certain number of iterations
// do this for every input in the dataset and see how many times the model
// can do it.
// oh, also, think of some way to output the intermediate images and results and stuff.

const d = createTool({
  name: "draw",
  description: "draw points on a field",
  inputSchema: z.object({
    points: z.array(
      z.object({
        x: z.number(),
        y: z.number(),
        color: z.union([
          z.literal("red"),
          z.literal("orange"),
          z.literal("yellow"),
          z.literal("green"),
          z.literal("blue"),
          z.literal("purple"),
          z.literal("pink"),
          z.literal("brown"),
          z.literal("gray"),
          z.literal("black"),
        ]),
      }),
    ),
  }),
  outputSchema: z.object({
    success: z.boolean(),
  }),
  handler: (args) => {
    const field = create({ width: 10, height: 10 });

    if (!field.ok) {
      throw new Error(field.reason);
    }

    const points = args.points.map((point) => {
      return {
        x: point.x,
        y: point.y,
        value: getRgb({ color: point.color }),
      };
    });

    const result = draw({ field: field.data, points });

    if (!result.ok) {
      return result;
    }

    return createFeedback({ ok: true, data: { success: true } });
  },
});

const x = d.tool(
  JSON.stringify({
    points: [
      { x: 0, y: 0, color: "black" },
      { x: 1, y: 1, color: "white" },
    ],
  }),
);
