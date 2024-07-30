import { Field } from "./Field.js";
import { Feedback } from "./Feedback.js";

export type Operator = {
  id: string;
  name: string;
  description: string;
  implementation: (field: Field, params: unknown) => Feedback<Field>;
};
