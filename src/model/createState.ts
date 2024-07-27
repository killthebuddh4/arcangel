import { Transition } from "./Transition.js";
import { State } from "./State.js";
import { Observation } from "../observation/Observation.js";
import { v4 as uuidv4 } from "uuid";
import { Field } from "../field/Field.js";
import { Predicate } from "../predicate/Predicate.js";

export const createState = (args: {
  field: Field;
  data: Array<{ predicate: Predicate; observation: Observation }>;
  upstream: Transition | null;
  downstream: Transition[];
}): State => {
  return {
    id: uuidv4(),
    field: args.field,
    data: args.data,
    upstream: args.upstream,
    downstream: args.downstream,
  };
};
