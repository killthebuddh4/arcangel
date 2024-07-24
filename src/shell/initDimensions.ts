import { Memory } from "./Memory.js";
import { createGrid } from "../grid/createGrid.js";

export const initDimensions = (args: {
  memory: Memory;
  height: number;
  width: number;
}) => {
  args.memory.grid = createGrid({
    height: args.height,
    width: args.width,
  });

  return args.memory;
};
