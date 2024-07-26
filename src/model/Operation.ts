import { Field } from "../field/Field.js";
import { Observation } from "./Observation.js";
import { Predicate } from "./Predicate.js";
import { Relation } from "./Relation.js";

export type Operation = {
  id: string;
  description: string;
  interface: {
    upstream: Array<{ predicate: Predicate; observation: Observation }>;
    downstream: Array<{ predicate: Predicate; observation: Observation }>;
    transition: Array<{ relation: Relation; observation: Observation }>;
  };
  implementation: (field: Field) => Field;
};
