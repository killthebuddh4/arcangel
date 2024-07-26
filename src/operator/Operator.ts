import { Field } from "../field/Field.js";
import { Observation } from "../observation/Observation.js";
import { Predicate } from "../predicate/Predicate.js";
import { Relation } from "../relation/Relation.js";

export type Operator = {
  id: string;
  description: string;
  interface: {
    upstream: Array<{ predicate: Predicate; observation: Observation }>;
    downstream: Array<{ predicate: Predicate; observation: Observation }>;
    transition: Array<{ relation: Relation; observation: Observation }>;
  };
  implementation: (fields: Field) => Field;
};
