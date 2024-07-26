import { Field } from "../field/Field.js";
import { Maybe } from "../Maybe.js";
import { read } from "../field/read.js";
import { create } from "../field/create.js";
import { write } from "../field/write.js";

export const crop = (args: {
  field: Field;
  x: number;
  y: number;
  height: number;
  width: number;
}): Maybe<Field> => {
  if (args.height < 1) {
    return {
      ok: false,
      reason: `expected height to be greater than or equal to 1, but got ${args.height}`,
    };
  }

  if (args.width < 1) {
    return {
      ok: false,
      reason: `expected width to be greater than or equal to 1, but got ${args.width}`,
    };
  }

  if (args.x < 0) {
    return {
      ok: false,
      reason: `expected x to be greater than or equal to 0, but got ${args.x}`,
    };
  }

  if (args.x + args.width > args.field.width) {
    return {
      ok: false,
      reason: `expected x + width to be less than or equal to the field width, but got x: ${args.x}, width: ${args.width}, field width: ${args.field.width}`,
    };
  }

  if (args.y < 0) {
    return {
      ok: false,
      reason: `expected y to be greater than or equal to 0, but got ${args.y}`,
    };
  }

  if (args.y + args.height > args.field.height) {
    return {
      ok: false,
      reason: `expected y + height to be less than or equal to the field height, but got y: ${args.y}, height: ${args.height}, field height: ${args.field.height}`,
    };
  }

  const field = create({ height: args.height, width: args.width });

  if (!field.ok) {
    throw new Error(field.reason);
  }

  for (let y = args.y; y < args.y + args.height; y++) {
    for (let x = args.x; x < args.x + args.width; x++) {
      const point = read({ field: args.field, x, y });

      if (!point.ok) {
        throw new Error(point.reason);
      }

      write({
        field: field.data,
        x: x - args.x,
        y: y - args.y,
        value: point.data.value,
      });
    }
  }

  return {
    ok: true,
    data: field.data,
  };
};
