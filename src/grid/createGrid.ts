import { v4 as uuidv4 } from "uuid";
import { Grid } from "./Grid.js";
import { Cell } from "./Cell.js";
import { writeCells } from "./writeCells.js";

export const createGrid = (args: {
  height: number;
  width: number;
  opts?: {
    rgb?: [number, number, number];
    cells?: Cell[];
  };
}): Grid => {
  const cells: Cell[] = [];

  const rgb = args.opts?.rgb || [0, 0, 0];

  for (let y = 0; y < args.height; y++) {
    for (let x = 0; x < args.width; x++) {
      cells.push({
        x,
        y,
        value: rgb,
      });
    }
  }

  const grid = { id: uuidv4(), cells };

  if (args.opts?.cells !== undefined) {
    writeCells({ grid, cells: args.opts.cells });
  }

  return grid;
};
