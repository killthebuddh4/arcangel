import { Grid } from "./Grid.js";
import { Observation } from "./Observation.js";

export type Predicate = {
  id: string;
  description: string;
  implementation: (field: Grid) => Observation;
};
