import { Field } from "../types/Field.js";
import { Feedback } from "../types/Feedback.js";
import { getPoint } from "./getPoint.js";
import { createField } from "./createField.js";
import { createFeedback } from "./createFeedback.js";
import { validateX } from "./validateX.js";
import { validateY } from "./validateY.js";
import { setPoint } from "./setPoint.js";
import { validateHeight } from "./validateHeight.js";
import { validateWidth } from "./validateWidth.js";

export const name = "crop";

export const description =
  "Crops the field to the specified dimensions, starting at the specified x and y coordinates";

export const crop = (
  field: Field,
  args: {
    x: number;
    y: number;
    height: number;
    width: number;
  },
): Feedback<Field> => {
  const maybeX = validateX({ field, x: args.x });

  if (!maybeX.ok) {
    return maybeX;
  }

  const maybeY = validateY({ field, y: args.y });

  if (!maybeY.ok) {
    return maybeY;
  }

  const maybeHeight = validateHeight({ field, height: args.height });

  if (!maybeHeight.ok) {
    return maybeHeight;
  }

  const maybeWidth = validateWidth({ field, width: args.width });

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

  for (let y = maybeY.data; y < maybeY.data + maybeHeight.data; y++) {
    for (let x = maybeX.data; x < maybeX.data + maybeWidth.data; x++) {
      const point = getPoint({ field, x, y });

      if (!point.ok) {
        return point;
      }

      const maybeSetPoint = setPoint({
        field: cropped,
        point: {
          x: x - maybeX.data,
          y: y - maybeY.data,
          value: point.data.value,
        },
      });

      if (!maybeSetPoint.ok) {
        return maybeSetPoint;
      }
    }
  }

  return createFeedback({
    ok: true,
    data: cropped,
  });
};
