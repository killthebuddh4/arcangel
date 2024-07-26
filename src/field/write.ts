import { Field } from "./Field.js";
import { Value } from "./Value.js";
import { Maybe } from "../Maybe.js";

export const write = (args: {
  field: Field;
  x: number;
  y: number;
  value: Value;
}): Maybe<Field> => {
  if (args.x < 0) {
    return {
      ok: false,
      reason: `expected x to be greater than or equal to 0, but got ${args.x}`,
    };
  }

  if (args.y < 0) {
    return {
      ok: false,
      reason: `expected y to be greater than or equal to 0, but got ${args.y}`,
    };
  }

  if (args.x >= args.field.width) {
    return {
      ok: false,
      reason: `expected x to be less than ${args.field.width}, but got ${args.x}`,
    };
  }

  if (args.y >= args.field.height) {
    return {
      ok: false,
      reason: `expected y to be less than ${args.field.height}, but got ${args.y}`,
    };
  }

  args.field.points[args.y][args.x].value = args.value;

  return {
    ok: true,
    data: args.field,
  };
};
