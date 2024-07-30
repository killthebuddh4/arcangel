import { Field } from "./Field.js";

export const setPoint = (args: {
  field: Field;
  x: number;
  y: number;
  value: string;
}) => {
  args.field.points[args.y][args.x].value = args.value;
};
