import { Field } from "./types/Field.js";
import { createField } from "./createField.js";
import { getPoint } from "./getPoint.js";
import { write } from "./setPoint.js";

export const rotate = (args: { field: Field }): Field => {
  const field = createField({
    height: args.field.width,
    width: args.field.height,
  });

  if (!field.ok) {
    throw new Error(field.reason);
  }

  for (let y = 0; y < args.field.height; y++) {
    for (let x = 0; x < args.field.width; x++) {
      const point = getPoint({ field: args.field, x, y });

      if (!point.ok) {
        throw new Error(point.reason);
      }

      const rotatedY = x;
      const rotatedX = args.field.height - y - 1;

      write({
        field: field.data,
        x: rotatedX,
        y: rotatedY,
        value: point.data.value,
      });
    }
  }

  return field.data;
};
