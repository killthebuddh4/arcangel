import { v4 as uuidv4 } from "uuid";
import { Operator } from "./Operator.js";

export const createOperator = (args: {
  name: string;
  description: string;
  implementation: Operator["implementation"];
}): Operator => {
  return {
    id: uuidv4(),
    name: args.name,
    description: args.description,
    implementation: args.implementation,
  };
};
