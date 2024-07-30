import { Grid } from "./Grid.js";
import { Observation } from "./Observation.js";

export type Invariant = {
  id: string;
  description: string;
  implementation: (grids: Grid[]) => Observation;
};
