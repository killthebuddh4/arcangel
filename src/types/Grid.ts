import { Cell } from "./Cell.js";

export type Grid = {
  height: number;
  width: number;
  cells: Cell[][];
};
