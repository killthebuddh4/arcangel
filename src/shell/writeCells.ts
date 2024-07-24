import { Memory } from "./Memory.js";
import { getRgb } from "./getRgb.js";
import { writeCells as lowLevelWriteCells } from "../grid/writeCells.js";

export const writeCells = (args: {
  memory: Memory;
  cells: Array<{
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
  }>;
}) => {
  if (args.memory.grid === null) {
    throw new Error("Memory grid is null");
  }

  const lowLevelCells = args.cells.map((cell) => {
    return {
      x: cell.x,
      y: cell.y,
      value: getRgb({ color: cell.color }),
    };
  });

  return lowLevelWriteCells({
    grid: args.memory.grid,
    cells: lowLevelCells,
  });
};
