import { v4 as uuidv4 } from "uuid";
import { Grid } from "./Grid.js";
import { Cell } from "./Cell.js";
import { Maybe } from "../Maybe.js";

export const createGrid = (args: {
  height: number;
  width: number;
  opts?: {
    cells?: Cell[][];
  };
}): Maybe<Grid> => {
  const cells = args.opts?.cells || [];

  for (let y = 0; y < args.height; y++) {
    const row = cells[y];
    if (row.length !== args.width) {
      return {
        ok: false,
        reason: `expected ${args.width} cells in each row, but row ${y} has ${row.length} cells`,
      };
    }
  }

  return {
    ok: true,
    data: {
      id: uuidv4(),
      height: args.height,
      width: args.width,
      cells,
    },
  };
};
