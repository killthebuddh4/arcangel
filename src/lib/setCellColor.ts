import { Maybe } from "../types/Maybe.js";
import { Cell } from "../types/Cell.js";
import { Color } from "../types/Color.js";
import { Grid } from "../types/Grid.js";
import { createMaybe } from "./createMaybe.js";
import { getCell } from "./getCell.js";

export const setCellColor = (args: {
  grid: Grid;
  x: number;
  y: number;
  color: Color;
}): Maybe<Cell> => {
  const cell = getCell({
    grid: args.grid,
    x: args.x,
    y: args.y,
  });

  cell.color = args.color;

  return createMaybe({
    ok: true,
    data: cell,
  });
};
