import * as Arc from "../Arc.js";
import { parseSelection } from "./parseSelection.js";

export const select = (args: {
  grid: Arc.Grid;
  x: number;
  y: number;
  w: number;
  h: number;
}) => {
  const selection = parseSelection(args);

  const selected = [] as Arc.Grid;

  const xInitial = Math.min(selection.x, selection.x + selection.w);
  const xFinal = Math.max(selection.x, selection.x + selection.w);
  const yInitial = Math.min(selection.y, selection.y + selection.h);
  const yFinal = Math.max(selection.y, selection.y + selection.h);

  for (let y = yInitial; y < yFinal; y++) {
    const row = [];
    for (let x = xInitial; x < xFinal; x++) {
      row.push(args.grid[y][x]);
    }
    selected.push(row);
  }

  return selected;
};
