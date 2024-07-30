import { Grid } from "./Grid.js";
import { Observation } from "./Observation.js";
import { Predicate } from "./Predicate.js";
import { Relation } from "./Relation.js";

export type Transformation = {
  id: string;
  name: string;
  description: string;
  interface: {
    upstream: Array<{ predicate: Predicate; observation: Observation }>;
    downstream: Array<{ predicate: Predicate; observation: Observation }>;
    transition: Array<{ relation: Relation; observation: Observation }>;
  };
  input: Grid;
};
