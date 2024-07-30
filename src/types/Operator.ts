import { Grid } from "./Grid.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Operator<P = any> = {
  id: string;
  name: string;
  description: string;
  implementation: (grid: Grid, params: P) => Grid;
};
