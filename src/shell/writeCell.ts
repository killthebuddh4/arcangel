import { Memory } from "./Memory.js";
import { getRgb } from "./getRgb.js";
import { writeCells } from "../grid/writeCells.js";

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
  if (args.memory.grid === null) {
    throw new Error("Memory grid is null");
  }

  const color = getRgb({ color: args.cell.color });

  return writeCells({
    grid: args.memory.grid,
    cells: [
      {
        x: args.cell.x,
        y: args.cell.y,
        value: color,
      },
    ],
  });
};
