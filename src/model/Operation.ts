import { Field } from "../field/Field.js";
import { Fact } from "./Fact.js";

export type Operation = {
  id: string;
  description: string;
  interface: {
    input: Fact[];
    output: Fact[];
  };
  implementation: (field: Field) => Field;
};
