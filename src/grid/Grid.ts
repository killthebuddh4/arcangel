import { Cell } from "./Cell.js";

export type Grid = {
  id: string;
  height: number;
  width: number;
  cells: Cell[][];
};
