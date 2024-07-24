import { Memory } from "./Memory.js";
import { getRgb } from "./getRgb.js";
import { drawPoints } from "../canvas/drawPoints.js";

export const writeCell = (args: {
  memory: Memory;
  cell: {
    x: number;
    y: number;
    color:
      | "red"
      | "orange"
      | "yellow"
      | "green"
      | "blue"
      | "purple"
      | "pink"
      | "brown"
      | "gray"
      | "black";
  };
}) => {
  const color = getRgb({ color: args.cell.color });

  return drawPoints({
    canvas: args.memory.canvas,
    points: [
      {
        x: args.cell.x,
        y: args.cell.y,
        value: color,
      },
    ],
  });
};
