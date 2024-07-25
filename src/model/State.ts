import { Field } from "../field/Field.js";
import { Transition } from "./Transition.js";
import { Fact } from "./Fact.js";

export type State = {
  id: string;
  field: Field;
  facts: Fact[];
  upstream: Transition | null;
  downstream: Transition[];
};
