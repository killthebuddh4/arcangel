import { Field } from "../types/Field.js";
import { createField } from "./createField.js";
import { getPoint } from "./getPoint.js";
import { setPoint } from "./setPoint.js";
import { Feedback } from "../types/Feedback.js";
import { createFeedback } from "./createFeedback.js";

export const getRotated = (args: { field: Field }): Feedback<Field> => {
  const rotated = createField({
    height: args.field.width,
    width: args.field.height,
  });

  for (let y = 0; y < args.field.height; y++) {
    for (let x = 0; x < args.field.width; x++) {
      const maybePoint = getPoint({ field: args.field, x, y });

      if (!maybePoint.ok) {
        return maybePoint;
      }

      const maybeSetPoint = setPoint({
        field: rotated,
        point: {
          x: args.field.height - y - 1,
          y: x,
          value: maybePoint.data.value,
        },
      });

      if (!maybeSetPoint.ok) {
        return maybeSetPoint;
      }
    }
  }

  return createFeedback({
    ok: true,
    data: rotated,
  });
};
