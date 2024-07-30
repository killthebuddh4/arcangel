import { Grid } from "./Grid.js";
import { Transition } from "./Transition.js";
import { Observation } from "./Observation.js";
import { Predicate } from "./Predicate.js";

export type State = {
  id: string;
  type: "state";
  grid: Grid;
  data: Array<{ predicate: Predicate; observation: Observation }>;
  upstream: Transition | null;
  downstream: Transition[];
};
