import { Memory } from "./Memory.js";

export const initDimensions = (args: {
  memory: Memory;
  height: number;
  width: number;
}) => {
  args.memory.dimensions = {
    height: args.height,
    width: args.width,
  };

  return args.memory;
};
