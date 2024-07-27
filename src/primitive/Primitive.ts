import { Field } from "../field/Field.js";
import { Feedback } from "../feedback/Feedback.js";

export type Primitive = {
  id: string;
  name: string;
  description: string;
  implementation: (field: Field, params: unknown) => Feedback<Field>;
};
