import { z } from "zod";
import { Field } from "./types/Field.js";
import { Feedback } from "./types/Feedback.js";
import { getPoint } from "./getPoint.js";
import { createField } from "./createField.js";
import { write } from "./setPoint.js";
import { createFeedback } from "./createFeedback.js";
import { parseX } from "../field/parseX.js";
import { parseY } from "../field/parseY.js";
import { parseDimension } from "../field/parseDimension.js";
import { getYs } from "../field/getYs.js";
import { getXs } from "../field/getXs.js";
import { Y } from "../field/Y.js";
import { X } from "../field/X.js";

export const name = "crop";

export const description =
  "Crops the field to the specified dimensions, starting at the specified x and y coordinates";

export const schema = z.object({
  x: z.number(),
  y: z.number(),
  height: z.number(),
  width: z.number(),
});

export const crop = (
  field: Field,
  args: z.infer<typeof schema>,
): Feedback<Field> => {
  const maybeX = parseX({ field, x: args.x });

  if (!maybeX.ok) {
    return maybeX;
  }

  const maybeY = parseY({ field, y: args.y });

  if (!maybeY.ok) {
    return maybeY;
  }

  const maybeHeight = parseDimension({ n: args.height });

  if (!maybeHeight.ok) {
    return maybeHeight;
  }

  const maybeWidth = parseDimension({ n: args.width });

  if (!maybeWidth.ok) {
    return maybeWidth;
  }

  if (args.x + args.width > field.width) {
    return createFeedback({
      ok: false,
      code: "TOO_LARGE_X_PLUS_WIDTH",
      reason: `expected x + width to be less than or equal to the field width, but got x: ${args.x}, width: ${args.width}, field width: ${field.width}`,
    });
  }

  if (args.y + args.height > field.height) {
    return createFeedback({
      ok: false,
      code: "TOO_LARGE_Y_PLUS_HEIGHT",
      reason: `expected y + height to be less than or equal to the field height, but got y: ${args.y}, height: ${args.height}, field height: ${field.height}`,
    });
  }

  const cropped = createField({
    height: maybeHeight.data,
    width: maybeHeight.data,
  });

  for (let y of getYs({ field })) {
    if (y < args.y || y >= args.y + args.height) {
      continue;
    }

    for (let x of getXs({ field })) {
      if (x < args.x || x >= args.x + args.width) {
        continue;
      }

      const xCropped = parseX({
        field: cropped,
        x: x - args.x,
      });

      if (!xCropped.ok) {
        throw new Error(xCropped.reason);
      }

      const yCropped = parseY({
        field: cropped,
        y: y - args.y,
      });

      if (!yCropped.ok) {
        throw new Error(yCropped.reason);
      }

      write({
        field: cropped,
        x: xCropped.data,
        y: yCropped.data,
        value: getPoint({ field: field, x, y }),
      });
    }
  }

  return createFeedback({
    ok: true,
    data: cropped,
  });
};
