import * as Arc from "../Arc.js";

const SelectionSymbol = Symbol("Selection");

type Selection = {
  [SelectionSymbol]: true;
  grid: Arc.Grid;
  x: number;
  y: number;
  w: number;
  h: number;
};

export const parseSelection = (args: {
  grid: Arc.Grid;
  x: number;
  y: number;
  w: number;
  h: number;
}): Selection => {
  const height = args.grid.length;
  const width = args.grid[0].length;

  if (args.x < 0) {
    throw new Error(
      `X must be greater than or equal to 0. Received: ${args.x}`,
    );
  }

  if (args.x >= width) {
    throw new Error(`X must be less than ${width}. Received: ${args.x}`);
  }

  if (args.x + args.w < 0) {
    throw new Error(
      `X + W must be greater than or equal to 0. Received: ${args.x + args.w}`,
    );
  }

  if (args.x + args.w >= width) {
    throw new Error(
      `X + W must be less than ${width}. Received: ${args.x + args.w}`,
    );
  }

  if (args.y < 0) {
    throw new Error(
      `Y must be greater than or equal to 0. Received: ${args.y}`,
    );
  }

  if (args.y >= height) {
    throw new Error(`Y must be less than ${height}. Received: ${args.y}`);
  }

  if (args.y + args.h < 0) {
    throw new Error(
      `Y + H must be greater than or equal to 0. Received: ${args.y + args.h}`,
    );
  }

  if (args.y + args.h >= height) {
    throw new Error(
      `Y + H must be less than ${height}. Received: ${args.y + args.h}`,
    );
  }

  return {
    [SelectionSymbol]: true,
    grid: args.grid,
    x: args.x,
    y: args.y,
    w: args.w,
    h: args.h,
  };
};
