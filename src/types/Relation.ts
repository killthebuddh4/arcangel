import { Grid } from "./Grid.js";
import { Observation } from "./Observation.js";

export type Relation = {
  id: string;
  description: string;
  evaluate: (lhs: Grid, rhs: Grid) => Observation;
};
