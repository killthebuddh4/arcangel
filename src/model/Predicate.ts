import { Field } from "../field/Field.js";

export type Predicate = {
  id: string;
  description: string;
  implementation: (field: Field) => boolean;
};
