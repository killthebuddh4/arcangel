import { Transition } from "./types/Transition.js";
import { State } from "./types/State.js";
import { Observation } from "./types/Observation.js";
import { v4 as uuidv4 } from "uuid";
import { Field } from "./types/Field.js";
import { Predicate } from "./types/Predicate.js";

export const createState = (args: {
  field: Field;
  data: Array<{ predicate: Predicate; observation: Observation }>;
  upstream: Transition | null;
  downstream: Transition[];
}): State => {
  return {
    id: uuidv4(),
    type: "state",
    field: args.field,
    data: args.data,
    upstream: args.upstream,
    downstream: args.downstream,
  };
};
